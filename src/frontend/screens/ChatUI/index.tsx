import Voice, {
  type SpeechResultsEvent,
  type SpeechStartEvent,
  type SpeechRecognizedEvent
} from '@react-native-voice/voice';
import type { FirebaseError } from 'firebase/app';
import { FieldValue, arrayUnion } from 'firebase/firestore';
import React from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Keyboard } from 'react-native';
import { Vibration } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { ChatKeyboard, RenderChat, VoiceButton } from 'src/frontend/components';
import {
  LLM_MODELS,
  useActiveChatId,
  useCreateChat,
  useGetChat,
  useGetResponse,
  useUpdateChat
} from 'src/frontend/hooks';
import { styles } from './style';

export type ChatUiProps = {
  chatId: string;
};

export function ChatUI() {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const { activeChatId, setActiveChatId } = useActiveChatId();
  const { chat } = useGetChat(activeChatId);
  // const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  // const [recognized, setRecognized] = useState('');
  // const [started, setStarted] = useState('');
  // const [results, setResults] = useState<string[]>([]);
  const [isSendButtonDisabled, setSendButtonDisabled] = useState(false);
  const getResponse = useGetResponse();
  const { updateChat } = useUpdateChat(activeChatId);
  const { createChat } = useCreateChat();
  const [isChatTitleUpdated, setIsChatTitleUpdated] = useState(false);
  const [waitingForAnswerOnNewChat, setWaitingForAnswerOnNewChat] = useState<{
    waiting: boolean;
    query: string;
  }>({ waiting: false, query: '' });

  // ------------- Keyboard scrolls down when sending a message -------------
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat?.conversation.length]);

  // ------------- Voice Recognition Setup -------------
  // useEffect(() => {
  //   Voice.onSpeechStart = onSpeechStart;
  //   Voice.onSpeechRecognized = onSpeechRecognized;
  //   Voice.onSpeechResults = onSpeechResults;

  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   };
  // }, []);

  // const onSpeechStart = (e: SpeechStartEvent) => {
  //   setStarted('√');
  // };

  // const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
  //   setRecognized('√');
  // };

  // const onSpeechResults = (e: SpeechResultsEvent) => {
  //   setResults(e.value ?? []);
  //   setText(e.value?.[0] ?? '');
  // };

  // const startRecognition = async () => {
  //   setIsRecording(true); // Set recording state to true
  //   Vibration.vibrate(50); // Vibrate for 50 milliseconds on press

  //   setRecognized('');
  //   setStarted('');
  //   setResults([]);
  //   try {
  //     await Voice.start('en-US');
  //   } catch (e) {
  //     console.error(e);
  //     setIsRecording(false); // Reset recording state on error
  //   }
  // };

  // const stopRecognition = async () => {
  //   try {
  //     await Voice.stop();
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   Vibration.vibrate(50); // Vibrate for 50 milliseconds on release
  //   setIsRecording(false); // Reset recording state
  // };

  // useEffect(() => {
  //   const create = async () => {
  //     const result = await createChat({
  //       title: 'NewChat',
  //       model: ['gpt-4'],
  //       conversation: []
  //     });
  //     const id = result?.id;
  //     setActiveChatId(id || '');
  //   };
  //   if (activeChatId === 'default') create();
  // }, [activeChatId]);
  const createNewChat = async (queryText: string) => {
    const title = extractTitle(queryText);
    const userPrompt = { type: 'USER', message: queryText }; // correct firestore format
    try {
      const result = await createChat({
        title: title,
        model: [LLM_MODELS[0].key as string],
        conversation: [userPrompt]
      });
      // Make set active async and wait for reply
      const id = result?.id;
      setActiveChatId(id || '');

      return result?.id;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchLLMAnswer = async () => {
      if (waitingForAnswerOnNewChat.waiting && activeChatId !== 'default') {
        try {
          await getLLMAnswer(waitingForAnswerOnNewChat.query);
        } catch (error) {
          console.error('Error getting LLM answer:', error);
          // Here you might want to show an error message to the user
        } finally {
          setWaitingForAnswerOnNewChat({ waiting: false, query: '' });
        }
      }
    };
    fetchLLMAnswer();
  }, [waitingForAnswerOnNewChat.waiting, activeChatId, waitingForAnswerOnNewChat.query]);

  function extractTitle(queryText: string) {
    //TODO: maybe use a more sophisticated method to extract the title later
    const arr = queryText.split(' ');
    let title = '';
    for (let i = 0; i < arr.length && i < 3; i++) {
      title += `${arr[i]} `;
    }
    return title;
  }

  async function getLLMAnswer(queryText: string) {
    // Create a map

    let response: { [key: string]: string } = { 'gpt-4': 'Could not retrieve answer from LLM' };
    try {
      console.log('getting LLM answer for query: ', queryText);
      const { data } = await getResponse({ query: queryText, llms: ['gpt-4'] });
      response = data as { [key: string]: string };
      console.log('Response', data);
    } catch (error) {
      console.error(error as FirebaseError);
    }

    try {
      await updateChat({ conversation: arrayUnion({ type: 'AI', message: response }) });
    } catch (error) {
      console.error(error as FirebaseError);
    } finally {
      setSendButtonDisabled(false);
    }
  }

  async function sendMessage() {
    setSendButtonDisabled(true);
    const query = text.trim();
    setText('');
    try {
      if (activeChatId === 'default') {
        const newChatId = await createNewChat(query);
        if (newChatId) {
          setActiveChatId(newChatId);
          setWaitingForAnswerOnNewChat({ waiting: true, query });
        } else {
          throw new Error('Failed to create new chat');
        }
      } else {
        await updateChat({ conversation: arrayUnion({ type: 'USER', message: query }) });
        await getLLMAnswer(query);
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      // Here you might want to show an error message to the user
    } finally {
      setSendButtonDisabled(false);
    }
  }

  // ------------- End Voice Recognition Setup -------------

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollViewRef}
      >
        <RenderChat />
        {isSendButtonDisabled && <ActivityIndicator />}
      </ScrollView>
      <View style={[styles.inputContainer, { borderColor: colors.outlineVariant }]}>
        <ChatKeyboard text={text} setText={setText} onSend={sendMessage} />
        {/* <TextInput
          style={[styles.input, { borderColor: colors.outlineVariant }]}
          placeholder='Write something here...'
          value={text}
          onChangeText={(text) => setText(text)}
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        /> */}
        {/* {text.trim() ? (
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
        )} */}
        <VoiceButton
          text={text}
          setText={setText}
          onPress={sendMessage}
          isSendButtonDisabled={isSendButtonDisabled}
        />
      </View>
    </View>
  );
}
