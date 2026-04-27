import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, IS_MOCK } from '../client';
import { mockApi } from '@/mocks/handlers';
import type { Chat } from '@/types';

export function useUpdateChat() {
  const queryClient = useQueryClient();

  return useMutation<Chat, Error, { chatId: string; title: string }>({
    mutationFn: async ({ chatId, title }) => {
      if (IS_MOCK) return mockApi.updateChat(chatId, title);
      const { data } = await apiClient.patch<Chat>(`/chats/${chatId}`, { title });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}
