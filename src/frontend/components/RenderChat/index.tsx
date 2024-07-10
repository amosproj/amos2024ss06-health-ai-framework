import React from 'react';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ActivityIndicator, Avatar, useTheme } from 'react-native-paper';
import { useUser } from 'reactfire';
import { useActiveChatId, useGetChat } from 'src/frontend/hooks';
import type { conversationMessage } from 'src/frontend/types';
import { Style } from './style';

export function RenderChat() {
  const { activeChatId } = useActiveChatId();
  const { chat, status } = useGetChat(activeChatId);
  const { colors } = useTheme();
  const { data: user } = useUser();

  if (status === 'loading') return <ActivityIndicator />;

  return (
    <>
      {chat?.conversation.map((item: conversationMessage) => {
        const { type, message } = item;
        return (
          <View
            key={message}
            style={[Style.bubble, { backgroundColor: colors.surfaceVariant, marginBottom: 16 }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Text
                size={20}
                label={type === 'AI' ? 'A' : user?.displayName?.charAt(0) || 'U'}
                style={{ backgroundColor: colors.primary, marginRight: 4 }}
              />
              <Text style={{ color: colors.primary, fontWeight: 700 }}>
                {type === 'AI' ? 'AiLixir' : user?.displayName || 'User'}
              </Text>
            </View>
            <Markdown>{message}</Markdown>
          </View>
        );
      })}
    </>
  );
}
