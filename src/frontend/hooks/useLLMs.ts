import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { FirestoreCollections, currentChatIdAtom } from 'src/frontend/helpers';
import { useGetChat } from 'src/frontend/hooks';
import type { LLM } from 'src/frontend/types';
import { LLM_MODELS } from './useLLMsTypes';

/**
 * This hook is used to get the currently active selected LLMs.
 *
 * This is used to toggle the LLMs for a chat in a menu
 */

export function useLLMs(chatId: string) {
  const { chat, status } = useGetChat(chatId);
  const { data: users } = useUser();
  const firestore = useFirestore();
  const [LLMs, setLLMs] = useState<{ [key: string]: LLM }>({});

  useEffect(() => {
    if (chat) {
      const initialLlms = LLM_MODELS.reduce((acc: { [key: string]: LLM }, { key, name }) => {
        acc[key] = { name, active: chat.model.includes(key) };
        return acc;
      }, {});
      setLLMs(initialLlms);
    }
  }, [chat]);

  const toggleLLM = async (llmKey: string) => {
    const updatedLLMs = {
      ...LLMs,
      [llmKey]: { ...LLMs[llmKey], active: !LLMs[llmKey].active }
    };
    setLLMs(updatedLLMs);

    const activeModels = Object.keys(updatedLLMs).filter((key) => updatedLLMs[key].active);

    try {
      const chatRef = doc(
        firestore,
        FirestoreCollections.USERS,
        users?.uid || '',
        FirestoreCollections.CHATS,
        chatId
      );
      await updateDoc(chatRef, { model: activeModels });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return { activeLLMs: LLMs, toggleLLM };
}
