import { useState, useCallback, useRef } from 'react';
import type { Source, StreamEvent } from '@/types';
import { createMockStream } from '@/mocks/mock-stream';

const IS_MOCK = import.meta.env.VITE_USE_MOCKS === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useStreaming() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (chatId: string, content: string) => {
    setIsStreaming(true);
    setStreamedContent('');
    setSources([]);

    if (IS_MOCK) {
      let finalMockContent = '';
      let finalMockSources: Source[] = [];
      // ── Mock streaming ──
      for await (const event of createMockStream()) {
        if (event.type === 'token') {
          finalMockContent += event.content;
          setStreamedContent((prev) => prev + event.content);
        } else if (event.type === 'sources') {
          finalMockSources = event.sources;
          setSources(event.sources);
        }
      }
      setIsStreaming(false);
      return { content: finalMockContent, sources: finalMockSources };
    }

    // ── Real SSE streaming ──
    let finalContent = '';
    let finalSources: Source[] = [];
    try {
      abortRef.current = new AbortController();

      const { getAuth } = await import('firebase/auth');
      const token = await getAuth().currentUser?.getIdToken();

      const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event: StreamEvent = JSON.parse(line.slice(6));
            if (event.type === 'token') {
              finalContent += event.content;
              setStreamedContent((prev) => prev + event.content);
            } else if (event.type === 'sources') {
              finalSources = event.sources;
              setSources(event.sources);
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
      return { content: finalContent, sources: finalSources };
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Streaming error:', err);
      }
      return null;
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const resetStream = useCallback(() => {
    setStreamedContent('');
    setSources([]);
  }, []);

  return { isStreaming, streamedContent, sources, startStream, stopStream, resetStream };
}
