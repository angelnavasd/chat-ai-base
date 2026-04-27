// ── Message & Streaming ──────────────────────

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources: Source[] | null;
  model: string | null;
  tokenCount: number | null;
  createdAt: string;
}

// SSE event types from backend
export interface StreamTokenEvent {
  type: 'token';
  content: string;
}

export interface StreamSourcesEvent {
  type: 'sources';
  sources: Source[];
}

export interface StreamDoneEvent {
  type: 'done';
  messageId: string;
  tokenCount: number;
}

export interface StreamErrorEvent {
  type: 'error';
  message: string;
}

export type StreamEvent =
  | StreamTokenEvent
  | StreamSourcesEvent
  | StreamDoneEvent
  | StreamErrorEvent;
