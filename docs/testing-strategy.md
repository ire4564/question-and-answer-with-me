# Testing Strategy (MVP)

## 1. Manual QA (must pass)
- Login with Google account.
- Intro page reveals 3 messages in sequence.
- Write page enforces 1500-char limit and step progression.
- Waiting page submits letter and switches message after at least 3 seconds.
- Inbox page shows received letters and one-time notification message.
- Letter detail page renders sender answer (top) and my answer (bottom).
- Unauthorized access to `/write`, `/inbox`, `/letters/:id` redirects to `/`.

## 2. API smoke checklist
- `POST /api/letters` rejects invalid `toEmail`, oversized answer, missing auth token.
- `GET /api/letters/inbox` returns only current user email matches.
- `GET /api/letters/:id` allows sender/receiver only.
- `POST /api/letters/:id/read` updates receipt state once opened.

## 3. Suggested automation (next)
- Add Playwright e2e for login-mocked flow and write->waiting->inbox path.
- Add API integration tests with Firebase emulator in CI.
