import type { Timestamp } from 'firebase/firestore';

export type LLM = {
  name: string;
  active: boolean;
};

export type Chat = {
  id?: string;
  title: string;
  createdAt: Timestamp;
  model: string[];
  conversation: string[];
};

export type User = {
  id?: string;
  name: string;
  email: string;
  chats: Chat[];
};
