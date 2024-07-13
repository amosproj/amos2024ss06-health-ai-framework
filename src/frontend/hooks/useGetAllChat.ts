import { collection } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { FirestoreCollections } from '../helpers';
import type { Chat } from '../types';

/**
 * This hook is used to get all chats for the current active user of the app from firestore
 */

export function useGetAllChat() {
  const { data: users } = useUser();
  const firestore = useFirestore();
  const chatsRef = collection(
    firestore,
    FirestoreCollections.USERS,
    users?.uid || '',
    FirestoreCollections.CHATS
  );
  const { data, status, error } = useFirestoreCollectionData(chatsRef, { idField: 'id' });
  return { chats: data as Chat[], status, error };
}
