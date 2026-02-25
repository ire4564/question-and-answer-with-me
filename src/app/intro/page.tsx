"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CardContent } from "@/shared/ui/card";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

const INTRO_MESSAGES = [
  "☝️ 편하게 나와 상대방을 생각하면서 써봐요",
  "✌️ 상대방에게 나의 가치를 전달해보세요",
  "💌 그럼 같이 써볼까요?",
];

const DISPLAY_DURATION = 2500;
const FADE_DURATION = 500;

export default function IntroPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) {
      setIsVisible(true);
      return;
    }

    const fadeOutTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, DISPLAY_DURATION);

    const nextMessageTimer = window.setTimeout(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= INTRO_MESSAGES.length) {
          setCompleted(true);
          return prev;
        }
        return nextIndex;
      });
      setIsVisible(true);
    }, DISPLAY_DURATION + FADE_DURATION);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(nextMessageTimer);
    };
  }, [currentIndex, completed]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-10">
        <CardContent className="flex flex-col items-center space-y-8 py-10 w-full">
          <div className="relative h-20 w-full flex items-center justify-center">
            <p
              className={cn(
                "font-bold absolute text-center text-xl leading-8 transition-opacity duration-500",
                isVisible ? "opacity-100" : "opacity-0"
              )}
            >
              {INTRO_MESSAGES[currentIndex]}
            </p>
          </div>
          {completed && (
            <Link
              href="/hub"
              className={cn(
                buttonVariants(),
                "animate-fade-in"
              )}
            >
              시작하기
            </Link>
          )}
        </CardContent>
    </main>
  );
}
