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

export type ChatUiProps = {
    chatId: string;
};

export function ChatUI(/*props: ChatUiProps*/) {
  // const chatId = props.chatId;
  // console.log("ChatId: ", chatId)

  const { activeChatId, setActiveChatId } = useActiveChatId();



  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRoute<RouteProp<MainDrawerParams>>(); //TODO: delete if not necessary

  // ------------- Render Chat from firebase -------------
  const { chats, status, error } = useGetAllChat();
  const [chat, setChat] = useState<Chat | null>(null); 
  //const { chat, status, error } = useGetChat(activeChatId); //TODO: replace this with real chat once we know which chat to get
  //TODO: useGetChat hook and update chat everytime it changes in firestore
  useEffect(() => {
    if (status === 'success' && chats?.length > 0) {
        //TODO: replace this with real chat once we know which chat to get
        setChat(chats[0]);
    }
    else
    {
        setChat(null);
    }
  }, [chats?.length]); //TODO: also change this condition

  useEffect(() => {
    renderMessages();
  }, [chat?.conversation.length]);

  const renderMessages = () => {
    //console.log("Chat: ", chat)
    if(chat === null)
      return (<ActivityIndicator/>);

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
    if (text.trim() && chat?.id) {
      updateChat({
        conversation: [...(chat?.conversation || []), text]
      }).then(() => {
        chat?.conversation.push(text)
        setChat(chat);
        setText('');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.scrollViewContent}  ref={scrollViewRef}>
        {renderMessages()}
      </ScrollView>
      <View style={[styles.inputContainer, {borderColor: colors.outlineVariant}]}>
        <TextInput
          style={[styles.input, {borderColor: colors.outlineVariant}]}
          placeholder="Write something here..."
          value={text}
          onChangeText={text => setText(text)}
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        />
        <IconButton
          icon="paper-plane"
          onPress={sendMessage}
          iconColor={colors.onPrimary}
          containerColor={colors.primary}
          style={{marginHorizontal: 5, paddingRight: 3}}
        />
      </View>
    </View>
  );
}


//TODO: ----------- delete this if not needed in the end -----------
const handleSignOut = async () => {
  const fireAuth = useAuth();
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  
  try {
    GoogleSignin.configure({
      // Get the web client ID from the Expo configuration
      webClientId: Constants.expoConfig?.extra?.googleAuthClientId,
      // We want to force the code for the refresh token
      forceCodeForRefreshToken: true
    });
    await GoogleSignin.revokeAccess();
    await signOut(fireAuth);
    navigate('Auth', { screen: Screens.Landing });
  } catch (error) {
    console.error(error);
  }
};

