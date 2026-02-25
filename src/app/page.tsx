import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>가치 편지</CardTitle>
          <CardDescription>상대와 질문에 대한 답변을 주고받아 서로를 더 깊이 이해하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button">Google로 시작하기</Button>
        </CardContent>
      </Card>
    </main>
  );
}
