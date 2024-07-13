import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect } from 'react';
import { Alert, Platform, Pressable } from 'react-native';
import RNFS from 'react-native-fs';
import { IconButton, useTheme } from 'react-native-paper';
import { LLM_MODELS, useActiveChatId, useGetChat } from 'src/frontend/hooks';

/**
 * This file holds the code for rendering the saving txt button.
 */

export function SavingChat() {
  const { colors } = useTheme();
  const { activeChatId } = useActiveChatId();
  const { chat } = useGetChat(activeChatId);

  // Determine if the button should be disabled
  const isButtonDisabled = !chat;

  // Request media library permissions
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        // Request media library permissions
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Media library permissions are required.');
        }
      }
    };

    requestPermissions();
  }, []);

  // Saving to download and clipboard
  const handleSaving = async () => {
    try {
      // Check if chat is available
      if (!chat || !chat.conversation || chat.conversation.length === 0) {
        Alert.alert('No Chat Available', 'There is no chat content available.');
        return;
      }

      const { formattedChatContent, fileName, path } = getChatContent();

      // Copy to clipboard
      await Clipboard.setStringAsync(formattedChatContent);
      // Save to file
      await RNFS.writeFile(path, formattedChatContent, 'utf8');

      // Inform user
      Alert.alert(
        'Chat Saved',
        `Chat saved to Downloads folder as ${fileName} and also copied to clipboard.`
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to perform action.');
    }
  };

  // Get chat content
  function getChatContent() {
    let messageIndex = 1;
    const formattedChatContent = chat.conversation
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .map((conversation: any) => {
        if (conversation.type === 'USER') {
          return `(${messageIndex++})\nUser:\n${conversation.message}\n`;
        }
        if (conversation.type === 'AI') {
          const aiResponses = LLM_MODELS.map(({ key, name }) => {
            if (conversation.message[key]) {
              //  && conversation.message[key] !== 'Model Not Found'
              return `${name}:\n${conversation.message[key]}`;
            }
            return '';
          })
            .filter(Boolean)
            .join('\n\n');
          return aiResponses ? `${aiResponses}\n\n` : '';
        }
        return '';
      })
      .join('\n');

    const metadata = getMetadata();
    const fullContent = `${metadata}\n${formattedChatContent}`;

    const now = new Date();
    const fileName = `chat_${now.toISOString().replace(/[:T.]/g, '-').slice(0, -5)}.txt`;
    const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    return { formattedChatContent: fullContent, fileName, path };
  }

  // Create metadata for the chat
  function getMetadata() {
    const createdAtDate = new Date(chat.createdAt.toDate());
    // Format created at date
    const formattedCreatedAt = `${createdAtDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}, ${createdAtDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    })}`;

    // Create metadata
    const metadata = `Title: ${chat.title}\nCreated: ${formattedCreatedAt}\n\n`;
    return metadata;
  }

  return (
    <Pressable onPress={handleSaving} style={{ marginVertical: -4 }} disabled={isButtonDisabled}>
      <IconButton icon='save' size={24} iconColor={colors.primary} disabled={isButtonDisabled} />
    </Pressable>
  );
}
