"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSentLetters } from "@/features/home/model/use-sent-letters";
import { CardContent } from "@/shared/ui/card";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function PostLoginActions() {
  const router = useRouter();
  const { isLoading, isError, hasHistory } = useSentLetters();

  useEffect(() => {
    if (!isLoading && !isError && !hasHistory) {
      router.replace("/write");
    }
  }, [isLoading, isError, hasHistory, router]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">기록을 확인하는 중...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">기록 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>;
  }

  if (!hasHistory) {
    return <p className="text-sm text-muted-foreground">질문 작성 페이지로 이동 중...</p>;
  }

  return (
    <div className="w-full py-4">
      <p className="text-center text-sm font-bold mb-6">menu.</p>
      <CardContent className="flex flex-col items-center space-y-3">
        <Link href="/my-letters" className={cn(buttonVariants())}>
          내가 작성한 답변 보러가기
        </Link>
        <Link href="/inbox" className={cn(buttonVariants(), "bg-primary text-primary-foreground hover:bg-primary/90")}>
          💌{'  '} 수신함
        </Link>
      </CardContent>
    </div>
  );
}
