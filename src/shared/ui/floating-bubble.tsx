"use client";

import { cn } from "@/shared/lib/utils";

interface FloatingBubbleProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingBubble({ children, className, delay = 0 }: FloatingBubbleProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full bg-black px-3 py-1.5 text-xs text-white shadow-md",
        "animate-float",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black" />
    </div>
  );
}
