import { MyLetterDetail } from "@/features/my-letters/ui/my-letter-detail";

export default function MyLetterDetailPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">내 답변 보기</h1>
        <MyLetterDetail />
      </div>
    </main>
  );
}
