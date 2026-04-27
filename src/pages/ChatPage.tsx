import { useParams } from 'react-router-dom';
import { useMessages } from '@/api/queries/useMessages';
import { ChatWindow } from '@/components/chat/ChatWindow';

export function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: messages = [], isLoading } = useMessages(chatId);

  if (!chatId) return null;

  return (
    <ChatWindow
      chatId={chatId}
      messages={messages}
      isLoading={isLoading}
    />
  );
}
