import type { Timestamp } from 'firebase/firestore';

export type Chat = {
  id?: string;
  title: string;
  createdAt: Timestamp;
  model: string;
  conversion: [];
};

export type User = {
  id?: string;
  name: string;
  email: string;
  chats: Chat[];
};
