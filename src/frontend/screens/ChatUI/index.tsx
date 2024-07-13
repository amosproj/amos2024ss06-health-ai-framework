import type { FirebaseError } from 'firebase/app';
import { arrayUnion } from 'firebase/firestore';
import React from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { ChatKeyboard, RenderChat, VoiceButton } from 'src/frontend/components';
import {
  LLM_MODELS,
  useActiveChatId,
  useCreateChat,
  useGetChat,
  useGetResponse,
  useLLMs,
  useUpdateChat
} from 'src/frontend/hooks';
import { styles } from './style';

export type ChatUiProps = {
  chatId: string;
};

export function ChatUI() {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null); // Scrolling down chat when message is sent
  const { activeChatId, setActiveChatId } = useActiveChatId(); // chat id of current chat
  const { chat } = useGetChat(activeChatId); // current displayed chat
  const [text, setText] = useState(''); //text in the input field
  const [isSendButtonDisabled, setSendButtonDisabled] = useState(false);
  const getResponse = useGetResponse(); // LLM firebase function
  const { updateChat } = useUpdateChat(activeChatId); // update chat in firestore
  const { createChat } = useCreateChat();
  const { activeLLMs } = useLLMs(activeChatId || 'default');
  // Flag to wait for LLM answer when a new chat is created
  const [waitingForAnswerOnNewChat, setWaitingForAnswerOnNewChat] = useState<{
    waiting: boolean;
    query: string;
    newChatId: string;
  }>({ waiting: false, query: '', newChatId: 'default' });

  // ------------- Keyboard scrolls down when sending a message -------------
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat?.conversation.length]);

  //---------------- Sending messages and managing Firestore ----------------

  // This function is called when the user sends a prompt
  async function sendMessage() {
    setSendButtonDisabled(true);
    const query = text.trim();
    setText('');

    // If chat is 'default' (empty), create a new chat when prompt is sent
    // Otherwise just update chat with LLM answer

    // Create new chat
    if (activeChatId === 'default') {
      const newId = await createNewChat(query);
      if (newId !== undefined && newId !== '') {
        // once all chat variables are updated, get the LLM answer in async effect @fetchLLMAnswer
        setWaitingForAnswerOnNewChat({ waiting: true, query: query, newChatId: newId });
      }

      // Update existing chat
    } else {
      try {
        await updateChat({ conversation: arrayUnion({ type: 'USER', message: query }) });
        await getLLMAnswer(query);
      } catch (error) {
        console.error('Error in sendMessage:', error);
      } finally {
        setSendButtonDisabled(false);
      }
    }
  }

  // ---- We want to query the LLM with the chat prompt when a new chat is created ----
  // Need to wait for @chat and @activeChatId to be updated
  // @WaitingForAnswerOnNewChat flag is set in sendMessage() when a new chat is created
  useEffect(() => {
    const fetchLLMAnswer = async () => {
      // this condition is probably not totally correct
      if (
        waitingForAnswerOnNewChat.waiting &&
        activeChatId !== 'default' &&
        activeChatId === waitingForAnswerOnNewChat.newChatId
      ) {
        try {
          await getLLMAnswer(waitingForAnswerOnNewChat.query);
        } catch (error) {
          console.error('Error getting LLM answer:', error);
        } finally {
          // once the LLM answer is retrieved, set the flag to false
          setWaitingForAnswerOnNewChat({
            waiting: false,
            query: '',
            newChatId: waitingForAnswerOnNewChat.newChatId
          });
        }
      }
    };
    fetchLLMAnswer();
  }, [waitingForAnswerOnNewChat.waiting, activeChatId]);

  // Create new chat and update props of this component
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
    return '';
  };

  async function getLLMAnswer(queryText: string) {
    // default response

    let response: { [key: string]: string } = initResponses();

    // get Response from LLM
    try {
      //get active LLMS in correct format
      const llms = extractActiveLLMNames();
      console.log('getResponse for llms:', llms);
      const { data } = await getResponse({ query: queryText, llms: llms });
      response = data as { [key: string]: string };
    } catch (error) {
      console.error(error as FirebaseError);
    }

    // Update chat with LLM response
    try {
      await updateChat({ conversation: arrayUnion({ type: 'AI', message: response }) });
    } catch (error) {
      console.error(error as FirebaseError);
    } finally {
      setSendButtonDisabled(false); // Once all is updated, the user is allowed to type again
    }
  }

  // ------------- Helper functions -------------
  function initResponses() {
    const response: { [key: string]: string } = Object.keys(activeLLMs).reduce(
      (acc, key) => {
        if (activeLLMs[key].active) {
          acc[key] = 'Could not retrieve answer from LLM';
        }
        return acc;
      },
      {} as { [key: string]: string }
    );
    if (Object.keys(response).length === 0)
      response['gpt-4'] = 'Could not retrieve answer from LLM';
    return response;
  }

  // returns currently selected LLMs and 'gpt-4' if no LLM is selected
  function extractActiveLLMNames() {
    const llms: string[] = [];
    for (const llm of Object.keys(activeLLMs)) {
      if (activeLLMs[llm].active) {
        llms.push(llm);
      }
    }

    if (llms.length === 0) llms.push('gpt-4');
    return llms;
  }

  function extractTitle(queryText: string) {
    //TODO: maybe use a more sophisticated method to extract the title later
    const arr = queryText.split(' ');
    let title = '';
    for (let i = 0; i < arr.length && i < 5; i++) {
      title += `${arr[i]} `;
    }
    return title;
  }
  // ------------- Render -------------

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
