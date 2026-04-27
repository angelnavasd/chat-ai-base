import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, IS_MOCK } from '../client';
import { mockApi } from '@/mocks/handlers';
import type { Chat } from '@/types';

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation<Chat>({
    mutationFn: async () => {
      if (IS_MOCK) return mockApi.createChat();
      const { data } = await apiClient.post<Chat>('/chats');
      return data;
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      return newChat;
    },
  });
}
