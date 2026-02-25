import { InboxList } from "@/features/inbox/ui/inbox-list";

export default function InboxPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">수신함</h1>
        <InboxList />
      </div>
    </main>
  );
}
