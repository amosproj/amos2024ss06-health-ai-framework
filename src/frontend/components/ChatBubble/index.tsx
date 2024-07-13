import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ActivityIndicator, Button, IconButton, useTheme } from 'react-native-paper';
import type { MD3Colors } from 'react-native-paper/lib/typescript/types';
import type { conversationMessage } from 'src/frontend/types';
import { SpeakButton } from '../SpeakButton';
import { Style } from './style';

/**
 * This file renders a chat bubble in the chat UI.
 *
 * Depending on whether the message is from the user or the AI,
 * the chat bubble will be styled differently.
 */

type ChatBubbleProps = {
  message: conversationMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
  const { colors } = useTheme();

  //----------------Define states etc-----------------
  const isUser = message.type === 'USER';
  const AIResponses = !isUser ? Object.entries(message.message) : [];

  // set default LLM to first LLM that has a response
  const [llm, setLLM] = useState(
    AIResponses.length > 0
      ? AIResponses.find(([key, value]) => value !== 'Model Not Found')?.[0] || AIResponses[0][0]
      : 'error'
  );

  //---------------Functions for buttons----------------
  const handleNextResponse = () => {
    const curIndex = AIResponses.findIndex(([key, value]) => key === llm);
    if (curIndex === -1) {
      console.log('Chatbubble: handlePreviousResponse: Error: llm not found in AIResponses');
      return <ActivityIndicator />;
    }
    const nextIndex = (curIndex + 1) % AIResponses.length;
    setLLM(AIResponses[nextIndex][0]);
  };

  const handlePreviousResponse = () => {
    const curIndex = AIResponses.findIndex(([key, value]) => key === llm);
    if (curIndex === -1) {
      console.log('Chatbubble: handlePreviousResponse: Error: llm not found in AIResponses');
      return <ActivityIndicator />;
    }
    const prevIndex = (curIndex - 1 + AIResponses.length) % AIResponses.length;
    setLLM(AIResponses[prevIndex][0]);
  };

  //---------------Render Chat Bubble----------------
  if (isUser) {
    return userBubble();
  }
  // biome-ignore lint/style/noUselessElse: stupid linting is wrong
  else {
    return llmBubble(); // LLM --> Display Side by side chat bubbles
  }

  //---------------Subcomponents----------------

  function userBubble() {
    const text = message.message as string;
    return (
      <View
        //key={key}
        style={[
          Style.chatBubble,
          [Style.sentMessage],
          [{ backgroundColor: colors.inversePrimary }]
        ]}
      >
        <Markdown>{text}</Markdown>
      </View>
    );
  }

  function llmSelector(response: string) {
    return (
      <View style={Style.llmSelector}>
        <IconButton
          icon='chevron-left'
          size={12}
          onPress={handlePreviousResponse}
          disabled={AIResponses.length <= 1}
          style={Style.chevronButtonLeft}
        />
        <Text style={Style.llmName}>{llm}</Text>
        <IconButton
          icon='chevron-right'
          size={12}
          onPress={handleNextResponse}
          disabled={AIResponses.length <= 1}
          style={Style.chevronButtonRight}
        />
        <SpeakButton response={response} />
      </View>
    );
  }

  function llmBubble() {
    let response = (message.message as { [key: string]: string })[llm];
    if (response === undefined) {
      response = '';
    }
    return (
      <View
        style={[
          Style.chatBubble,
          [Style.receivedMessage],
          [{ backgroundColor: colors.surfaceVariant }]
        ]}
      >
        <View style={Style.messageWrapper}>
          {llmSelector(response)}
          <View style={Style.messageContent}>
            <Markdown>{response}</Markdown>
          </View>
        </View>
      </View>
    );
  }

  function loadingBubble() {
    return (
      <View
        style={[
          Style.chatBubble,
          Style.receivedMessage,
          { backgroundColor: colors.surfaceVariant }
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }
}
