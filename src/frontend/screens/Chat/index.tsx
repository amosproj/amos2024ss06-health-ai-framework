import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { arrayUnion } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { ChatKeyboard, RenderChat, VoiceButton } from 'src/frontend/components';
import { useCreateChat, useGetChat, useGetResponse, useUpdateChat } from 'src/frontend/hooks';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import { styles } from './style';

export function Chat() {
  const { params } = useRoute<RouteProp<MainDrawerParams>>();
  const { setParams } = useNavigation<DrawerNavigationProp<MainDrawerParams>>();
  const { colors } = useTheme();
  const [activeChatId, setActiveChatId] = useState('new');
  const { chat } = useGetChat(activeChatId);
  const { updateChat } = useUpdateChat();
  const { createChat } = useCreateChat();
  const scrollViewRef = useRef<ScrollView>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const getResponse = useGetResponse();

  // ------------- Keyboard scrolls down when sending a message -------------
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat?.conversation.length]);

  // ------------- Create chat -------------
  const createNewChat = async (firstMessage: string) => {
    let chatId = 'new';
    try {
      const userPrompt = { type: 'USER', message: firstMessage };
      const result = await createChat({
        title: firstMessage,
        model: ['gpt-4'],
        conversation: [userPrompt]
      });
      setActiveChatId(result?.id || 'new');
      setParams({ chatId: result?.id });
      chatId = result?.id || 'new';
    } catch (error) {
      console.error('Error creating chat:', error);
    }
    return chatId;
  };

  // ------------- Update chat id -------------
  useEffect(() => {
    setActiveChatId(params?.chatId || 'new');
  }, [params?.chatId]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async function fetchResponse(query: string): Promise<any> {
    const url = 'https://us-central1-amos-agent-framework.cloudfunctions.net/get_response_url_2';
    const data = {
      query: query,
      llms: chat?.model || ['gpt-4'],
      history: JSON.parse(JSON.stringify(chat?.conversation || []))
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ------------- Send Message -------------
  const sendMessage = async () => {
    const queryText = text.trim();
    try {
      setIsLoading(true);
      setText('');
      if (!queryText) return;
      if (activeChatId === 'new') {
        const chatId = await createNewChat(text);
        const data = await fetchResponse(queryText);
        await updateChat(chatId, { conversation: arrayUnion({ type: 'AI', message: data }) });
      } else {
        await updateChat(activeChatId, {
          conversation: arrayUnion({ type: 'USER', message: queryText })
        });
        const data = await fetchResponse(queryText);
        await updateChat(activeChatId, { conversation: arrayUnion({ type: 'AI', message: data }) });
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollViewRef}
      >
        <RenderChat chatId={activeChatId} />
        {isLoading && <ActivityIndicator />}
      </ScrollView>
      <View style={[styles.inputContainer, { borderColor: colors.outlineVariant }]}>
        <ChatKeyboard text={text} setText={setText} onSend={sendMessage} />
        <VoiceButton
          text={text}
          setText={setText}
          onPress={sendMessage}
          isSendButtonDisabled={isLoading}
        />
      </View>
    </View>
  );
}
