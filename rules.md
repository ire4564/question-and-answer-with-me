---
description: 전체 프로젝트에 대해 공통적으로 적용되는 룰을 정의힙니다.
globs:
alwaysApply: true
---

# 코드 스타일 및 개발 패턴

## to-do

답변 시에 다음 사항을 숙지해야 합니다:

- 답이 명확하지 않을 경우, 불가능한 것에 대해서는 불가능하다고 말합니다.
- 답변에 대한 정보가 부족할 경우 웹 검색을 합니다. 검색 결과에 대한 출처는 답변 끝에 링크로 첨부합니다.
- 질문에 대한 답변을 여러 개 제시할 경우, 각각의 장단점을 명확하게 파악하고 비교합니다.
- 코드 수정 전 반드시 기존 코드의 맥락과 의도를 파악합니다.
- 여러 파일 동시 수정시 의존성 순서를 고려합니다.
- 복잡한 요청시 계획을 TODO로 만들고 단계별로 진행합니다.
- 불확실한 부분은 개발자에게 의도를 확실하게 되묻고 진행합니다.
- 변경 사항에 대한 영향도 분석 및 부작용을 검토합니다.
- 리팩토링시 테스트 코드를 우선 확인합니다. 없다면 테스트 코드 추가를 제안합니다.

## don't do

코드 수정 시에 다음 사항을 숙지해야 합니다:

- 파일은 기본적으로 개발자의 동의 없이 수정하지 말아야 합니다.
- webpack 설정, config, setting, .env 등 중요한 설정 정보가 있는 파일은 수정하지 않아야 합니다.
- 위의 중요 파일에 대해 수정이 필요할 경우 개발자의 동의를 얻어야 합니다.
- XSS 방지를 위한 dangerouslySetInnerHTML 사용을 제한해야 합니다.
- 민감한 정보는 클라이언트에 노출되어서는 안됩니다.

## 문제 해결 접근법

- 에러 발생시 관련 파일들의 의존성을 체크합니다.
- 타입 에러는 전체 타입 정의 파일 확인 후 해결합니다.
- 스타일 이슈는 theme 파일과 전역 스타일을 우선으로 확인합니다.

## 성능 최적화 원칙

- React.memo, useMemo, useCallback 적절하게 사용합니다. 성능을 고려하여 불필요한 사용은 금지합니다.
- 이미지 최적화를 고려합니다. (next/image 스타일 접근)
- React Query staleTime, cacheTime 적절한 설정을 하도록 합니다.

## 협업 규칙

- 복잡한 로직에는 주석으로 의도를 설명합니다. 명확하거나 간단한 함수에 대해서는 주석을 생략합니다.
- README 및 문서 업데이트 필요성을 판단하여 큰 변경사항이 있을 경우 업데이트를 제안합니다.

## 코드 스타일

이 프로젝트는 다음과 같은 코드 스타일 규칙을 따릅니다:

- 해당 프로젝트의 .eslintrc과 .prettierrc 파일을 참고하여 코드 스타일을 일관되게 유지합니다.
- TypeScript를 사용하여 타입 안전성을 보장합니다.
- 함수형 컴포넌트와 React 훅을 사용합니다.
- 컴포넌트 파일명은 PascalCase를 사용합니다 (예: `Button.tsx`).
- 훅 파일명은 camelCase와 'use' 접두사를 사용합니다 (예: `useWebLogger.ts`).
- 유틸리티 함수는 camelCase를 사용합니다.

### 커스텀 훅 패턴

```typescript
import { useState, useEffect } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
```

## 데이터 페칭 (React Query)

- React Query를 사용하여 서버 상태를 관리합니다.

```typescript
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api";

// 쿼리 키 정의
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// 커스텀 훅
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
  });
}
```

- FSD 구조를 채택하며 app router를 사용한다.
