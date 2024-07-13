import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Drawer, IconButton, Searchbar, Text } from 'react-native-paper';
import { Style } from './style';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { useTheme } from 'react-native-paper';
import { useAuth, useUser } from 'reactfire';
import { ChatItem } from 'src/frontend/components';
import { Screens } from 'src/frontend/helpers';
import { LLM_MODELS, useActiveChatId, useCreateChat, useGetAllChat } from 'src/frontend/hooks';
import type { AppRoutesParams } from 'src/frontend/routes';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import type { Chat } from 'src/frontend/types';

/**
 * This file renders the DrawerMenu which can be opened from the ChatUI screen.
 *
 * User can switch between chats, delete chats and create new chats
 */

/**
 * NOTE: needs to be called DrawerMenu because Drawer is already defined in react-native-paper
 */
export function DrawerMenu() {
  const fireAuth = useAuth();
  const { data: user } = useUser();
  const { chats, status, error } = useGetAllChat();
  const { reset } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  const { colors } = useTheme();
  const navigationC = useNavigation<DrawerNavigationProp<MainDrawerParams>>();

  // ------------ Define navigation functions ------------
  const goToProfile = () => {
    //navigation.navigate('Profile');

    navigate('Main', { screen: Screens.CustomInstructions });
  };

  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  const { setActiveChatId } = useActiveChatId();
  const createNewChat = () => {
    setActiveChatId('default');
    navigate('Main', { screen: Screens.Chat, params: { chatId: 'default' } }); // only used to close drawer
  };

  const handleLogout = async () => {
    //TODO: fix errors
    try {
      await signOut(fireAuth);
      await GoogleSignin.revokeAccess();
      reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (error) {
      console.error(error);
    }
  };

  // ------------ End navigation functions ------------

  // ------------ Filter chats based on search query ------------
  const [searchText, setSearchQuery] = React.useState('');
  const [filteredChats, setFilteredChats] = React.useState<Chat[]>([]);
  const [sortedChats, setSortedChats] = React.useState<Chat[]>([]);

  React.useEffect(() => {
    setFilteredChats(chats);
  }, [chats?.length]);

  React.useEffect(() => {
    if (searchText) {
      setFilteredChats(
        chats?.filter((chat) => chat.title.toLowerCase().includes(searchText.toLowerCase()))
      );
    } else {
      setFilteredChats(chats);
    }
  }, [searchText, chats?.length]);

  // Sort filteredChats by date
  React.useEffect(() => {
    if (filteredChats) {
      const sortedChats = [...filteredChats].sort((a, b) => {
        const dateA = a.createdAt;
        const dateB = b.createdAt;
        return dateB.toMillis() - dateA.toMillis();
      });
      setSortedChats(sortedChats);
    }
  }, [filteredChats]);
  // ------------ End filter chats ------------

  // ------------ Remove keyboard once menu is closed ------------
  const navigation = useNavigation();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      if (!navigation?.getState()?.index) {
        Keyboard.dismiss();
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);
  // ------------ End remove keyboard ------------

  return (
    <View style={Style.drawerContainer}>
      <Drawer.Section showDivider={false}>
        <Button
          icon='pencil-alt'
          mode='outlined'
          onPress={createNewChat}
          textColor='black'
          contentStyle={{
            justifyContent: 'flex-start'
          }}
          style={[Style.searchbar, { marginBottom: 16, borderColor: 'black', borderWidth: 1 }]}
          labelStyle={{ fontSize: 16, paddingLeft: 8 }}
        >
          Create New Chat
        </Button>
        <Searchbar
          placeholder='Search chat history'
          onChangeText={setSearchQuery}
          value={searchText}
          style={[Style.searchbar, { backgroundColor: colors.secondaryContainer }]}
        />
        {/* custom padding because doesn't work with Drawer.Section props*/}
        <View style={{ height: 10 }} />
      </Drawer.Section>
      <Drawer.Section title='Recent Chats' showDivider={false} style={{ flex: 1 }}>
        <ScrollView style={{ flexGrow: 1 }}>
          {status === 'loading' && <ActivityIndicator />}
          {status === 'success' &&
            sortedChats?.map((chat) => (
              <ChatItem key={chat.id} id={chat.id || ''} title={chat.title} />
            ))}
        </ScrollView>
      </Drawer.Section>
      <DrawerFooter
        userName={user?.displayName || 'User'}
        onProfilePress={() => {
          goToProfile();
        }}
        onLogoutPress={() => {
          handleLogout();
        }}
      />
    </View>
  );
}

// ---------- MARK: Footer ----------
interface DrawerFooterProps {
  userName: string;
  onProfilePress: () => void;
  onLogoutPress: () => void;
}

const DrawerFooter: React.FC<DrawerFooterProps> = ({ userName, onProfilePress, onLogoutPress }) => {
  return (
    <View style={[Style.footer]}>
      <IconButton icon='user-alt' onPress={onProfilePress} />
      <Text variant='titleMedium' style={{ marginHorizontal: 8 }}>
        {userName}
      </Text>
      <IconButton icon='sign-out-alt' onPress={onLogoutPress} />
    </View>
  );
};
