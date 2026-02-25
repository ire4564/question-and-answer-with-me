import { PostLoginActions } from "@/features/home/ui/post-login-actions";

export default function HubPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-10">
      <PostLoginActions />
    </main>
  );
}
