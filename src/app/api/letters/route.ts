import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/shared/lib/firebase/admin";
import { normalizeEmail } from "@/shared/lib/email/normalize-email";
import { verifyRequestToken } from "@/shared/lib/auth/verify-token";
import { validateAnswers } from "@/shared/lib/letters/validation";

interface CreateLetterBody {
  toEmail?: string;
  answers?: unknown;
}

function isEmailFormat(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getMillis(value: unknown) {
  if (value && typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.getTime();
    }
  }

  return 0;
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyRequestToken(req);
    const body = (await req.json()) as CreateLetterBody;

    if (!body.toEmail || typeof body.toEmail !== "string") {
      return NextResponse.json({ ok: false, message: "toEmail is required" }, { status: 400 });
    }

    const toEmail = normalizeEmail(body.toEmail);

    if (!isEmailFormat(toEmail)) {
      return NextResponse.json({ ok: false, message: "Invalid toEmail format" }, { status: 400 });
    }

    if (!validateAnswers(body.answers)) {
      return NextResponse.json({ ok: false, message: "Invalid answers" }, { status: 400 });
    }

    const fromEmail = normalizeEmail(decoded.email ?? "");

    if (!fromEmail) {
      return NextResponse.json({ ok: false, message: "User email is required" }, { status: 400 });
    }

    const db = getAdminDb();
    const letters = db.collection("letters");

    let existingId: string | null = null;

    try {
      const existingSnap = await letters
        .where("fromUid", "==", decoded.uid)
        .where("toEmail", "==", toEmail)
        .orderBy("updatedAt", "desc")
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        existingId = existingSnap.docs[0].id;
      }
    } catch (error: unknown) {
      const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
      if (code !== 9) {
        throw error;
      }

      const fallback = await letters.where("fromUid", "==", decoded.uid).where("toEmail", "==", toEmail).get();
      if (!fallback.empty) {
        const latest = [...fallback.docs].sort((a, b) => getMillis(b.data().updatedAt ?? b.data().sentAt) - getMillis(a.data().updatedAt ?? a.data().sentAt))[0];
        existingId = latest.id;
      }
    }

    const letterRef = existingId ? letters.doc(existingId) : letters.doc();

    await letterRef.set(
      {
        id: letterRef.id,
        fromUid: decoded.uid,
        fromEmail,
        toEmail,
        answers: body.answers,
        status: "sent",
        updatedAt: FieldValue.serverTimestamp(),
        sentAt: FieldValue.serverTimestamp(),
        ...(existingId ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true },
    );

    return NextResponse.json({
      ok: true,
      data: {
        letterId: letterRef.id,
        status: "sent",
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
