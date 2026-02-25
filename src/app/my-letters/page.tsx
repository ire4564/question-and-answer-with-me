import { MyLettersList } from "@/features/my-letters/ui/my-letters-list";

export default function MyLettersPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">내가 작성한 답변</h1>
        <MyLettersList />
      </div>
    </main>
  );
}
