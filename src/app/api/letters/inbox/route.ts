import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/shared/lib/firebase/admin";
import { normalizeEmail } from "@/shared/lib/email/normalize-email";
import { verifyRequestToken } from "@/shared/lib/auth/verify-token";

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyRequestToken(req);
    const email = normalizeEmail(decoded.email ?? "");

    if (!email) {
      return NextResponse.json({ ok: false, message: "User email is required" }, { status: 400 });
    }

    const db = getAdminDb();
    const snapshot = await db.collection("letters").where("toEmail", "==", email).orderBy("sentAt", "desc").get();

    const letters = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const receiptId = `${doc.id}_${decoded.uid}`;
        const receiptRef = db.collection("receipts").doc(receiptId);
        const receiptSnap = await receiptRef.get();

        if (!receiptSnap.exists) {
          await receiptRef.set({
            id: receiptId,
            letterId: doc.id,
            receiverUid: decoded.uid,
            notified: false,
            seenAt: null,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
        }

        const receiptData = receiptSnap.exists
          ? receiptSnap.data()
          : {
              notified: false,
              seenAt: null,
            };

        return {
          id: doc.id,
          fromUid: data.fromUid,
          fromEmail: data.fromEmail,
          toEmail: data.toEmail,
          status: data.status,
          sentAt: data.sentAt ?? null,
          notified: receiptData?.notified ?? false,
          seenAt: receiptData?.seenAt ?? null,
        };
      }),
    );

    return NextResponse.json({ ok: true, data: letters });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
