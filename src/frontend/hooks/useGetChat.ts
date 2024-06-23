import { doc } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { FirestoreCollections, currentChatIdAtom } from 'src/frontend/helpers';
import type { Chat } from 'src/frontend/types';

export function useGetChat(chatId: string) {
  const { data: users } = useUser();
  const firestore = useFirestore();
  const chatRef = doc(
    firestore,
    FirestoreCollections.USERS,
    users?.uid || '',
    FirestoreCollections.CHATS,
    chatId
  );
  const { data, status, error } = useFirestoreDocData(chatRef, { idField: 'id' });
  return { chat: data as Chat, status, error };
}
