"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MAX_ANSWER_LENGTH } from "@/entities/question/model/questions";
import { useLetterDraft } from "@/features/write/model/use-letter-draft";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

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

  const answerLength = currentAnswer.length;

  const goNext = () => {
    if (isLastStep) {
      router.push("/waiting");
      return;
    }

    nextStep();
  };

  return (
    <section className="relative w-full overflow-hidden rounded-xl border border-[#d7c7b7] bg-[#f8f2e7] p-4 shadow-[0_24px_60px_-40px_rgba(92,66,33,0.45)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,168,77,0.16),transparent_42%),radial-gradient(circle_at_83%_85%,rgba(194,146,96,0.12),transparent_38%)]" />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_280px]">
        <aside className="flex flex-col justify-between rounded-lg border border-[#dcc3b0] bg-[#fffaf0] p-4 sm:p-5">
          <div className="space-y-4">
            <div className="ml-auto h-16 w-16 border border-dashed border-[#f49f28] opacity-90" />
            {!isLastStep && currentQuestion ? (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[#ab7241]">{currentQuestion.title}</p>
                <p className="text-lg leading-8 text-[#4f3c26]">{currentQuestion.prompt}</p>
              </div>
            ) : (
              <p className="text-lg leading-8 text-[#4f3c26]">
                마지막으로 받는 사람 이메일을 확인하고 제출해 주세요.
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-2">
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0} className="border-[#d6bfaa] bg-[#fbf3e8]">
              이전
            </Button>
            <Button type="button" onClick={goNext} disabled={isLastStep && toEmail.trim().length === 0} className="bg-[#f49f28] text-white hover:bg-[#e38f1b]">
              {isLastStep ? "제출하기" : "다음"}
            </Button>
          </div>
        </aside>

        <div className="rounded-lg border border-[#dcc3b0] bg-[#fffaf0] px-4 pb-4 pt-3 sm:px-6">
          <div className="mb-3 flex items-center justify-between border-b border-[#eadccf] pb-2">
            <p className="text-sm tracking-wide text-[#9a6336]">VALUE LETTER</p>
            <p className="text-xs uppercase tracking-[0.22em] text-[#b27d4f]">{progressLabel}</p>
          </div>

          {!isLastStep && currentQuestion ? (
            <div className="space-y-2">
              <label htmlFor="answer-input" className="sr-only">
                답변 입력
              </label>
              <Textarea
                id="answer-input"
                value={currentAnswer}
                onChange={(event) => setCurrentAnswer(event.target.value.slice(0, MAX_ANSWER_LENGTH))}
                maxLength={MAX_ANSWER_LENGTH}
                rows={16}
                placeholder="마음을 담아 편지처럼 작성해 보세요."
                className="min-h-[420px] resize-none border-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_33px,#eadccf_34px)] px-2 py-1 text-[17px] leading-[34px] text-[#4a3724] shadow-none ring-0 focus-visible:ring-0"
              />
              <p className="text-right text-xs tracking-wide text-[#ad7749]" aria-live="polite">
                {answerLength} / {MAX_ANSWER_LENGTH}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="to-email" className="text-sm font-medium text-[#6f4e31]">
                받는 사람 이메일
              </label>
              <Input
                id="to-email"
                type="email"
                value={toEmail}
                onChange={(event) => setToEmail(event.target.value)}
                placeholder="partner@example.com"
                className="border-[#d8c0a9] bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
