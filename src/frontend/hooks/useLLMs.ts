import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { useGetChat } from 'src/frontend/hooks';

export type LLM = {
  name: string;
  active: boolean;
};

const LLM_MODELS = [
  { key: 'gpt-4', name: 'OpenAi' },
  { key: 'google', name: 'Gemini' },
  { key: 'mistral', name: 'Mistral' },
  { key: 'claude', name: 'Claude' },
];

export function useLLMs(chatId: string) {
  const { chat, status } = useGetChat(chatId);
  const firestore = useFirestore();
  const [llms, setLlms] = useState<{ [key: string]: LLM }>({});

  useEffect(() => {
    if (chat) {
      const initialLlms = LLM_MODELS.reduce((acc: { [key: string]: LLM }, { key, name }) => {
        acc[key] = { name, active: chat.model.includes(key) };
        return acc;
      }, {});
      setLlms(initialLlms);
    }
  }, [chat]);

  const toggleLLM = async (llmKey: string) => {
    const updatedLLMs = {
      ...llms,
      [llmKey]: { ...llms[llmKey], active: !llms[llmKey].active },
    };
    setLlms(updatedLLMs);

    const activeModels = Object.keys(updatedLLMs).filter((key) => updatedLLMs[key].active);

    try {
      const chatRef = doc(firestore, 'users', 'USER_ID', 'chats', chatId); // Replace USER_ID with actual user ID
      await updateDoc(chatRef, { model: activeModels });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return { activeLLMs: llms, toggleLLM, status };
}