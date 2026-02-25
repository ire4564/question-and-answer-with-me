"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/model/use-auth";
import { apiClient } from "@/shared/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface SentItem {
  id: string;
}

export function PostLoginActions() {
  const { user, loading } = useAuth();

  const sentQuery = useQuery({
    queryKey: ["letters", "sent", user?.uid],
    queryFn: async () => {
      if (!user) {
        return [] as SentItem[];
      }

      const token = await user.getIdToken();
      const response = await apiClient.get<{ ok: boolean; data: SentItem[] }>("/letters/sent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    },
    enabled: !loading && Boolean(user),
  });

  if (loading || sentQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">기록을 확인하는 중...</p>;
  }

  if (sentQuery.isError) {
    return <p className="text-sm text-red-600">기록 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>;
  }

  const hasHistory = Boolean(sentQuery.data?.length);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{hasHistory ? "어디로 이동할까요?" : "질문 작성을 시작해요"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hasHistory ? (
          <>
            <Link href="/my-letters" className={cn(buttonVariants({ variant: "default" }), "w-full justify-center")}>
              내가 작성한 답변 보러가기
            </Link>
            <Link href="/inbox" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}>
              수신함
            </Link>
          </>
        ) : (
          <Link href="/write" className={cn(buttonVariants({ variant: "default" }), "w-full justify-center")}>
            질문 작성 시작하기
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
