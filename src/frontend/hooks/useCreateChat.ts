import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { FirestoreCollections } from '../helpers';
import type { Chat } from '../types';

/**
 * This hook is used to create a new chat in firestore.
 */

export function useCreateChat() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: users } = useUser();
  const firestore = useFirestore();

  const createChat = async (chatData: Omit<Chat, 'id' | 'createdAt'>) => {
    setIsCreating(true);
    try {
      if (!users?.uid) {
        throw new Error('User is not authenticated');
      }
      const chatsCollectionRef = collection(
        firestore,
        FirestoreCollections.USERS,
        users.uid,
        FirestoreCollections.CHATS
      );

      const docRef = await addDoc(chatsCollectionRef, {
        ...chatData,
        createdAt: Timestamp.now()
      });

      const newChat = { ...chatData, id: docRef.id, createdAt: Timestamp.now() };
      //update chat with id that we get assigned from firestore
      await updateDoc(docRef, { id: docRef.id });
      return { id: docRef.id, chat: newChat };
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsCreating(false);
    }
  };

  return { createChat, isCreating, error };
}
