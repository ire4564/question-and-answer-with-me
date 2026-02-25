"use client";

import { AnswerInput } from "./answer-input";
import { RecipientInput } from "./recipient-input";

interface LetterContentProps {
  progressLabel: string;
  isLastStep: boolean;
  currentAnswer: string;
  toEmail: string;
  onAnswerChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function LetterContent({
  progressLabel,
  isLastStep,
  currentAnswer,
  toEmail,
  onAnswerChange,
  onEmailChange,
}: LetterContentProps) {
  return (
    <div className="flex-1">
      <p className="mb-4 text-right text-xs uppercase tracking-[0.2em] text-primary/50">
        {progressLabel}
      </p>

      {!isLastStep ? (
        <AnswerInput value={currentAnswer} onChange={onAnswerChange} />
      ) : (
        <RecipientInput value={toEmail} onChange={onEmailChange} />
      )}
    </div>
  );
}
