"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/model/use-auth";
import { apiClient } from "@/shared/api/client";

interface SentItem {
  id: string;
}

export function useSentLetters() {
  const { user, loading } = useAuth();

  const query = useQuery({
    queryKey: ["letters", "sent", user?.uid],
    queryFn: async () => {
      if (!user) {
        return [] as SentItem[];
      }

      const token = await user.getIdToken();
      const response = await apiClient.get<{ ok: boolean; data: SentItem[] }>("/letters/sent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    },
    enabled: !loading && Boolean(user),
  });

  return {
    data: query.data,
    isLoading: loading || query.isLoading,
    isError: query.isError,
    hasHistory: Boolean(query.data?.length),
  };
}
