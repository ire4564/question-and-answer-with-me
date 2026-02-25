"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/model/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button, buttonVariants } from "@/shared/ui/button";
import { apiClient } from "@/shared/api/client";
import { buildAnswersFromState } from "@/features/write/model/use-letter-draft";
import { clearDraft, loadDraftState } from "@/shared/lib/letters/draft-storage";
import { cn } from "@/shared/lib/utils";

const MIN_WAIT_MS = 3000;

export function WaitingView() {
  const { user, loading } = useAuth();
  const [message, setMessage] = useState("상대에게 가치 편지를 보내고 있어요");
  const [error, setError] = useState<string | null>(null);

  const draft = useMemo(() => loadDraftState(), []);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      const token = await user.getIdToken();
      const answers = buildAnswersFromState(draft);

      if (!draft.toEmail || answers.length === 0) {
        throw new Error("제출할 답변 또는 이메일이 없습니다.");
      }

      await apiClient.post(
        "/letters",
        {
          toEmail: draft.toEmail,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return true;
    },
    onSuccess: async () => {
      await new Promise((resolve) => window.setTimeout(resolve, MIN_WAIT_MS));
      clearDraft();
      setMessage("상대의 편지를 기다리고 있어요");
    },
    onError: (err) => {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }

      setError("전송 중 오류가 발생했습니다.");
    },
  });

  useEffect(() => {
    if (loading || !user || submitMutation.isPending || submitMutation.isSuccess || submitMutation.isError) {
      return;
    }

    submitMutation.mutate();
  }, [loading, submitMutation, user]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">로그인 상태를 확인 중...</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>편지 상태</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-semibold">{message}</p>

        {submitMutation.isPending ? <p className="text-sm text-muted-foreground">잠시만 기다려 주세요...</p> : null}

        {submitMutation.isSuccess ? (
          <Link href="/inbox" className={cn(buttonVariants())}>
            수신함으로 이동
          </Link>
        ) : null}

        {error ? (
          <div className="space-y-2">
            <p className="text-sm text-red-600">{error}</p>
            <Button type="button" onClick={() => submitMutation.mutate()}>
              다시 시도
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
