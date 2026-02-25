"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/model/use-auth";
import { apiClient } from "@/shared/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface InboxItem {
  id: string;
  fromEmail: string;
  notified: boolean;
  sentAt: string | null;
}

export function InboxList() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  const inboxQuery = useQuery({
    queryKey: ["letters", "inbox", user?.uid],
    queryFn: async () => {
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      const token = await user.getIdToken();
      const response = await apiClient.get<{ ok: boolean; data: InboxItem[] }>("/letters/inbox", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    },
    enabled: !loading && Boolean(user),
  });

  const readMutation = useMutation({
    mutationFn: async (letterId: string) => {
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      const token = await user.getIdToken();
      await apiClient.post(
        `/letters/${letterId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["letters", "inbox", user?.uid] });
    },
  });

  if (loading || inboxQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">수신함을 불러오는 중...</p>;
  }

  if (inboxQuery.isError) {
    return <p className="text-sm text-red-600">수신함 조회에 실패했습니다.</p>;
  }

  if (!inboxQuery.data?.length) {
    return <p className="text-sm text-muted-foreground">아직 받은 편지가 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {inboxQuery.data.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-base">{item.fromEmail} 님의 편지</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!item.notified ? <p className="text-sm font-medium">{item.fromEmail} 님이 가치 편지를 보냈어요</p> : null}
            <p className="text-xs text-muted-foreground">보낸 시각: {item.sentAt ?? "확인 불가"}</p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => readMutation.mutate(item.id)}>
                알림 확인
              </Button>
              <Link href={`/letters/${item.id}`} className={cn(buttonVariants({ variant: "default" }))}>
                읽어보기
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
