import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/shared/lib/firebase/admin";
import { verifyRequestToken } from "@/shared/lib/auth/verify-token";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: Params) {
  try {
    const decoded = await verifyRequestToken(req);
    const { id } = await context.params;

    const db = getAdminDb();
    const letterSnap = await db.collection("letters").doc(id).get();

    if (!letterSnap.exists) {
      return NextResponse.json({ ok: false, message: "Letter not found" }, { status: 404 });
    }

    const receiptId = `${id}_${decoded.uid}`;

    await db
      .collection("receipts")
      .doc(receiptId)
      .set(
        {
          id: receiptId,
          letterId: id,
          receiverUid: decoded.uid,
          notified: true,
          seenAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    return NextResponse.json({ ok: true, data: { ok: true } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
