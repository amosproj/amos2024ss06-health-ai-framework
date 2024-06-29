import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { signOut } from 'firebase/auth';
import React from 'react';
import { useAuth } from 'reactfire';
import { Screens } from 'src/frontend/helpers';
import type { AppRoutesParams } from 'src/frontend/routes';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Keyboard } from 'react-native';
import { useRef, useEffect } from 'react';

import { styles } from './style';
import type { Chat } from 'src/frontend/types';
import { useGetAllChat, useUpdateChat, useGetChat, useActiveChatId} from 'src/frontend/hooks';
import { Timestamp } from 'firebase/firestore';
import {ActivityIndicator, IconButton} from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Voice from '@react-native-voice/voice';


export type ChatUiProps = {
    chatId: string;
};

export function ChatUI(/*props: ChatUiProps*/) {
  // const chatId = props.chatId;
  // console.log("ChatId: ", chatId)

  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRoute<RouteProp<MainDrawerParams>>();

  // ------------- Render Chat from firebase -------------
  //const { chats, status, error } = useGetAllChat();
  //const [chat, setChat] = useState<Chat | null>(null); 
  const { activeChatId, setActiveChatId } = useActiveChatId();
  const { chat, status, error } = useGetChat(activeChatId);
  //console.log("chatId: ", activeChatId)

  useEffect(() => {
    renderMessages();
  }, [chat?.conversation.length]);

  const renderMessages = () => {
    if(status === 'loading') 
      return ( <ActivityIndicator/> );
    //console.log("Chat: ", chat)
    if(chat === undefined) //TODO: This is Work in Progress
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text> Select a chat in the drawer to begin. </Text>
        </View>
      );

    let i = 0;
    return chat?.conversation.map((message, index) => (
      <View
        key={chat.id + (i++).toString()}
        style={[styles.message, index % 2 === 1
          ? [styles.sentMessage, { backgroundColor: colors.inversePrimary}]
          : [styles.receivedMessage, { backgroundColor: colors.surfaceVariant }]
        ]}
      >
        <Text>{message}</Text>
      </View>
    ));
  };
  // ------------- End render Chat from firebase -------------


  // ------------- Sending new message to firebase -------------

  const [text, setText] = useState('');
  const { updateChat, isUpdating, error: updateError } = useUpdateChat(chat?.id || '');

  function sendMessage() {
    if ( chat?.id && text.trim()) {
      updateChat({
        conversation: [...(chat?.conversation || []), text]
      }).then(() => {
        chat?.conversation.push(text)
        //setChat(chat);
        setText('');
        //setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }).catch(error => {
        console.error('Error updating chat:', error);
      });
    }
  }

  // ------------- End sending new message to firebase -------------

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

  // ------------- End keyboard and scrolling -------------

  // ------------- Voice Recognition Setup -------------
  const [recognized, setRecognized] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e) => {
    setStarted('√');
  };

  const onSpeechRecognized = (e) => {
    setRecognized('√');
  };

  const onSpeechResults = (e) => {
    setResults(e.value);
    setText(e.value[0]); // Set the first result to the text input
  };

  const startRecognition = async () => {
    setRecognized('');
    setStarted('');
    setResults([]);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognition = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  // ------------- End Voice Recognition Setup -------------

  // ------------- Conditional Rendering of Voice/Send Button -------------
  
// ------------- Conditional Rendering of Voice/Send Button -------------
return (
  <View style={styles.container}>
    <ScrollView style={styles.chatContainer} contentContainerStyle={styles.scrollViewContent} ref={scrollViewRef}>
      {renderMessages()}
    </ScrollView>
    <View style={[styles.inputContainer, { borderColor: colors.outlineVariant }]}>
      <TextInput
        style={[styles.input, { borderColor: colors.outlineVariant }]}
        placeholder="Write something here..."
        value={text}
        onChangeText={text => setText(text)}
        onSubmitEditing={sendMessage}
        blurOnSubmit={false}
      />
      {text.trim() ? (
        <IconButton
          icon="paper-plane"
          onPress={sendMessage}
          iconColor={colors.onPrimary}
          containerColor={colors.primary}
          style={{ marginHorizontal: 5, paddingRight: 3 }}
        />
      ) : (
        <IconButton
          icon="microphone"
          onPressIn={startRecognition}
          onPressOut={stopRecognition}
          iconColor={colors.onPrimary}
          containerColor={colors.primary}
          style={{ marginHorizontal: 5, paddingRight: 3 }}
        />
      )}
    </View>
    {results.map((result, index) => (
      <Text key={index} style={styles.transcript}> {result}</Text>
    ))}
  </View>
);
}