import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ActivityIndicator, Avatar, useTheme } from 'react-native-paper';
import { useUser } from 'reactfire';
import { useActiveChatId, useGetChat } from 'src/frontend/hooks';
import type { conversationMessage } from 'src/frontend/types';
import { ChatBubble } from '../ChatBubble';
import { Style } from './style';

/**
 * This file handles rendering all the different chat bubbles from a saved chat in firestore
 *
 * There is case distinction between AI and user messages because the storage format is different
 */


export function RenderChat() {
  const { activeChatId } = useActiveChatId();
  const { chat, status } = useGetChat(activeChatId);
  const { colors } = useTheme();
  const { data: user } = useUser();

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
