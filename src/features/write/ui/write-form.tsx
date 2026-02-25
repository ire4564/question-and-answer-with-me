"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLetterDraft } from "@/features/write/model/use-letter-draft";
import { QuestionPanel } from "./question-panel";
import { LetterContent } from "./letter-content";
import { Button } from "@/shared/ui/button";

export function WriteForm() {
  const router = useRouter();
  const { step, totalQuestions, currentQuestion, currentAnswer, toEmail, setCurrentAnswer, setToEmail, nextStep, prevStep, isLastStep } =
    useLetterDraft();

  const progressLabel = useMemo(() => {
    if (isLastStep) {
      return "마지막 단계";
    }

    return `${step + 1} / ${totalQuestions}`;
  }, [isLastStep, step, totalQuestions]);

  const goNext = () => {
    if (isLastStep) {
      router.push("/waiting");
      return;
    }

    nextStep();
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <section className="relative max-h-[60vh] overflow-hidden rounded-sm border border-primary/30 bg-[#faf8f5] p-8 shadow-[0_4px_20px_-4px_rgba(92,66,33,0.15)] sm:p-12">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.3em] text-primary/70">
          VALUE LETTER
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <QuestionPanel
            title={currentQuestion?.title}
            prompt={currentQuestion?.prompt}
            isLastStep={isLastStep}
          />

          <div className="flex flex-col">
            <div className="mb-6 ml-auto h-20 w-20 border border-dashed border-primary/40" />
            
            <LetterContent
              progressLabel={progressLabel}
              isLastStep={isLastStep}
              currentAnswer={currentAnswer}
              toEmail={toEmail}
              onAnswerChange={setCurrentAnswer}
              onEmailChange={setToEmail}
            />

          </div>
        </div>

        <p className="mt-8 text-center text-xs tracking-wide text-primary/50">
          hope with u.
        </p>
      </section>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button type="button" className="min-w-[100px]" onClick={prevStep} disabled={step === 0}>
          이전
        </Button>
        <Button type="button" className="min-w-[100px]" onClick={goNext} disabled={isLastStep && toEmail.trim().length === 0}>
          {isLastStep ? "제출하기" : "다음"}
        </Button>
      </div>
    </div>
  );
}
