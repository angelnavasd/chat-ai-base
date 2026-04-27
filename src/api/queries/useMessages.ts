import { useQuery } from '@tanstack/react-query';
import { apiClient, IS_MOCK } from '../client';
import { mockApi } from '@/mocks/handlers';
import type { Message } from '@/types';

export function useMessages(chatId: string | undefined) {
  return useQuery<Message[]>({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (IS_MOCK) return mockApi.getMessages(chatId!);
      const { data } = await apiClient.get<Message[]>(`/chats/${chatId}/messages`);
      return data;
    },
    enabled: !!chatId,
  });
}
