import Voice, {
  type SpeechResultsEvent,
  type SpeechStartEvent,
  type SpeechRecognizedEvent
} from '@react-native-voice/voice';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import * as Speech from 'expo-speech';
import React from 'react';
import { useCallback, useState } from 'react';
import { useEffect, useRef } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { Keyboard } from 'react-native';
import { Vibration } from 'react-native';
import { Screens } from 'src/frontend/helpers';
import type { AppRoutesParams } from 'src/frontend/routes';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import type { Chat, conversationMessage } from 'src/frontend/types';
import {
  useUpdateChat,
  useGetChat,
  useActiveChatId,
  useCreateChat,
  LLM_MODELS,
  useLLMs,
  useGoogleDocsContent
} from 'src/frontend/hooks';
import { Timestamp } from 'firebase/firestore';
import { ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { styles } from './style';
import { ChatBubble } from 'src/frontend/components';

export type ChatUiProps = {
  chatId: string;
};

export function ChatUI(/*props: ChatUiProps*/) {
  const {content, docsError} = useGoogleDocsContent("1xrfrwyRCTrxiCupiKSSFgKUxiCTXgr45gPJYybnY23w")
  console.log("Got google docs content: ", content);
  console.log("docs error: ", docsError);

  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const { createChat, isCreating } = useCreateChat();
  const { activeChatId, setActiveChatId } = useActiveChatId();
  const { chat, status, error } = useGetChat(activeChatId);
  const [isRecording, setIsRecording] = useState(false);

  const { activeLLMs: LLMs, toggleLLM } = useLLMs(activeChatId);
  const [responses, setResponses] = useState<string[]>([]);
  //for chatbubble
  const [responseIndex, setResponseIndex] = useState(0);

  const [text, setText] = useState('');
  const { updateChat, isUpdating, error: updateError } = useUpdateChat(chat?.id || '');

  const [recognized, setRecognized] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState<string[]>([]);

  // ------------- Keyboard and scrolling -------------

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat?.conversation.length]);

  useEffect(() => {
    renderMessages();
  }, [chat?.conversation.length, activeChatId, responseIndex]);

  // ------------- End keyboard and scrolling -------------

  // ------------- Render Chat from firebase -------------

  const renderMessages = () => {
    if (status === 'loading' || isCreating) return <ActivityIndicator />;
    if (chat === undefined)
      return (
        <View style={styles.centerMessage}>
          <Text style={{ fontSize: 16 }}> Write a message to begin. </Text>
        </View>
      );

    let i = 0;
    try {
      return chat?.conversation.map((message, index) => (
        //ChatBubble(message, (chat.id + (i++).toString()), colors, responseIndex, setResponseIndex)
        <ChatBubble message={message} key={chat.id + (i++).toString()} />
      ));
    } catch (error) {
      return <ActivityIndicator />;
    }
  };

  // ------------- End render Chat from firebase -------------

  // ------------- Sending new message to firebase -------------

  function sendMessage() {
    // Create new Chat
    if (chat === undefined && text.trim()) {
      setText('');
      const msg: conversationMessage = { user: text };
      const newChat: Chat = {
        title: text,
        model: [LLM_MODELS[0].key],
        conversation: [msg],
        createdAt: Timestamp.now()
      };
      const newId = createChat(newChat);
      newId.then((newId) => setActiveChatId(newId || 'default'));
    } else if (chat?.id && text.trim()) {
      const msg: conversationMessage = { user: text };
      chat?.conversation.push(msg);
      setText('');
      updateChat({ conversation: chat.conversation }).catch(console.error);
    }
  }

  // ------------- End sending new message to firebase -------------

  // ------------- Voice Recognition Setup -------------

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: SpeechStartEvent) => {
    setStarted('√');
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    setRecognized('√');
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    setResults(e.value ?? []);
    setText(e.value?.[0] ?? '');
  };

  const startRecognition = async () => {
    setIsRecording(true); // Set recording state to true
    Vibration.vibrate(50); // Vibrate for 50 milliseconds on press

    setRecognized('');
    setStarted('');
    setResults([]);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
      setIsRecording(false); // Reset recording state on error
    }
  };

  const stopRecognition = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
    Vibration.vibrate(50); // Vibrate for 50 milliseconds on release
    setIsRecording(false); // Reset recording state
  };

  // ------------- End Voice Recognition Setup -------------

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollViewRef}
      >
        {renderMessages()}
      </ScrollView>
      <View style={[styles.inputContainer, { borderColor: colors.outlineVariant }]}>
        <TextInput
          style={[styles.input, { borderColor: colors.outlineVariant }]}
          placeholder='Write something here...'
          value={text}
          onChangeText={(text) => setText(text)}
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        />
        {text.trim() ? (
          <IconButton
            icon='paper-plane'
            onPress={sendMessage}
            onPressOut={stopRecognition}
            iconColor={colors.onPrimary}
            containerColor={colors.primary}
            style={{ marginHorizontal: 5, paddingRight: 3 }}
          />
        ) : (
          <IconButton
            icon='microphone'
            onPressIn={startRecognition}
            onPressOut={stopRecognition}
            iconColor={colors.onPrimary}
            containerColor={isRecording ? colors.inversePrimary : colors.primary}
            style={{ marginHorizontal: 5 }}
          />
        )}
      </View>
    </View>
  );
}
