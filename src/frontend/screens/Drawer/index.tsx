import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Divider,
  IconButton,
  Text,
  TextInput
} from 'react-native-paper';
import { useAuth, useUser } from 'reactfire';
import { ChatItem } from 'src/frontend/components';
import { useGetAllChat } from 'src/frontend/hooks';
import type { AppRoutesParams } from 'src/frontend/routes';
import type { Chat } from 'src/frontend/types';

export function Drawer() {
  const fireAuth = useAuth();
  const { data: user } = useUser();
  const { reset } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  const { chats, status } = useGetAllChat();
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [searchText, setSearchText] = React.useState('');

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats?.length]);

  useEffect(() => {
    if (searchText) {
      setFilteredChats(
        chats?.filter((chat) => chat.title.toLowerCase().includes(searchText.toLowerCase()))
      );
    } else {
      setFilteredChats(chats);
    }
  }, [searchText, chats?.length]);

  const handleSignOut = async () => {
    try {
      await signOut(fireAuth);
      await GoogleSignin.revokeAccess();
      reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        label='Search...'
        style={{ margin: 16 }}
        mode='outlined'
        onChangeText={(text) => setSearchText(text)}
      />
      <Divider />
      <ScrollView style={{ flex: 1, paddingVertical: 16 }}>
        <Text
          variant='labelLarge'
          style={{ fontWeight: '700', paddingBottom: 8, paddingHorizontal: 16 }}
        >
          CHAT HISTORY
        </Text>
        {status === 'loading' && <ActivityIndicator />}
        {status === 'success' &&
          filteredChats?.map((chat) => (
            <ChatItem key={chat.id} id={chat.id || ''} title={chat.title} />
          ))}
      </ScrollView>
      <Divider />
      <View
        style={{
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Avatar.Text size={40} label={user?.displayName?.substring(0, 2) || 'AX'} />
        <Text variant='titleMedium' style={{ flex: 1, marginHorizontal: 8 }}>
          {user?.displayName || 'User'}
        </Text>
        <IconButton icon='angle-right' onPress={handleSignOut} />
      </View>
    </View>
  );
}
