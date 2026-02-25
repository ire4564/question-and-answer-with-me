import { MAX_ANSWER_LENGTH, QUESTION_SECTIONS } from "@/entities/question/model/questions";
import type { LetterAnswer } from "@/entities/letter/model/types";

const QUESTION_SET = new Set(
  QUESTION_SECTIONS.flatMap((section) => section.questions.map((question) => `${section.sectionId}:${question.questionId}`)),
);

export function validateAnswers(answers: unknown): answers is LetterAnswer[] {
  if (!Array.isArray(answers)) {
    return false;
  }

  return answers.every((answer) => {
    if (typeof answer !== "object" || answer === null) {
      return false;
    }

    const typed = answer as Partial<LetterAnswer>;

    if (
      typeof typed.sectionId !== "string" ||
      typeof typed.questionId !== "string" ||
      typeof typed.answerText !== "string"
    ) {
      return false;
    }

    if (typed.answerText.length > MAX_ANSWER_LENGTH) {
      return false;
    }

    return QUESTION_SET.has(`${typed.sectionId}:${typed.questionId}`);
  });
}
