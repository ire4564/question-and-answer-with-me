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
    const letterRef = db.collection("letters").doc();

    await letterRef.set({
      id: letterRef.id,
      fromUid: decoded.uid,
      fromEmail,
      toEmail,
      answers: body.answers,
      status: "sent",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      sentAt: FieldValue.serverTimestamp(),
    });

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
