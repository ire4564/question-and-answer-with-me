"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QUESTION_SECTIONS } from "@/entities/question/model/questions";
import type { LetterAnswer } from "@/entities/letter/model/types";

const STORAGE_KEY = "value-letter-draft-v1";
const STEP_KEY = "value-letter-step-v1";

const QUESTION_ORDER = QUESTION_SECTIONS.flatMap((section) =>
  section.questions.map((question) => ({ sectionId: section.sectionId, questionId: question.questionId, prompt: question.prompt, title: section.title })),
);

interface DraftState {
  answers: Record<string, string>;
  toEmail: string;
}

function getAnswerKey(sectionId: string, questionId: string) {
  return `${sectionId}:${questionId}`;
}

function loadInitialState(): DraftState {
  if (typeof window === "undefined") {
    return { answers: {}, toEmail: "" };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return { answers: {}, toEmail: "" };
  }

  try {
    const parsed = JSON.parse(raw) as DraftState;
    return {
      answers: parsed.answers ?? {},
      toEmail: parsed.toEmail ?? "",
    };
  } catch {
    return { answers: {}, toEmail: "" };
  }
}

function loadInitialStep() {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(STEP_KEY);
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 0 || parsed >= QUESTION_ORDER.length + 1) {
    return 0;
  }

  return parsed;
}

export function useLetterDraft() {
  const [state, setState] = useState<DraftState>(loadInitialState);
  const [step, setStep] = useState<number>(loadInitialStep);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    window.localStorage.setItem(STEP_KEY, String(step));
  }, [step]);

  const currentQuestion = QUESTION_ORDER[step] ?? null;

  const currentAnswer = useMemo(() => {
    if (!currentQuestion) {
      return "";
    }

    return state.answers[getAnswerKey(currentQuestion.sectionId, currentQuestion.questionId)] ?? "";
  }, [currentQuestion, state.answers]);

  const answers = useMemo<LetterAnswer[]>(() => {
    return QUESTION_ORDER.map((q) => {
      const answerText = state.answers[getAnswerKey(q.sectionId, q.questionId)] ?? "";
      return {
        sectionId: q.sectionId,
        questionId: q.questionId,
        answerText,
      };
    }).filter((answer) => answer.answerText.length > 0);
  }, [state.answers]);

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
