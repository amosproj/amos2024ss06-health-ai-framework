import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ChatUI = () => {
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  chatContainer: {
    flex: 1,
    marginVertical: 20,
  },
  message: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  sentMessage: {
    backgroundColor: '#E6E6FA', // Light gray with a lilac tint
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#F5F5F5', // Light gray
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#9370DB', // More lilac
    borderRadius: 20,
    padding: 10,
  },
});

export default ChatUI;