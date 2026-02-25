import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/shared/providers/query-provider";

export const metadata: Metadata = {
  title: "Question and Answer With Me",
  description: "가치 편지 MVP",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
