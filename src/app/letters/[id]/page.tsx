"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QUESTION_SECTIONS } from "@/entities/question/model/questions";
import { useAuth } from "@/features/auth/model/use-auth";
import { apiClient } from "@/shared/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface LetterAnswer {
  sectionId: string;
  questionId: string;
  answerText: string;
}

interface LetterDetailResponse {
  id: string;
  fromEmail: string;
  toEmail: string;
  answers: LetterAnswer[];
  myAnswers: LetterAnswer[];
}

function getAnswerText(answers: LetterAnswer[], sectionId: string, questionId: string) {
  const matched = answers.find((answer) => answer.sectionId === sectionId && answer.questionId === questionId);
  return matched?.answerText || "(답변 없음)";
}

export default function LetterDetailPage() {
  const params = useParams<{ id: string }>();
  const letterId = params?.id ?? "";
  const { user, loading } = useAuth();

  const detailQuery = useQuery({
    queryKey: ["letters", "detail", letterId, user?.uid],
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

  if (loading || detailQuery.isLoading) {
    return <main className="mx-auto max-w-3xl px-6 py-10 text-sm text-muted-foreground">편지를 불러오는 중...</main>;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <main className="mx-auto max-w-3xl px-6 py-10 text-sm text-red-600">편지를 불러오지 못했습니다.</main>;
  }

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-6 py-10">
      <h1 className="text-xl font-bold">질문별 편지 비교</h1>
      {QUESTION_SECTIONS.map((section) => (
        <section key={section.sectionId} className="space-y-3">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          {section.questions.map((question) => (
            <Card key={question.questionId}>
              <CardHeader>
                <CardTitle className="text-base leading-7">{question.prompt}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">상대 답변</p>
                  <p className="rounded-md bg-secondary/60 p-3 text-sm leading-6">
                    {getAnswerText(detailQuery.data.answers, section.sectionId, question.questionId)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">내 답변</p>
                  <p className="rounded-md bg-accent/60 p-3 text-sm leading-6">
                    {getAnswerText(detailQuery.data.myAnswers, section.sectionId, question.questionId)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ))}
    </main>
  );
}
