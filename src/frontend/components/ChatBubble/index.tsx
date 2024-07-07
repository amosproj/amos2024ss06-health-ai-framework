import type { conversationMessage } from 'src/frontend/types';
import { ActivityIndicator, IconButton, Button, useTheme } from 'react-native-paper';
import { Style } from './style';
import { ScrollView, Text, TextInput, View } from 'react-native';
import type { MD3Colors } from 'react-native-paper/lib/typescript/types';
import React, { useState } from 'react';
import * as Speech from 'expo-speech';

type ChatBubbleProps = {
  message: conversationMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
  const { colors } = useTheme();

  //----------------Define states etc-----------------
  const isUser = 'user' in message;
  const isLoading = 'loading' in message;
  const responses = !isUser && !isLoading ? Object.entries(message) : [];

  const [llm, setLLM] = useState(responses.length > 0 ? responses[0][0] : 'error');
  //we need this because a message with an index can change internally due to loading messages
  if (responses.length > 0 && responses[0][0] !== llm) {
    setLLM(responses[0][0]);
  }
  const response = llm === 'error' ? 'error' : message[llm];

  //---------------Functions for buttons----------------
  const handleNextResponse = () => {
    const curIndex = responses.findIndex(([key, value]) => key === llm);
    if (curIndex === -1) {
      console.log('Chatbubble: handlePreviousResponse: Error: llm not found in responses');
      return <ActivityIndicator />;
    }
    const nextIndex = (curIndex + 1) % responses.length;
    setLLM(responses[nextIndex][0]);
  };

  const handlePreviousResponse = () => {
    const curIndex = responses.findIndex(([key, value]) => key === llm);
    if (curIndex === -1) {
      console.log('Chatbubble: handlePreviousResponse: Error: llm not found in responses');
      return <ActivityIndicator />;
    }
    const prevIndex = (curIndex - 1 + responses.length) % responses.length;
    setLLM(responses[prevIndex][0]);
  };

  //---------------Render Chat Bubble----------------
  if (isLoading) {
    return loadingBubble();
  }
  // biome-ignore lint/style/noUselessElse: stupid linting is wrong
  else if (isUser) {
    return userBubble();
  }
  // LLM --> Display Side by side chat bubbles
  // biome-ignore lint/style/noUselessElse: stupid linting is wrong
  else {
    return llmBubble();
  }

  //---------------Subcomponents----------------
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

  function userBubble() {
    const text = message.user;
    return (
      <View
        //key={key}
        style={[
          Style.chatBubble,
          [Style.sentMessage],
          [{ backgroundColor: colors.inversePrimary }]
        ]}
      >
        <Text>{text}</Text>
      </View>
    );
  }

  function llmSelector() {
    return (
      <View style={Style.llmSelector}>
        <IconButton
          icon='chevron-left'
          size={12}
          onPress={handlePreviousResponse}
          disabled={responses.length <= 1}
          style={Style.chevronButtonLeft}
        />
        <Text style={Style.llmName}>{llm}</Text>
        <IconButton
          icon='chevron-right'
          size={12}
          onPress={handleNextResponse}
          disabled={responses.length <= 1}
          style={Style.chevronButtonRight}
        />
        <IconButton
          icon='volume-up'
          size={16}
          onPress={() => {
            Speech.speak(response ? response : '', { language: 'en-US', pitch: 1, rate: 1 });
          }}
          style={Style.speakButton}
        />
      </View>
    );
  }

  function messageContent() {
    return (
      <View style={Style.messageContent}>
        <Text style={Style.textView}>{response}</Text>
      </View>
    );
  }

  function llmBubble() {
    return (
      <View
        //key={key}
        style={[
          Style.chatBubble,
          [Style.receivedMessage],
          [{ backgroundColor: colors.surfaceVariant }]
        ]}
      >
        <View style={Style.messageWrapper}>
          {llmSelector()}
          {messageContent()}
        </View>
      </View>
    );
  }
}
