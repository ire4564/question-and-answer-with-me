"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { reactQueryDefaultOptions } from "@/shared/config/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: reactQueryDefaultOptions,
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
