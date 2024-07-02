import type { Timestamp } from 'firebase/firestore';

export type LLM = {
  name: string;
  active: boolean;
};

export type conversationMessage = { [key: string]: string };

export type Chat = {
  id?: string;
  title: string;
  createdAt: Timestamp;
  model: string[];
  conversation: conversationMessage[];
};

export type User = {
  id?: string;
  name: string;
  email: string;
  chats: Chat[];
};
