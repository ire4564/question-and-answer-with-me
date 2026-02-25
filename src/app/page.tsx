import Image from "next/image";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { GoogleLoginButton } from "@/features/auth/ui/google-login-button";
import { FloatingBubble } from "@/shared/ui/floating-bubble";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <div className="relative">
          <FloatingBubble className="-top-12 left-6" delay={0}>
            가치관이 뭐야?
          </FloatingBubble>
          <FloatingBubble className="right-6 -top-5" delay={0.5}>
            나도 궁금해!
          </FloatingBubble>
          <Image src="/assets/letter_icon.png" alt="편지 아이콘" width={240} height={120} priority />
        </div>
        <CardHeader className="text-center">
          <CardTitle>가치 편지, 같이 써볼까요?</CardTitle>
          <CardDescription>상대와 서로의 가치관을 질문으로 나누는 따뜻한 편지</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleLoginButton />
        </CardContent>
      </div>
    </main>
  );
}
