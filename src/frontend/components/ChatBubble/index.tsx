import type {conversationMessage } from 'src/frontend/types';
import { ActivityIndicator, IconButton, Button, useTheme } from 'react-native-paper';
import { Style } from './style';
import { ScrollView, Text, TextInput, View } from 'react-native';
import type { MD3Colors } from 'react-native-paper/lib/typescript/types';
import React, { useState } from 'react';
import * as Speech from 'expo-speech';

type ChatBubbleProps = {
  message: conversationMessage;
};

export function ChatBubble ({message} : ChatBubbleProps) {
  const { colors } = useTheme();

  const [responseIndex, setResponseIndex] = useState(0);
  const isUser = 'user' in message;
  const responses = !isUser ? Object.entries(message) : [];
  const[llm, response] = !isUser ? responses[responseIndex] : [null, null];

  const handleNextResponse = () => {
    const nextIndex = (responseIndex + 1) % Object.entries(message).length;
    setResponseIndex(nextIndex);
  }

  const handlePreviousResponse = () => {
    const prevIndex = (responseIndex -1 + responses.length ) % Object.entries(message).length;
    setResponseIndex(prevIndex);
  }


  function userBubble() {
    const text = message.user;
    return(
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
    <View style = {Style.llmSelector}>
      <IconButton
        icon = "chevron-left"
        size={12}
        onPress={handlePreviousResponse}
        disabled={responses.length <= 1}
        style={Style.chevronButtonLeft}
      />
        <Text style={Style.llmName}>{llm}</Text>
      <IconButton
          icon = "chevron-right"
          size={12}
          onPress={handleNextResponse}
          disabled={responses.length <= 1}
          style={Style.chevronButtonRight}
        />
        <IconButton
          icon='volume-up'
          size={16}
          onPress={() => {
              Speech.speak(response ? response : '', {language: 'en-US', pitch: 1, rate: 1})
            }
          }
          style={Style.speakButton}
        />
    </View>
    )
  }

  function messageContent() {
    return (
      <View style={Style.messageContent}>
        <Text style={Style.textView}>{response}</Text>
      </View>
    )
  }


  function llmBubble(){
    return(
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

  if(isUser) {
    return userBubble();
  }
  // LLM --> Display Side by side chat bubbles
  // biome-ignore lint/style/noUselessElse: <explanation>
  else {
    return llmBubble();
  }



  // return user chat bubble
  // if(numberOfKeys === 1) {
    // <View
    //     key={key}
    //     style={[
    //       styles.message,
    //       index % 2 === 0
    //         ? [styles.sentMessage, { backgroundColor: colors.inversePrimary }]
    //         : [styles.receivedMessage, { backgroundColor: colors.surfaceVariant }]
    //     ]}
    //   >
    //     {index % 2 !== 1 && (
    //       <IconButton
    //         icon='volume-up'
    //         size={16}
    //         onPress={() =>
    //           Speech.speak(message.text = {
    //             language: 'en-US',
    //             pitch: 1,
    //             rate: 1
    //           })
    //         }
    //         style={styles.speakButton}
    //       />
    //     )}
    //     <Text>{message.text}</Text>
    //   </View>
  // }
  // else {
  //   <ScrollView horizontal style = {styles.container} > 
  //       {responses.map((response, index) => (
  //         <View key ={response} style = {[styles.chatContainer, {backgroundColor: colors.surface}]}>
  //           <Text style = {styles.input}>{response}</Text>
  //           </View>
  //       ))}
  //     </ScrollView>
  // }

  // <View
      //   key={}
      //   style={[
      //     styles.message,
      //     index % 2 === 0
      //       ? [styles.sentMessage, { backgroundColor: colors.inversePrimary }]
      //       : [styles.receivedMessage, { backgroundColor: colors.surfaceVariant }]
      //   ]}
      // >
      //   {index % 2 !== 1 && (
      //     <IconButton
      //       icon='volume-up'
      //       size={16}
      //       onPress={() =>
      //         Speech.speak(message.text = {
      //           language: 'en-US',
      //           pitch: 1,
      //           rate: 1
      //         })
      //       }
      //       style={styles.speakButton}
      //     />
      //   )}
      //   <Text>{message.text}</Text>
      // </View>

  
}

