import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/shared/lib/firebase/admin";
import { normalizeEmail } from "@/shared/lib/email/normalize-email";
import { verifyRequestToken } from "@/shared/lib/auth/verify-token";
import { validateAnswers } from "@/shared/lib/letters/validation";
import { FieldValue } from "firebase-admin/firestore";

interface Params {
  params: Promise<{ id: string }>;
}

function getSentAtMillis(value: unknown) {
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

export async function GET(req: NextRequest, context: Params) {
  try {
    const decoded = await verifyRequestToken(req);
    const currentEmail = normalizeEmail(decoded.email ?? "");
    const { id } = await context.params;

    const db = getAdminDb();
    const letterRef = db.collection("letters").doc(id);
    const letterSnap = await letterRef.get();

    if (!letterSnap.exists) {
      return NextResponse.json({ ok: false, message: "Letter not found" }, { status: 404 });
    }

    const letter = letterSnap.data();

    if (!letter) {
      return NextResponse.json({ ok: false, message: "Letter not found" }, { status: 404 });
    }

    const isSender = letter.fromUid === decoded.uid;
    const isReceiver = letter.toEmail === currentEmail;

    if (!isSender && !isReceiver) {
      return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
    }

    const targetEmail = normalizeEmail(letter.fromEmail ?? "");
    let myAnswers: unknown[] = [];

    try {
      const mySentLetterSnap = await db
        .collection("letters")
        .where("fromUid", "==", decoded.uid)
        .where("toEmail", "==", targetEmail)
        .orderBy("sentAt", "desc")
        .limit(1)
        .get();

      myAnswers = mySentLetterSnap.empty ? [] : (mySentLetterSnap.docs[0].data().answers ?? []);
    } catch (error: unknown) {
      const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
      if (code !== 9) {
        throw error;
      }

      const fallback = await db
        .collection("letters")
        .where("fromUid", "==", decoded.uid)
        .where("toEmail", "==", targetEmail)
        .get();

      if (!fallback.empty) {
        const latest = [...fallback.docs].sort((a, b) => getSentAtMillis(b.data().sentAt) - getSentAtMillis(a.data().sentAt))[0];
        myAnswers = latest.data().answers ?? [];
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: letter.id,
        fromUid: letter.fromUid,
        fromEmail: letter.fromEmail,
        toEmail: letter.toEmail,
        answers: letter.answers,
        myAnswers,
        sentAt: letter.sentAt,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}

interface UpdateLetterBody {
  toEmail?: string;
  answers?: unknown;
}

function isEmailFormat(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function PATCH(req: NextRequest, context: Params) {
  try {
    const decoded = await verifyRequestToken(req);
    const { id } = await context.params;
    const body = (await req.json()) as UpdateLetterBody;

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

    const db = getAdminDb();
    const letterRef = db.collection("letters").doc(id);
    const letterSnap = await letterRef.get();

    if (!letterSnap.exists) {
      return NextResponse.json({ ok: false, message: "Letter not found" }, { status: 404 });
    }

    const letter = letterSnap.data();
    if (!letter || letter.fromUid !== decoded.uid) {
      return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
    }

    await letterRef.set(
      {
        toEmail,
        answers: body.answers,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
