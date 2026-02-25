import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/shared/lib/firebase/admin";
import { normalizeEmail } from "@/shared/lib/email/normalize-email";
import { verifyRequestToken } from "@/shared/lib/auth/verify-token";

interface Params {
  params: Promise<{ id: string }>;
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

    const mySentLetterSnap = await db
      .collection("letters")
      .where("fromUid", "==", decoded.uid)
      .where("toEmail", "==", normalizeEmail(letter.fromEmail ?? ""))
      .orderBy("sentAt", "desc")
      .limit(1)
      .get();

    const myAnswers = mySentLetterSnap.empty ? [] : (mySentLetterSnap.docs[0].data().answers ?? []);

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
