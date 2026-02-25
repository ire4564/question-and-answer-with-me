export type LetterStatus = "draft" | "sent";

export interface LetterAnswer {
  sectionId: string;
  questionId: string;
  answerText: string;
}

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface LetterDoc {
  id: string;
  fromUid: string;
  fromEmail: string;
  toEmail: string;
  answers: LetterAnswer[];
  status: LetterStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
  sentAt?: unknown;
}

export interface ReceiptDoc {
  id: string;
  letterId: string;
  receiverUid: string;
  notified: boolean;
  seenAt: unknown | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}
