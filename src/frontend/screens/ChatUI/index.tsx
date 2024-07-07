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
import { Screens, getLLMResponse } from 'src/frontend/helpers';
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
  useGetLLMResponse
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

  //const {LLMResponse, isGenerating, LLMResponseError} = useGetLLMResponse('');
  const [isSendButtonDisabled, setSendButtonDisabled] = useState(false);
  //const isSendButtonDisabled = false;

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
  }, [chat?.conversation, activeChatId, responseIndex]);

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
      const msg: conversationMessage = { user: text };
      const newChat: Chat = {
        title: text,
        model: [LLM_MODELS[0].key],
        conversation: [msg],
        createdAt: Timestamp.now()
      };
      setText('');
      setSendButtonDisabled(true);
      const newId = createChat(newChat);
      newId
        .then((newId) => setActiveChatId(newId || 'default'))
        .then(() => {
          getLLMResponseAndUpdateFirestore(newChat.model[0], newChat); //TODO: receive answers from multiple LLMS
        });
      // Send user message in existing chat
    } else if (chat?.id && text.trim()) {
      const msg: conversationMessage = { user: text };
      chat?.conversation.push(msg);
      setText('');
      updateChat({ conversation: chat.conversation }).catch(console.error);
      setSendButtonDisabled(true);
      getLLMResponseAndUpdateFirestore(getActiveLLMs(LLMs)[0], chat); //TODO: receive answers from multiple LLMS
    }
  }

  function getActiveLLMs(LLMs: { [key: string]: { name: string; active: boolean } }) {
    const activeLLMList = [];
    for (const [key, value] of Object.entries(LLMs)) {
      if (value.active) {
        activeLLMList.push(key);
      }
    }
    return activeLLMList;
  }

  function getLLMResponseAndUpdateFirestore(model: string, currentChat: Chat) {
    // function popLatestLoadingMessage(conversation: conversationMessage[]) {
    //   const index = conversation.map(message => 'loading' in message).lastIndexOf(true);
    //   if (index !== -1) {
    //     conversation.splice(index, 1);
    //     return;
    //   }
    // }
    if (currentChat === undefined) {
      console.log('Trying to save LLM response but chat is undefined');
      return;
    }
    console.log(currentChat.conversation);

    //copy to avoid overwrite conflicts
    const newChat: Chat = {
      id: currentChat.id,
      title: currentChat.title,
      model: currentChat.model,
      conversation: currentChat.conversation,
      createdAt: currentChat.createdAt
    };
    // smooth chat UI displays loading bubble until LLM response is received
    updateChat({ conversation: [...currentChat.conversation, { loading: 'loading' }] }).catch(
      console.error
    );

    getLLMResponse(model, newChat.conversation).then((response) => {
      const msg: conversationMessage = { [model]: response };
      //popLatestLoadingMessage(newChat.conversation)
      newChat.conversation.push(msg);
      console.log(newChat.conversation);
      updateChat(newChat).catch(console.error);
      setSendButtonDisabled(false);
    });
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
            disabled={isSendButtonDisabled}
          />
        ) : (
          <IconButton
            icon='microphone'
            onPressIn={startRecognition}
            onPressOut={stopRecognition}
            iconColor={colors.onPrimary}
            containerColor={isRecording ? colors.inversePrimary : colors.primary}
            style={{ marginHorizontal: 5 }}
            disabled={isSendButtonDisabled}
          />
        )}
      </View>
    </View>
  );
}
