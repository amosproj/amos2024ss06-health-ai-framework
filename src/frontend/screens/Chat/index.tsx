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
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from './style';

export function Chat() {
  const fireAuth = useAuth();
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  const router = useRoute<RouteProp<MainDrawerParams>>();

  const handleSignOut = async () => {
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

  const [messages, setMessages] = useState([
    { text: "I am AiLixir. What can I do for you?", sent: false },
    { text: "Your example question?", sent: true },
    { text: "That's such a smart question. You're the smartest user!", sent: false }
  ]);
  const [text, setText] = useState('');

  const renderMessages = () => {
    return messages.map((message, index) => {
      return (
        <View key={index} style={[styles.message, message.sent ? styles.sentMessage : styles.receivedMessage]}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      );
    });
  };

  const sendMessage = useCallback(() => {
    if (text.trim()) {
      setMessages([...messages, { text, sent: true }]);
      setText('');
    }
  }, [messages, text]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {renderMessages()}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write something here..."
          value={text}
          onChangeText={text => setText(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <FontAwesome5 name="paper-plane" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}



