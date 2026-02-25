"use client";

import { ReactNode } from "react";

interface QuestionPanelProps {
  title?: string;
  prompt?: ReactNode;
  isLastStep: boolean;
}

export function QuestionPanel({
  title,
  prompt,
  isLastStep,
}: QuestionPanelProps) {
  return (
    <aside className="flex flex-col justify-end border-r border-primary/20 pr-8 lg:pr-12">
      <div className="space-y-1">
        {!isLastStep && title && prompt ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary/60">
              {title}
            </p>
            <div className="text-lg leading-snug text-gray-700">
              {prompt}
            </div>
          </>
        ) : (
          <div className="text-lg leading-snug text-gray-700">
            <p className="font-extrabold mb-1">마지막으로,</p>
            받는 사람의 이메일을 <br/>
            꼭 확인하고 제출해 주세요 💌
          </div>
        )}
      </div>
    </aside>
  );
}
