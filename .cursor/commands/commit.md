---
description: 변경사항을 논리적인 단위로 자동 분류하여 커밋합니다
---

변경사항을 확인하고 논리적인 단위로 나누어 커밋합니다.
커밋은 항상 한글로 작성합니다.

## 프로젝트 구조 (FSD 아키텍처)

```
src/
├── app/              # Next.js App Router 페이지 및 API 라우트
│   ├── api/          # API 라우트 (letters, auth, users)
│   ├── inbox/        # 받은 편지함 페이지
│   ├── write/        # 편지 작성 페이지
│   ├── letters/      # 편지 상세 페이지
│   ├── intro/        # 인트로 페이지
│   └── waiting/      # 대기 페이지
├── features/         # 기능 단위 모듈
│   ├── auth/         # 인증 기능 (ui, model)
│   ├── inbox/        # 받은 편지함 기능 (ui)
│   ├── write/        # 편지 작성 기능 (ui, model)
│   └── waiting/      # 대기 기능 (ui)
├── entities/         # 비즈니스 엔티티
│   ├── letter/       # 편지 엔티티 (model/types)
│   ├── user/         # 사용자 엔티티 (model/types)
│   └── question/     # 질문 엔티티 (model/questions)
├── shared/           # 공유 모듈
│   ├── ui/           # 공통 UI 컴포넌트 (button, input, card, textarea)
│   ├── lib/          # 유틸리티 (firebase, auth, letters, email)
│   ├── api/          # API 클라이언트
│   ├── config/       # 설정 (react-query)
│   ├── providers/    # 프로바이더 (query-provider)
│   └── types/        # 공통 타입 정의
├── widgets/          # 위젯 (복합 컴포넌트)
└── pages/            # 페이지 컴포넌트
```

## 커밋 형식

아래는 형식 예시입니다.

[커밋유형]: [커밋 내용 제목]

- 변경된 내용 1
- 변경된 내용 2
- ...

## 커밋 순서 (FSD 레이어 기반)

1. **패키지 의존성 변경** (package.json, lock 파일)
   - 커밋 메시지: `chore: 의존성 업데이트`

2. **스타일 파일 변경** (globals.css, .css, .scss)
   - 커밋 메시지: `style: 스타일 수정`

3. **shared/config 변경** (설정 파일)
   - 커밋 메시지: `chore: 설정 업데이트`

4. **shared/lib 변경** (유틸리티, firebase, auth 등)
   - 커밋 메시지: `refactor: 공통 라이브러리 수정`

5. **shared/ui 변경** (공통 UI 컴포넌트)
   - 커밋 메시지: `refactor: 공통 UI 컴포넌트 수정`

6. **shared/api, shared/types 변경** (API 클라이언트, 타입)
   - 커밋 메시지: `refactor: API/타입 정의 수정`

7. **entities 변경** (비즈니스 엔티티)
   - 커밋 메시지: `feat: 엔티티 업데이트`

8. **features 변경** (기능 모듈)
   - 커밋 메시지: `feat: 기능 업데이트`

9. **app/api 변경** (API 라우트)
   - 커밋 메시지: `feat: API 라우트 업데이트`

10. **app 페이지 변경** (페이지 컴포넌트)
    - 커밋 메시지: `feat: 페이지 업데이트`

11. **나머지 변경사항**
    - 커밋 메시지: `chore: 기타 파일 수정`

## 실행 로직

```bash
# 1. 변경사항 확인
git status

# 2. 패키지 의존성 변경 커밋
if [ -n "$(git status --porcelain | grep -E '(package\.json|pnpm-lock\.yaml|package-lock\.json|yarn\.lock)')" ]; then
  git add package.json pnpm-lock.yaml package-lock.json yarn.lock 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "chore: 의존성 업데이트"
  fi
fi

# 3. 스타일 파일 변경 커밋
if [ -n "$(git status --porcelain | grep -E '\.(css|scss|less)$')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E '\.(css|scss|less)$') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "style: 스타일 수정"
  fi
fi

# 4. shared/config 변경 커밋
if [ -n "$(git status --porcelain | grep -E 'src/shared/config/')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E 'src/shared/config/') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "chore: 설정 업데이트"
  fi
fi

# 5. shared/lib 변경 커밋
if [ -n "$(git status --porcelain | grep -E 'src/shared/lib/')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E 'src/shared/lib/') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "refactor: 공통 라이브러리 수정"
  fi
fi

# 6. shared/ui 변경 커밋
if [ -n "$(git status --porcelain | grep -E 'src/shared/ui/')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E 'src/shared/ui/') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "refactor: 공통 UI 컴포넌트 수정"
  fi
fi

# 7. shared/api, shared/types 변경 커밋
if [ -n "$(git status --porcelain | grep -E 'src/shared/(api|types)/')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E 'src/shared/(api|types)/') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "refactor: API/타입 정의 수정"
  fi
fi

# 8. entities 변경 커밋
if [ -n "$(git status --porcelain | grep -E 'src/entities/')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E 'src/entities/') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "feat: 엔티티 업데이트"
  fi
fi

# 9. features 변경 커밋
if [ -n "$(git status --porcelain | grep -E 'src/features/')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E 'src/features/') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "feat: 기능 업데이트"
  fi
fi

# 10. app/api 변경 커밋
if [ -n "$(git status --porcelain | grep -E 'src/app/api/')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E 'src/app/api/') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "feat: API 라우트 업데이트"
  fi
fi

# 11. app 페이지 변경 커밋
if [ -n "$(git status --porcelain | grep -E 'src/app/' | grep -v 'src/app/api/')" ]; then
  git add $(git status --porcelain | awk '{print $2}' | grep -E 'src/app/' | grep -v 'src/app/api/') 2>/dev/null || true
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "feat: 페이지 업데이트"
  fi
fi

# 12. 나머지 변경사항 커밋
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  if [ -n "$(git diff --cached --name-only)" ]; then
    git commit -m "chore: 기타 파일 수정"
  fi
fi

# 최종 상태 확인
git status
```

## 사용 방법

이 명령어를 실행하면:

1. 현재 변경사항을 확인합니다
2. FSD 레이어 순서에 따라 논리적으로 그룹화합니다
3. 각 그룹을 별도의 커밋으로 생성합니다
4. 적절한 커밋 메시지를 자동으로 생성합니다

## 주의사항

- 커밋 전에 변경사항을 확인하세요
- 중요한 파일(.env, Firebase 키 파일 등)은 수동으로 커밋하는 것을 권장합니다
- 충돌이 발생하면 중단하고 수동으로 해결하세요
- Firebase 관련 파일(.firebaserc, firebase.json, firestore.rules 등)은 별도로 관리하세요
