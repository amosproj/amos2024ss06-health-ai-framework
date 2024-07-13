import { FirebaseError } from 'firebase/app';
import { deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { FirestoreCollections } from '../helpers';

/**
 * This hook is used to delete a chat from firestore.
 */

export function useDeleteChat(chatId: string) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: users } = useUser();
  const firestore = useFirestore();
  const chatRef = doc(
    firestore,
    FirestoreCollections.USERS,
    users?.uid || '',
    FirestoreCollections.CHATS,
    chatId
  );
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteDoc(chatRef);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };
  return { handleDelete, isDeleting, error };
}
