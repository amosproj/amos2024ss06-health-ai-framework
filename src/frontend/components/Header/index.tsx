import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect } from 'react';
import { Alert, Platform, Pressable, View } from 'react-native';
import RNFS from 'react-native-fs';
import { IconButton, Surface, Text, useTheme } from 'react-native-paper';
import { LLM_MODELS, useActiveChatId, useGetChat } from 'src/frontend/hooks';
import { AilixirLogo } from 'src/frontend/icons';
import { DropdownMenu } from '../DropdownMenu';
import { Style } from './style';

/**
 * This file holds the code for rendering the header of the Chat UI.
 *
 * It contains the logic for ...
 * - Opening the Drawer
 * - Selecting the LLM model
 * - Saving the chat to the device and clipboard.
 */

export function Header(props: DrawerHeaderProps) {
  const { colors } = useTheme();
  const { navigation } = props;
  const { activeChatId } = useActiveChatId();
  const { chat } = useGetChat(activeChatId);

  // Determine if the button should be disabled
  const isButtonDisabled = chat === undefined;

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

  // Create metadata for the chat
  function getMetadata() {
    const createdAtDate = new Date(chat.createdAt.toDate());
    // Format created at date
    const formattedCreatedAt = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    }).format(createdAtDate);

    // Create metadata
    const metadata = `Title: ${chat.title}\nCreated: ${formattedCreatedAt}\n\n\n`;
    return metadata;
  }

  // Get chat content
  function getChatContent() {
    const formattedChatContent = chat.conversation
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .map((message: any) => {
        if (message.type === 'USER') {
          return `User: ${message.message}\n`;
        }
        if (message.type === 'AI') {
          const aiResponses = LLM_MODELS.map(({ key, name }) => {
            if (message[key] && message[key] !== 'Model Not Found') {
              return `${name}:\n${message[key]}`;
            }
            return null;
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

  return (
    <Surface style={Style.container} elevation={1}>
      <View style={Style.viewContainer}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginRight: 12 }}
        >
          <AilixirLogo height={36} width={36} />
        </Pressable>
        <Text variant='titleLarge'>AiLixir</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <DropdownMenu />
        <Pressable onPress={handleSaving} style={Style.actionButton} disabled={isButtonDisabled}>
          <IconButton
            icon='save'
            size={24}
            iconColor={colors.primary}
            disabled={isButtonDisabled}
          />
        </Pressable>
      </View>
    </Surface>
  );
}
