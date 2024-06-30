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
import { useGetAllChat, useUpdateChat, useGetChat, useActiveChatId, useCreateChat, LLM_MODELS} from 'src/frontend/hooks';
import { Timestamp } from 'firebase/firestore';
import {ActivityIndicator, IconButton} from 'react-native-paper';
import { useTheme } from 'react-native-paper';

export type ChatUiProps = {
    chatId: string;
};

export function ChatUI(/*props: ChatUiProps*/) {
  // const chatId = props.chatId;
  // console.log("ChatId: ", chatId)

  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRoute<RouteProp<MainDrawerParams>>(); //TODO: delete if not necessary
  const { createChat, isCreating } = useCreateChat();

  // ------------- Render Chat from firebase -------------
  //const { chats, status, error } = useGetAllChat();
  //const [chat, setChat] = useState<Chat | null>(null); 
  const { activeChatId, setActiveChatId } = useActiveChatId();
  let { chat, status, error } = useGetChat(activeChatId);

  useEffect(() => {
    renderMessages();
  }, [chat?.conversation.length, activeChatId]);

  const renderMessages = () => {
    if(status === 'loading' || isCreating)
      return ( <ActivityIndicator/> );
    //console.log("Chat: ", chat)
    if(chat === undefined) //TODO: This is Work in Progress
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 16}}> Write a message to begin. </Text>
        </View>
      );

    let i = 0;
    return chat?.conversation.map((message, index) => (
      <View
        key={chat.id + (i++).toString()}
        style={[styles.message, index % 2 === 0
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
    if(chat === undefined && text.trim()){
      setText('');
      const newChat : Chat = {title: text, model: [LLM_MODELS[0].key], conversation: [text], createdAt: Timestamp.now() };
      const newId = createChat(newChat);
      newId.then((newId) => {
        setActiveChatId(newId || 'default')
        //console.log("Created chat with newId", newId)
      })
      status = 'loading'
      renderMessages();
    } else if ( chat?.id && text.trim()) {
      chat?.conversation.push(text)
      setText('');
      updateChat({
        conversation: chat?.conversation
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
