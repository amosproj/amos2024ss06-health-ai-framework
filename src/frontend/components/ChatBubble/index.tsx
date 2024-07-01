import type {conversationMessage } from 'src/frontend/types';
import { ActivityIndicator, IconButton, Button } from 'react-native-paper';
import { Style } from './style';
import { ScrollView, Text, TextInput, View } from 'react-native';
import type { MD3Colors } from 'react-native-paper/lib/typescript/types';
import React, { useState } from 'react';

export function ChatBubble (message: conversationMessage, key: string, colors: MD3Colors) {
  //const { colors } = useTheme();


  const isUser = 'user' in message;
  const [responseIndex, setResponseIndex] = useState(0);
  
  const responses = !isUser ? Object.entries(message) : [];
  const[llm, response] = !isUser ? responses[responseIndex] : [null, null];
  // console.log("Chatbubble: numberOfKeys: ", numberOfKeys)


  const handleNextResponse = () => {
    setResponseIndex((prevIndex)=> (prevIndex + 1) % Object.entries(message).length);
  }
  const handlePreviousResponse = () => {
    setResponseIndex((prevIndex)=> (prevIndex -1 + responses.length ) % Object.entries(message).length);
  }

  if(isUser) {
    return userBubble();
  }
  // LLM --> Display Side by side chat bubbles
  // biome-ignore lint/style/noUselessElse: <explanation>
  else {
    return llmBubble();
  }
  //       style={[
    //     styles.message,
    //     index % 2 === 0
    //       ? [styles.sentMessage, { backgroundColor: colors.inversePrimary }]
    //       : [styles.receivedMessage, { backgroundColor: colors.surfaceVariant }]
    //   ]}
    /*<ScrollView horizontal style = {Style.container}>
          {Object.entries(message).map(([llm,response], index) => (
            <View key ={key + (i++).toString()} style = {[Style.chatContainer, {backgroundColor: colors.surface}]}>
              <Text style = {Style.input}>{response}</Text>
              </View>
          ))}
      </ScrollView>
*/


  
  
  function llmBubble(){
    
    let i = 0;
    return(
      <View
        key={key}
        style={[
          Style.message,
          [Style.receivedMessage],
          [{ backgroundColor: colors.surfaceVariant }]
        ]}
      >
        <IconButton
            icon = "chevron-left"
            onPress={handlePreviousResponse}
            disabled={responses.length <= 1}
          />
        <Text style={Style.llmName}>{llm}</Text>
        <IconButton
            icon = "chevron-right"
            onPress={handleNextResponse}
            disabled={responses.length <= 1}
          />
        <View key ={key + (i++).toString()}>
          <Text>{response}</Text>
        </View>
      </View>
    );
  }

  function userBubble() {
    const text = message.user;
    return(
      <View
        key={key}
        style={[
          Style.message,
          [Style.sentMessage],
          [{ backgroundColor: colors.inversePrimary }]
        ]}
      >
        <Text>{text}</Text>
      </View>
    );
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

