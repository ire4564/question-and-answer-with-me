import type { LetterAnswer } from "@/entities/letter/model/types";

export const DRAFT_STORAGE_KEY = "value-letter-draft-v1";
export const DRAFT_STEP_KEY = "value-letter-step-v1";

export interface LetterDraftState {
  answers: Record<string, string>;
  toEmail: string;
}

export interface SubmitLetterPayload {
  toEmail: string;
  answers: LetterAnswer[];
}

function safeParse(raw: string | null): LetterDraftState {
  if (!raw) {
    return { answers: {}, toEmail: "" };
  }

  try {
    const parsed = JSON.parse(raw) as LetterDraftState;
    return {
      answers: parsed.answers ?? {},
      toEmail: parsed.toEmail ?? "",
    };
  } catch {
    return { answers: {}, toEmail: "" };
  }
}

export function loadDraftState(): LetterDraftState {
  if (typeof window === "undefined") {
    return { answers: {}, toEmail: "" };
  }

  return safeParse(window.localStorage.getItem(DRAFT_STORAGE_KEY));
}

export function saveDraftState(state: LetterDraftState) {
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
}

export function saveDraftStep(step: number) {
  window.localStorage.setItem(DRAFT_STEP_KEY, String(step));
}

export function loadDraftStep(max: number) {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = Number(window.localStorage.getItem(DRAFT_STEP_KEY));

  if (!Number.isInteger(raw) || raw < 0 || raw > max) {
    return 0;
  }

  return raw;
}

export function clearDraft() {
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  window.localStorage.removeItem(DRAFT_STEP_KEY);
}
