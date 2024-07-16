import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { FirestoreCollections } from '../helpers';
import type { Chat } from '../types';

/**
 * This hook is used to update a chat in firestore.
 *
 * E.g. with updated conversations with an LLM
 */

export function useUpdateChat() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: users } = useUser();
  const firestore = useFirestore();

  const updateChat = async (chatId: string, data: Partial<Chat>) => {
    setIsUpdating(true);
    setIsSuccess(false);
    try {
      const chatRef = doc(
        firestore,
        FirestoreCollections.USERS,
        users?.uid || '',
        FirestoreCollections.CHATS,
        chatId
      );
      await updateDoc(chatRef, data);
      setIsSuccess(true);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsUpdating(false);
    }
  };
  return { updateChat, isUpdating, error, isSuccess };
}
