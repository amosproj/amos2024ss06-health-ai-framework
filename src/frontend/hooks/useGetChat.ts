import { doc } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { FirestoreCollections, currentChatIdAtom } from '../helpers';
import type { Chat } from '../types';

export function useGetChat() {
  const chatId = useAtomValue(currentChatIdAtom);
  const { data: users } = useUser();
  const firestore = useFirestore();
  const chatRef = doc(
    firestore,
    FirestoreCollections.USERS,
    users?.uid || '',
    FirestoreCollections.CHATS,
    chatId || ''
  );
  const { data, status, error } = useFirestoreDocData(chatRef, { idField: 'id' });
  return { chat: data as Chat, status, error };
}
