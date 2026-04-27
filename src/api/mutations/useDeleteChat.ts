import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, IS_MOCK } from '../client';
import { mockApi } from '@/mocks/handlers';

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (chatId: string) => {
      if (IS_MOCK) return mockApi.deleteChat(chatId);
      await apiClient.delete(`/chats/${chatId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}
