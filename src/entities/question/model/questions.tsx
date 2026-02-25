import { ReactNode } from "react";

export interface QuestionItem {
  questionId: string;
  prompt: ReactNode;
}

export interface QuestionSection {
  sectionId: string;
  title: string;
  questions: QuestionItem[];
}

export const QUESTION_SECTIONS: QuestionSection[] = [
  {
    sectionId: "money-purpose",
    title: "우리는 왜 돈을 벌고 있을까?",
    questions: [
      {
        questionId: "money-1",
        prompt: (
          <>
            돈이 나에게 <strong>어떤 감정</strong>을 준다고 생각해?<br />
            (안정, 자유, 인정, 선택권 등)
          </>
        ),
      },
      {
        questionId: "money-2",
        prompt: (
          <>
            부자가 되고 싶다고 말한다면,<br />
            그 <strong>부자</strong>는 어떤 사람일까?
          </>
        ),
      },
      {
        questionId: "money-3",
        prompt: (
          <>
            나에게 돈이 <strong>충분하다</strong>고<br />
            느끼는 기준은 무엇일까?
          </>
        ),
      },
    ],
  },
  {
    sectionId: "job-meaning",
    title: "직업은 나에게 어떤 의미일까?",
    questions: [
      {
        questionId: "job-1",
        prompt: (
          <>
            지금 직업은 나의 <strong>정체성</strong>과<br />
            얼마나 연결되어 있을까?
          </>
        ),
      },
      {
        questionId: "job-2",
        prompt: (
          <>
            직업이 사라진다면<br />
            나는 <strong>어떤 사람</strong>이 될 것 같아?<br />
            이후에 어떤 일을 할까?
          </>
        ),
      },
      {
        questionId: "job-3",
        prompt: (
          <>
            직업 없이도 <strong>내가 나</strong>라고<br />
            느낄 수 있는 요소는 뭐야?
          </>
        ),
      },
    ],
  },
  {
    sectionId: "retire-freedom",
    title: "은퇴와 자유에 대한 생각",
    questions: [
      {
        questionId: "retire-1",
        prompt: (
          <>
            나는 <strong>몇 살</strong>쯤 노동 강도를 줄이고 싶어?
          </>
        ),
      },
      {
        questionId: "retire-2",
        prompt: (
          <>
            그때 <strong>자산</strong>은 어느 정도면<br />
            마음이 편할 것 같아?
          </>
        ),
      },
      {
        questionId: "retire-3",
        prompt: (
          <>
            월 얼마 정도의 <strong>현금 흐름</strong>이면<br />
            불안하지 않을까?
          </>
        ),
      },
      {
        questionId: "retire-4",
        prompt: (
          <>
            <strong>완전 은퇴</strong> vs <strong>반자유</strong><br />
            나는 어느 쪽이 더 맞을까?
          </>
        ),
      },
    ],
  },
  {
    sectionId: "family-vision",
    title: "우리가 그리고 싶은 가족의 모습",
    questions: [
      {
        questionId: "family-1",
        prompt: (
          <>
            자녀가 <strong>어떤 성격</strong>으로 자랐으면 좋겠어?
          </>
        ),
      },
      {
        questionId: "family-2",
        prompt: (
          <>
            자녀에게 삶에서 <strong>중요한 가치</strong>는<br />
            뭐라고 알려주고 싶어?
          </>
        ),
      },
      {
        questionId: "family-3",
        prompt: (
          <>
            우리가 아이에게<br />
            <strong>주고 싶은 것</strong>은 어떤게 있을까?<br />
            (성취, 경험, 태도, 환경 등)
          </>
        ),
      },
      {
        questionId: "family-4",
        prompt: (
          <>
            나는 <strong>부모</strong>로서 어떤 사람이고 싶어?
          </>
        ),
      },
    ],
  },
  {
    sectionId: "core-values",
    title: "우리의 중심 가치",
    questions: [
      {
        questionId: "value-1",
        prompt: (
          <>
            지금 나에게
            가장 <strong>중요한 가치</strong>는 무엇일까?<br />
            (자유, 안정, 사랑, 성장, 균형, 평온 등)
          </>
        ),
      },
      {
        questionId: "value-2",
        prompt: (
          <>
            우리는 무엇을 <strong>잃어도 괜찮</strong>고,<br />
            무엇은 <strong>절대 잃고 싶지 않</strong>을까?
          </>
        ),
      },
      {
        questionId: "value-3",
        prompt: (
          <>
            우리가 힘들어질 때<br />
            <strong>돌아와야 할 기준</strong>은 무엇일까?
          </>
        ),
      },
    ],
  },
  {
    sectionId: "conflict-repair",
    title: "갈등과 화해 방식",
    questions: [
      {
        questionId: "conflict-1",
        prompt: (
          <>
            나는 <strong>화가 나면</strong> 어떻게 행동하는 편이야?
          </>
        ),
      },
      {
        questionId: "conflict-2",
        prompt: (
          <>
            <strong>혼자 시간</strong>이 필요하다면 얼마나 필요할까?
          </>
        ),
      },
      {
        questionId: "conflict-3",
        prompt: (
          <>
            <strong>화가 풀렸다</strong>, 라는 신호는 어떤걸까?
          </>
        ),
      },
      {
        questionId: "conflict-4",
        prompt: (
          <>
            우리가 <strong>안전하다</strong>고 느끼는<br />
            싸움 방식은 어떤 걸까?
          </>
        ),
      },
    ],
  },
  {
    sectionId: "dreams-if-rich",
    title: "돈이 충분하다면 해보고 싶은 것",
    questions: [
      {
        questionId: "dream-1",
        prompt: (
          <>
            당장 <strong>1-2년 안에</strong> 실험해볼 수 있는 것
          </>
        ),
      },
      {
        questionId: "dream-2",
        prompt: (
          <>
            <strong>10년 안에</strong> 꼭 해보고 싶은 것
          </>
        ),
      },
      {
        questionId: "dream-3",
        prompt: (
          <>
            <strong>은퇴 이후</strong>에 해보고 싶은 것
          </>
        ),
      },
      {
        questionId: "dream-4",
        prompt: (
          <>
            삶의 <strong>최종 가치</strong>와 <strong>목표</strong>
          </>
        ),
      },
    ],
  },
  {
    sectionId: "one-important",
    title: "우리 부부가 오래 가기 위해 가장 중요한 한 가지",
    questions: [
      {
        questionId: "promise-1",
        prompt: (
          <>
            부부 사이에 <strong>가장 중요</strong>하게 생각하는 것은?
          </>
        ),
      },
      {
        questionId: "promise-2",
        prompt: (
          <>
            상대가 나에게 <strong>꼭 지켜줬으면</strong> 하는 태도는?
          </>
        ),
      },
      {
        questionId: "promise-3",
        prompt: (
          <>
            우리가 서로에게 해줄 수 있는<br />
            <strong>가장 기본적인 약속</strong>은?
          </>
        ),
      },
    ],
  },
];

export const MAX_ANSWER_LENGTH = 1500;
