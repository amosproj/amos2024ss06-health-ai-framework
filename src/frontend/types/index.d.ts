import type { FieldValue, Timestamp } from 'firebase/firestore';

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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  conversation: any;
};

export type User = {
  id?: string;
  name: string;
  email: string;
  chats: Chat[];
};

export type UserProfile = {
  // Uniquely identify profiles by id
  id: string;
  name: string;
  styleInstructions: string;
  personalInstructions: string;
};
