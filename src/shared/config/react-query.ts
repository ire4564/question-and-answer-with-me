import type { DefaultOptions } from "@tanstack/react-query";

export const reactQueryDefaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  },
};
