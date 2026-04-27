import { useQuery } from '@tanstack/react-query';
import { apiClient, IS_MOCK } from '../client';
import { mockApi } from '@/mocks/handlers';
import type { Chat } from '@/types';

export function useChats() {
  return useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      if (IS_MOCK) return mockApi.getChats();
      const { data } = await apiClient.get<Chat[]>('/chats');
      return data;
    },
    staleTime: 30_000,
  });
}
