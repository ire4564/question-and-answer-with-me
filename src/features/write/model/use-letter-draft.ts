"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QUESTION_SECTIONS } from "@/entities/question/model/questions";
import type { LetterAnswer } from "@/entities/letter/model/types";
import {
  loadDraftState,
  loadDraftStep,
  saveDraftState,
  saveDraftStep,
  type LetterDraftState,
} from "@/shared/lib/letters/draft-storage";

const QUESTION_ORDER = QUESTION_SECTIONS.flatMap((section) =>
  section.questions.map((question) => ({ sectionId: section.sectionId, questionId: question.questionId, prompt: question.prompt, title: section.title })),
);

function getAnswerKey(sectionId: string, questionId: string) {
  return `${sectionId}:${questionId}`;
}

export function buildAnswersFromState(state: LetterDraftState): LetterAnswer[] {
  return QUESTION_ORDER.map((q) => {
    const answerText = state.answers[getAnswerKey(q.sectionId, q.questionId)] ?? "";
    return {
      sectionId: q.sectionId,
      questionId: q.questionId,
      answerText,
    };
  }).filter((answer) => answer.answerText.length > 0);
}

export function useLetterDraft() {
  const [state, setState] = useState<LetterDraftState>(loadDraftState);
  const [step, setStep] = useState<number>(() => loadDraftStep(QUESTION_ORDER.length));

  useEffect(() => {
    saveDraftState(state);
  }, [state]);

  useEffect(() => {
    saveDraftStep(step);
  }, [step]);

  const currentQuestion = QUESTION_ORDER[step] ?? null;

  const currentAnswer = useMemo(() => {
    if (!currentQuestion) {
      return "";
    }

    return state.answers[getAnswerKey(currentQuestion.sectionId, currentQuestion.questionId)] ?? "";
  }, [currentQuestion, state.answers]);

  const answers = useMemo<LetterAnswer[]>(() => buildAnswersFromState(state), [state]);

  const setCurrentAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) {
        return;
      }

      setState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [getAnswerKey(currentQuestion.sectionId, currentQuestion.questionId)]: value,
        },
      }));
    },
    [currentQuestion],
  );

  const setToEmail = useCallback((value: string) => {
    setState((prev) => ({ ...prev, toEmail: value }));
  }, []);

  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, QUESTION_ORDER.length));
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    step,
    totalQuestions: QUESTION_ORDER.length,
    currentQuestion,
    currentAnswer,
    answers,
    toEmail: state.toEmail,
    setCurrentAnswer,
    setToEmail,
    nextStep,
    prevStep,
    isLastStep: step === QUESTION_ORDER.length,
  };
}
