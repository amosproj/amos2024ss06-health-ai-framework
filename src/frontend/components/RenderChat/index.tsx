import { ActivityIndicator } from 'react-native-paper';
import { useGetChat } from 'src/frontend/hooks';
import type { conversationMessage } from 'src/frontend/types';
import { ChatBubble } from '../ChatBubble';

/**
 * This file handles rendering all the different chat bubbles from a saved chat in firestore
 *
 * There is case distinction between AI and user messages because the storage format is different
 */

type RenderChatProps = {
  chatId: string;
};

export function RenderChat(props: RenderChatProps) {
  const { chatId } = props;
  const { chat, status } = useGetChat(chatId);
  if (status === 'loading') return <ActivityIndicator />;
  let id = 0;
  return (
    <>
      {chat?.conversation.map((item: conversationMessage) => {
        const { type, message } = item;
        let AIResponse = '';
        if (type === 'AI') {
          const entries = Object.entries(message);
          if (entries.length > 0) AIResponse = entries[0][1];
        }
        return (
          <ChatBubble
            key={type === 'USER' ? (message as string) + id++ : AIResponse + id++}
            message={item}
          />
        );
      })}
    </>
  );
}
