import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/shared/lib/firebase/admin";
import { normalizeEmail } from "@/shared/lib/email/normalize-email";
import { verifyRequestToken } from "@/shared/lib/auth/verify-token";

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

function toIsoStringOrNull(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyRequestToken(req);
    const email = normalizeEmail(decoded.email ?? "");

    if (!email) {
      return NextResponse.json({ ok: false, message: "User email is required" }, { status: 400 });
    }

    const db = getAdminDb();
    let snapshot;
    try {
      snapshot = await db.collection("letters").where("toEmail", "==", email).orderBy("sentAt", "desc").get();
    } catch (error: unknown) {
      const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
      if (code !== 9) {
        throw error;
      }

      const fallback = await db.collection("letters").where("toEmail", "==", email).get();
      const sortedDocs = [...fallback.docs].sort((a, b) => {
        const aSentAt = getSentAtMillis(a.data().sentAt);
        const bSentAt = getSentAtMillis(b.data().sentAt);
        return bSentAt - aSentAt;
      });

      snapshot = { docs: sortedDocs };
    }

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
          sentAt: toIsoStringOrNull(data.sentAt),
          notified: receiptData?.notified ?? false,
          seenAt: toIsoStringOrNull(receiptData?.seenAt),
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
