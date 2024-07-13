import type { FieldValue, Timestamp } from 'firebase/firestore';

// LLM types
export type LLM = {
  name: string;
  active: boolean;
};

// Conversation types to be stored in firestore chat
export type conversationMessage = {
  type: 'USER' | 'AI';
  message: string | { [key: string]: string };
};

// Chat type containing all the attributes of a chat stored in firestore
export type Chat = {
  id?: string;
  title: string;
  createdAt: Timestamp;
  model: string[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  conversation: any;
};

// User types
export type User = {
  id?: string;
  name: string;
  email: string;
  chats: Chat[];
};

// User profile types
export type UserProfile = {
  id: string;
  name: string;
  styleInstructions: string;
  personalInstructions: string;
};
