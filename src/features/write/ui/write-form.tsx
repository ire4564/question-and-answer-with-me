"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MAX_ANSWER_LENGTH } from "@/entities/question/model/questions";
import { useLetterDraft } from "@/features/write/model/use-letter-draft";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>질문 작성</CardTitle>
        <CardDescription>진행: {progressLabel}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!isLastStep && currentQuestion ? (
          <>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground">{currentQuestion.title}</p>
              <p className="text-base font-medium leading-7">{currentQuestion.prompt}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="answer-input" className="text-sm font-medium">
                답변 입력
              </label>
              <Textarea
                id="answer-input"
                value={currentAnswer}
                onChange={(event) => setCurrentAnswer(event.target.value.slice(0, MAX_ANSWER_LENGTH))}
                maxLength={MAX_ANSWER_LENGTH}
                rows={8}
                placeholder="여기에 답변을 적어주세요"
              />
              <p className="text-right text-xs text-muted-foreground" aria-live="polite">
                {answerLength} / {MAX_ANSWER_LENGTH}
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <label htmlFor="to-email" className="text-sm font-medium">
              상대 이메일
            </label>
            <Input
              id="to-email"
              type="email"
              value={toEmail}
              onChange={(event) => setToEmail(event.target.value)}
              placeholder="partner@example.com"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
            이전
          </Button>
          <Button type="button" onClick={goNext} disabled={isLastStep && toEmail.trim().length === 0}>
            {isLastStep ? "제출하기" : "다음"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
