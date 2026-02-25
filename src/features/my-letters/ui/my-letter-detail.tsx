"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUESTION_SECTIONS, MAX_ANSWER_LENGTH } from "@/entities/question/model/questions";
import { useAuth } from "@/features/auth/model/use-auth";
import { apiClient } from "@/shared/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";

interface LetterAnswer {
  sectionId: string;
  questionId: string;
  answerText: string;
}

interface LetterDetailResponse {
  id: string;
  toEmail: string;
  answers: LetterAnswer[];
}

const ORDERED_QUESTIONS = QUESTION_SECTIONS.flatMap((section) =>
  section.questions.map((question) => ({
    sectionId: section.sectionId,
    questionId: question.questionId,
    title: section.title,
    prompt: question.prompt,
  })),
);

function answerKey(sectionId: string, questionId: string) {
  return `${sectionId}:${questionId}`;
}

function toMap(answers: LetterAnswer[]) {
  const map: Record<string, string> = {};
  answers.forEach((answer) => {
    map[answerKey(answer.sectionId, answer.questionId)] = answer.answerText;
  });
  return map;
}

export function MyLetterDetail() {
  const params = useParams<{ id: string }>();
  const letterId = params?.id ?? "";
  const { user, loading } = useAuth();

  const [slideIndex, setSlideIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editStep, setEditStep] = useState(0);
  const [toEmail, setToEmail] = useState("");
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});

  const detailQuery = useQuery({
    queryKey: ["my-letter", letterId, user?.uid],
    queryFn: async () => {
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      const token = await user.getIdToken();
      const response = await apiClient.get<{ ok: boolean; data: LetterDetailResponse }>(`/letters/${letterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    },
    enabled: !loading && Boolean(user) && Boolean(letterId),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !detailQuery.data) {
        throw new Error("저장할 데이터를 찾지 못했습니다.");
      }

      const token = await user.getIdToken();
      const answers = ORDERED_QUESTIONS.map((q) => ({
        sectionId: q.sectionId,
        questionId: q.questionId,
        answerText: answersMap[answerKey(q.sectionId, q.questionId)] ?? "",
      }));

      await apiClient.patch(
        `/letters/${letterId}`,
        {
          toEmail,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: async () => {
      await detailQuery.refetch();
      setEditing(false);
      setEditStep(0);
    },
  });

  const currentSlide = ORDERED_QUESTIONS[slideIndex];
  const totalSlides = ORDERED_QUESTIONS.length;
  const editQuestion = ORDERED_QUESTIONS[editStep] ?? null;
  const isLastEditStep = editStep === ORDERED_QUESTIONS.length;

  const currentAnswer = useMemo(() => {
    if (!currentSlide || !detailQuery.data) {
      return "";
    }

    const key = answerKey(currentSlide.sectionId, currentSlide.questionId);
    const map = toMap(detailQuery.data.answers);
    return map[key] ?? "(답변 없음)";
  }, [currentSlide, detailQuery.data]);

  if (loading || detailQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">답변을 불러오는 중...</p>;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <p className="text-sm text-red-600">답변을 불러오지 못했습니다.</p>;
  }

  if (editing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>답변 수정 ({isLastEditStep ? "마지막 단계" : `${editStep + 1} / ${ORDERED_QUESTIONS.length}`})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLastEditStep && editQuestion ? (
            <>
              <p className="text-xs font-semibold uppercase text-muted-foreground">{editQuestion.title}</p>
              <p className="text-base font-medium leading-7">{editQuestion.prompt}</p>
              <Textarea
                value={answersMap[answerKey(editQuestion.sectionId, editQuestion.questionId)] ?? ""}
                onChange={(event) => {
                  const value = event.target.value.slice(0, MAX_ANSWER_LENGTH);
                  setAnswersMap((prev) => ({
                    ...prev,
                    [answerKey(editQuestion.sectionId, editQuestion.questionId)]: value,
                  }));
                }}
                rows={8}
                maxLength={MAX_ANSWER_LENGTH}
              />
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">수신자 이메일</p>
              <Input type="email" value={toEmail} onChange={(event) => setToEmail(event.target.value)} />
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <Button type="button" variant="outline" onClick={() => setEditStep((prev) => Math.max(prev - 1, 0))}>
              이전
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (isLastEditStep) {
                  saveMutation.mutate();
                  return;
                }

                setEditStep((prev) => Math.min(prev + 1, ORDERED_QUESTIONS.length));
              }}
            >
              {isLastEditStep ? "저장" : "다음"}
            </Button>
          </div>
          <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
            취소
          </Button>
          {saveMutation.isError ? <p className="text-sm text-red-600">저장에 실패했습니다.</p> : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{slideIndex + 1} / {totalSlides}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{currentSlide.title}</p>
        <p className="text-base font-medium leading-7">{currentSlide.prompt}</p>
        <p className="rounded-md bg-secondary/70 p-4 text-sm leading-7">{currentAnswer}</p>

        <div className="flex items-center justify-between gap-2">
          <Button type="button" variant="outline" onClick={() => setSlideIndex((prev) => Math.max(prev - 1, 0))}>
            이전
          </Button>
          <Button type="button" onClick={() => setSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1))}>
            다음
          </Button>
        </div>

        <Button
          type="button"
          onClick={() => {
            setToEmail(detailQuery.data.toEmail);
            setAnswersMap(toMap(detailQuery.data.answers));
            setEditStep(0);
            setEditing(true);
          }}
        >
          수정하기
        </Button>
      </CardContent>
    </Card>
  );
}
