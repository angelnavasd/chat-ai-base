import { mockStreamResponse, mockStreamSources } from './data';
import type { StreamEvent } from '@/types';

/**
 * Simulates SSE streaming from the backend.
 * Emits tokens word-by-word with realistic delay.
 */
export async function* createMockStream(): AsyncGenerator<StreamEvent> {
  const words = mockStreamResponse.split(' ');

  for (let i = 0; i < words.length; i++) {
    const separator = i === 0 ? '' : ' ';
    yield { type: 'token', content: separator + words[i] };
    // Variable delay to simulate real LLM speed
    await new Promise((r) => setTimeout(r, 15 + Math.random() * 35));
  }

  // Emit sources at the end
  yield { type: 'sources', sources: mockStreamSources };

  // Done event
  yield {
    type: 'done',
    messageId: `mock-${Date.now()}`,
    tokenCount: Math.round(words.length * 1.3),
  };
}
