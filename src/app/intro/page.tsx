"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

const INTRO_MESSAGES = [
  "1시간동안 편하게 나와 상대방을 생각하면서 써봐요.",
  "상대방에게 나의 가치를 전달해보세요.",
  "자, 그럼 같이 써볼까요?",
];

const REVEAL_INTERVAL = 1400;

export default function IntroPage() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= INTRO_MESSAGES.length) {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, REVEAL_INTERVAL);

    return () => window.clearTimeout(timer);
  }, [visibleCount]);

  const completed = visibleCount >= INTRO_MESSAGES.length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>가치 편지 인트로</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {INTRO_MESSAGES.slice(0, visibleCount).map((message) => (
              <p key={message} className="rounded-md bg-secondary/70 p-3 text-sm leading-6">
                {message}
              </p>
            ))}
          </div>
          <Link
            href="/hub"
            aria-disabled={!completed}
            className={cn(
              buttonVariants({ variant: "default" }),
              !completed ? "pointer-events-none opacity-50" : "",
            )}
          >
            시작하기
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
