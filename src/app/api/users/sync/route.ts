import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/shared/lib/firebase/admin";
import { verifyRequestToken } from "@/shared/lib/auth/verify-token";

export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyRequestToken(req);
    const email = decoded.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ message: "email is required" }, { status: 400 });
    }

    await getAdminDb()
      .collection("users")
      .doc(decoded.uid)
      .set(
        {
          uid: decoded.uid,
          email,
          displayName: decoded.name ?? "",
          photoURL: decoded.picture ?? null,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
