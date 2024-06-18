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
      // TODO: Save chat content to a file
      const chatContent = '';
      const fileUri = `${FileSystem.documentDirectory}chat.txt`;
      await FileSystem.writeAsStringAsync(fileUri, chatContent);
      Alert.alert('Chat saved', `Chat saved to ${fileUri}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error saving chat', 'An error occurred while saving the chat');
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
