"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { getFirebaseAuth } from "@/shared/lib/firebase/client";

export function GoogleLoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const firebaseAuth = getFirebaseAuth();
      await signInWithPopup(firebaseAuth, provider);
      router.push("/intro");
    } catch {
      setError("로그인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button type="button" onClick={handleLogin} disabled={loading}>
        {loading ? "로그인 중..." : "구글 로그인하기"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
