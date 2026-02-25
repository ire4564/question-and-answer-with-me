"use client";

import { MAX_ANSWER_LENGTH } from "@/entities/question/model/questions";
import { Textarea } from "@/shared/ui/textarea";

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AnswerInput({ value, onChange }: AnswerInputProps) {
  const answerLength = value.length;

  return (
    <div className="space-y-2">
      <label htmlFor="answer-input" className="sr-only">
        답변 입력
      </label>
      <Textarea
        id="answer-input"
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, MAX_ANSWER_LENGTH))}
        maxLength={MAX_ANSWER_LENGTH}
        rows={8}
        placeholder="마음을 담아 써보세요..."
        className="h-[180px] max-h-[180px] resize-none overflow-y-auto border-0 p-2 text-[14px] leading-[24px] text-foreground/80 shadow-none ring-0 placeholder:text-primary/30 focus-visible:ring-0"
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 23px, hsl(var(--primary) / 0.2) 24px)",
          backgroundPositionY: "9px",
        }}
      />
      <p className="text-right text-xs tracking-wide text-primary/40" aria-live="polite">
        {answerLength} / {MAX_ANSWER_LENGTH}
      </p>
    </div>
  );
}
