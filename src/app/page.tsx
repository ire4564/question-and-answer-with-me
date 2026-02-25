import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { GoogleLoginButton } from "@/features/auth/ui/google-login-button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>가치 편지, 같이 써볼까요?</CardTitle>
          <CardDescription>상대와 서로의 가치관을 질문으로 나누는 편지 앱입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleLoginButton />
        </CardContent>
      </Card>
    </main>
  );
}
