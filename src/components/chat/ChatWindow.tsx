import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { Message } from '@/types';
import { useStreaming } from '@/hooks/useStreaming';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { mockApi } from '@/mocks/handlers';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { StreamingBubble } from './StreamingBubble';
import { Loader2 } from 'lucide-react';

const IS_MOCK = import.meta.env.VITE_USE_MOCKS === 'true';

interface ChatWindowProps {
  chatId: string;
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ chatId, messages, isLoading }: ChatWindowProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const { isStreaming, streamedContent, sources, startStream, resetStream } = useStreaming();
  const queryClient = useQueryClient();
  const { containerRef } = useAutoScroll(streamedContent || messages.length);

  const handleSend = useCallback(async (content: string) => {
    setPendingUserMessage(content);

    if (IS_MOCK) {
      await mockApi.addMessage(chatId, {
        chatId,
        role: 'user',
        content,
        sources: null,
        model: null,
        tokenCount: null,
      });
    }

    const result = await startStream(chatId, content);

    if (IS_MOCK && result) {
      await mockApi.addMessage(chatId, {
        chatId,
        role: 'assistant',
        content: result.content,
        sources: result.sources?.length > 0 ? result.sources : null,
        model: 'gemini-3.1-pro',
        tokenCount: Math.round(result.content.length / 4),
      });
    }

    setPendingUserMessage(null);
    resetStream();
    queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    queryClient.invalidateQueries({ queryKey: ['chats'] });
  }, [chatId, startStream, resetStream, queryClient]);

  useEffect(() => {
    const state = location.state as { initialMessage?: string } | null;
    if (state?.initialMessage) {
      handleSend(state.initialMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, handleSend, navigate]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages area — momentum scroll on iOS */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <div className="mx-auto max-w-3xl space-y-4 md:space-y-6 px-3 md:px-4 py-4 md:py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {pendingUserMessage && (
                <MessageBubble
                  message={{
                    id: 'pending',
                    chatId,
                    role: 'user',
                    content: pendingUserMessage,
                    sources: null,
                    model: null,
                    tokenCount: null,
                    createdAt: new Date().toISOString(),
                  }}
                />
              )}

              {isStreaming && (
                <StreamingBubble content={streamedContent} sources={sources} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Input area */}
      <MessageInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
