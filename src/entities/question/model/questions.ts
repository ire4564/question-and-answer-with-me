export interface QuestionItem {
  questionId: string;
  prompt: string;
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
      { questionId: "money-1", prompt: "돈이 나에게 어떤 감정을 준다고 생각해? (안정, 자유, 인정, 선택권 등)" },
      { questionId: "money-2", prompt: "부자가 되고 싶다고 말한다면, 그 부자는 어떤 사람일까?" },
      { questionId: "money-3", prompt: "나에게 돈이 충분하다고 느끼는 기준은 무엇일까?" },
    ],
  },
  {
    sectionId: "job-meaning",
    title: "직업은 나에게 어떤 의미일까?",
    questions: [
      { questionId: "job-1", prompt: "지금 직업은 나의 정체성과 얼마나 연결되어 있을까?" },
      { questionId: "job-2", prompt: "직업이 사라진다면 나는 어떤 사람이 될 것 같아? 이후에 어떤 일을 할까?" },
      { questionId: "job-3", prompt: "직업 없이도 내가 나라고 느낄 수 있는 요소는 뭐야?" },
    ],
  },
  {
    sectionId: "retire-freedom",
    title: "은퇴와 자유에 대한 생각",
    questions: [
      { questionId: "retire-1", prompt: "나는 몇 살쯤 노동 강도를 줄이고 싶어?" },
      { questionId: "retire-2", prompt: "그때 자산은 어느 정도면 마음이 편할 것 같아?" },
      { questionId: "retire-3", prompt: "월 얼마 정도의 현금 흐름이면 불안하지 않을까?" },
      { questionId: "retire-4", prompt: "완전 은퇴 vs 반자유, 나는 어느 쪽이 더 맞을까?" },
    ],
  },
  {
    sectionId: "family-vision",
    title: "우리가 그리고 싶은 가족의 모습",
    questions: [
      { questionId: "family-1", prompt: "자녀가 어떤 성격으로 자랐으면 좋겠어?" },
      { questionId: "family-2", prompt: "자녀에게 삶에서 중요한 가치는 뭐라고 알려주고 싶어?" },
      { questionId: "family-3", prompt: "우리가 아이에게 주고 싶은 것은 어떤게 있을까? (성취, 경험, 태도, 환경 등)" },
      { questionId: "family-4", prompt: "나는 부모로서 어떤 사람이고 싶어?" },
    ],
  },
  {
    sectionId: "core-values",
    title: "우리의 중심 가치",
    questions: [
      { questionId: "value-1", prompt: "지금 나에게 가장 중요한 가치는 무엇일까? (자유, 안정, 사랑, 성장, 균형, 평온 등)" },
      { questionId: "value-2", prompt: "우리는 무엇을 잃어도 괜찮고, 무엇은 절대 잃고 싶지 않을까?" },
      { questionId: "value-3", prompt: "우리가 힘들어질 때 돌아와야 할 기준은 무엇일까? (행동이나 상태)" },
    ],
  },
  {
    sectionId: "conflict-repair",
    title: "갈등과 화해 방식",
    questions: [
      { questionId: "conflict-1", prompt: "나는 화가 나면 어떻게 행동하는 편이야?" },
      { questionId: "conflict-2", prompt: "혼자 시간이 필요하다면 얼마나 필요할까?" },
      { questionId: "conflict-3", prompt: "내가 이제 괜찮아라는 신호는 어떤걸까?" },
      { questionId: "conflict-4", prompt: "우리가 안전하다고 느끼는 싸움 방식은 어떤 걸까?" },
    ],
  },
  {
    sectionId: "dreams-if-rich",
    title: "돈이 충분하다면 해보고 싶은 것 세 가지",
    questions: [
      { questionId: "dream-1", prompt: "당장 1-2년 안에 실험해볼 수 있는 것" },
      { questionId: "dream-2", prompt: "10년 안에 꼭 해보고 싶은 것" },
      { questionId: "dream-3", prompt: "은퇴 이후에 해보고 싶은 것" },
      { questionId: "dream-4", prompt: "삶의 최종 가치와 목표" },
    ],
  },
  {
    sectionId: "one-important",
    title: "우리 부부가 오래 가기 위해 가장 중요한 한 가지",
    questions: [
      { questionId: "promise-1", prompt: "부부 사이에 가장 중요하게 생각하는 것은?" },
      { questionId: "promise-2", prompt: "상대가 나에게 꼭 지켜줬으면 하는 태도는?" },
      { questionId: "promise-3", prompt: "우리가 서로에게 해줄 수 있는 가장 기본적인 약속은?" },
    ],
  },
];

export const MAX_ANSWER_LENGTH = 1500;
