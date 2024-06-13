import { doc, updateDoc } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { FirestoreCollections, currentChatIdAtom } from '../helpers';
import type { Chat } from '../types';

export function useUpdateChat() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: users } = useUser();
  const chatId = useAtomValue(currentChatIdAtom);
  const firestore = useFirestore();
  const updateChat = async (data: Partial<Chat>) => {
    setIsUpdating(true);
    try {
      const chatRef = doc(
        firestore,
        FirestoreCollections.USERS,
        users?.uid || '',
        FirestoreCollections.CHATS,
        chatId || ''
      );
      await updateDoc(chatRef, data);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsUpdating(false);
    }
  };
  return { updateChat, isUpdating, error };
}
