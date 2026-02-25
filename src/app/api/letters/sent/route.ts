import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/shared/lib/firebase/admin";
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
    const db = getAdminDb();

    let docs;

    try {
      const snapshot = await db.collection("letters").where("fromUid", "==", decoded.uid).orderBy("sentAt", "desc").get();
      docs = snapshot.docs;
    } catch (error: unknown) {
      const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
      if (code !== 9) {
        throw error;
      }

      const fallback = await db.collection("letters").where("fromUid", "==", decoded.uid).get();
      docs = [...fallback.docs].sort((a, b) => {
        const aSentAt = getSentAtMillis(a.data().sentAt);
        const bSentAt = getSentAtMillis(b.data().sentAt);
        return bSentAt - aSentAt;
      });
    }

    const data = docs.map((doc) => {
      const letter = doc.data();
      return {
        id: doc.id,
        toEmail: letter.toEmail,
        sentAt: toIsoStringOrNull(letter.sentAt),
        status: letter.status,
      };
    });

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
