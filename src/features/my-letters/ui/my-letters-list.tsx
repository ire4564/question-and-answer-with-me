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
  toEmail: string;
  sentAt: string | null;
}

export function MyLettersList() {
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
    return <p className="text-sm text-muted-foreground">작성한 답변을 불러오는 중...</p>;
  }

  if (sentQuery.isError) {
    return <p className="text-sm text-red-600">목록을 불러오지 못했습니다.</p>;
  }

  if (!sentQuery.data?.length) {
    return <p className="text-sm text-muted-foreground">작성한 답변이 아직 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {sentQuery.data.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-base">수신자: {item.toEmail}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">보낸 시각: {item.sentAt ?? "확인 불가"}</p>
            <Link href={`/my-letters/${item.id}`} className={cn(buttonVariants({ variant: "default" }))}>
              이 답변 보기
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
