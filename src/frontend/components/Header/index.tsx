import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions, type RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, Pressable, View } from 'react-native';
import { IconButton, Surface, Text, useTheme } from 'react-native-paper';
import { useActiveChatId, useGetChat, useLLMs } from 'src/frontend/hooks';
import { AilixirLogo } from 'src/frontend/icons';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import { DropdownMenu } from '../DropdownMenu';
import { Style } from './style';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import RNFetchBlob from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import * as Clipboard from 'expo-clipboard';
import { styles } from 'src/frontend/screens/ChatUI/style';


export function Header(props: DrawerHeaderProps) {
  const { colors } = useTheme();
  const { navigation } = props;
  
  const { activeChatId, setActiveChatId } = useActiveChatId();
  const { activeLLMs, toggleLLM } = useLLMs(activeChatId || 'default');
  const { chat, status, error } = useGetChat(activeChatId);

  // Saving to download and clipboard 
  const handleAction = async () => {
    try {
      if (!chat || !chat.conversation || chat.conversation.length === 0) {
        Alert.alert('No Chat Available', 'There is no chat content available.');
        return;
      }

      const createdAtDate = new Date(chat.createdAt.toDate());
      const formattedCreatedAt = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      }).format(createdAtDate);

      const metadata = `Title: ${chat.title}\nCreated: ${formattedCreatedAt}\nModels: ${chat.model.toString()}\n\n`;

      const formattedChatContent = chat.conversation.map((line, index) => {
        return index % 2 === 0 ? `Q: '${line}'` : `A: '${line}'\n`;
      }).join('\n');  

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `chat_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.txt`;

      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const contentToSave = metadata + formattedChatContent;

      // Copy to clipboard
      await Clipboard.setStringAsync(contentToSave);
      // Save to file
      await RNFS.writeFile(path, contentToSave, 'utf8');
      Alert.alert('Chat Saved', `Chat saved to Downloads folder as ${fileName} and also to clipboard.`);

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to perform action.');
    }
  };

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
        <Pressable 
        onPress={handleAction} 
        style={Style.actionButton}>
          <IconButton 
          icon='save' 
          size={24} 
          iconColor={colors.primary}/>
        </Pressable>
      </View>
    </Surface>
  );
}
