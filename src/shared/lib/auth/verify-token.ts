import { NextRequest } from "next/server";
import { getAdminAuth } from "@/shared/lib/firebase/admin";

function readBearerToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length);
}

export async function verifyRequestToken(req: NextRequest) {
  const tokenFromHeader = readBearerToken(req);
  const tokenFromCookie = req.cookies.get("fb_token")?.value;
  const token = tokenFromHeader ?? tokenFromCookie;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    return decodedToken;
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
