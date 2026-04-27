import { mockChats, mockMessages } from './data';
import type { Chat, Message } from '@/types';

// Simulate network latency
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Mutable state for mock CRUD operations
let chats = [...mockChats];
let messages: Record<string, Message[]> = { ...mockMessages };
let nextId = 100;

export const mockApi = {
  // ── Chats ──────────────────────────────────
  async getChats(): Promise<Chat[]> {
    await delay(300);
    return [...chats].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  async getChat(chatId: string): Promise<Chat | undefined> {
    await delay(150);
    return chats.find((c) => c.id === chatId);
  },

  async createChat(): Promise<Chat> {
    await delay(200);
    const chat: Chat = {
      id: String(++nextId),
      title: 'Nueva conversación',
      model: 'gemini-2.0-flash',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    chats.unshift(chat);
    messages[chat.id] = [];
    return chat;
  },

  async deleteChat(chatId: string): Promise<void> {
    await delay(200);
    chats = chats.filter((c) => c.id !== chatId);
    delete messages[chatId];
  },

  async updateChat(chatId: string, title: string): Promise<Chat> {
    await delay(200);
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) throw new Error('Chat not found');
    chat.title = title;
    chat.updatedAt = new Date().toISOString();
    return { ...chat };
  },

  // ── Messages ───────────────────────────────
  async getMessages(chatId: string): Promise<Message[]> {
    await delay(300);
    return messages[chatId] ?? [];
  },

  async addMessage(chatId: string, message: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    await delay(100);
    const msg: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
    };
    if (!messages[chatId]) messages[chatId] = [];
    messages[chatId].push(msg);

    // Update the chat's updatedAt field
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      chat.updatedAt = new Date().toISOString();
      
      // Auto-generate title if it's the first message and it's from the user
      if (messages[chatId].length === 1 && message.role === 'user') {
        chat.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
      }
    }

    return msg;
  },
};
