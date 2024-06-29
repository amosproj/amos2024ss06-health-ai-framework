import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions, type RouteProp, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import React from 'react';
import { Alert, Pressable, View } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import { useGetChat } from 'src/frontend/hooks';
import { AilixirLogo } from 'src/frontend/icons';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import { DropdownMenu } from '../DropdownMenu';
import { Style } from './style';

export function Header(props: DrawerHeaderProps) {
  const { navigation } = props;
  const router = useRoute<RouteProp<MainDrawerParams>>();
  const chatId = router.params?.chatId;
  const { chat } = useGetChat(chatId || 'default');

  const handleDownload = async () => {
    try {
      if (!chat || !chat.conversation || chat.conversation.length === 0) {
        Alert.alert('No Chat Available', 'There is no chat content available to download.');
        return;
      }

      const chatContent = chat.conversation.join('\n'); // Join messages with newline character

      // Create filename with timestamp
      const timestamp = new Date().getTime();
      const fileName = `chat_${timestamp}.txt`;

      // Get Downloads directory path
      const downloadDir = `${FileSystem.documentDirectory}Download/`;
      console.log(downloadDir);

      // Ensure Downloads directory exists, create if not
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });

      // Save file to Downloads directory
      const fileUri = `${downloadDir}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, chatContent);

      Alert.alert('Chat Saved', `Chat saved to ${fileUri}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error Saving Chat', 'An error occurred while saving the chat.');
    }
  };

  return (
    <Surface style={Style.container} elevation={1}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginRight: 16 }}
        >
          <AilixirLogo height={36} width={36} />
        </Pressable>
        <Text variant='titleLarge'>AiLixir</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <DropdownMenu />
        <Pressable onPress={handleDownload}>
          <IconButton icon='file-download' size={20} />
        </Pressable>
      </View>
    </Surface>
  );
}
