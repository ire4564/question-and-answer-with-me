"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { getFirebaseAuth, hasFirebaseClientEnv } from "@/shared/lib/firebase/client";
import { apiClient } from "@/shared/api/client";

export function GoogleLoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const envReady = hasFirebaseClientEnv();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const firebaseAuth = getFirebaseAuth();
      if (!firebaseAuth) {
        throw new Error("Firebase 환경변수가 로드되지 않았습니다. dev 서버를 재시작해 주세요.");
      }
      const credential = await signInWithPopup(firebaseAuth, provider);
      const token = await credential.user.getIdToken();

      const sentResponse = await apiClient.get<{ ok: boolean; data: Array<{ id: string }> }>("/letters/sent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (sentResponse.data.data.length > 0) {
        router.push("/hub");
        return;
      }

      router.push("/intro");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("로그인에 실패했어요. 다시 시도해 주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button type="button" onClick={handleLogin} disabled={loading || !envReady}>
        {loading ? "로그인 중..." : "구글 로그인하기"}
      </Button>
      {!envReady ? (
        <p className="text-sm text-red-600">Firebase 설정 로딩 전입니다. 서버 재시작 후 다시 시도해 주세요.</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
