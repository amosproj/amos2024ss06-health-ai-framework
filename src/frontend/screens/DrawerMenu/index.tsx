import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Drawer, IconButton, Searchbar, Text } from 'react-native-paper';
import { Style } from './style';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';
import { useTheme } from 'react-native-paper';
import { useAuth, useUser } from 'reactfire';
import { ChatItem } from 'src/frontend/components';
import { useGetAllChat } from 'src/frontend/hooks';
import type { AppRoutesParams } from 'src/frontend/routes';
import type { Chat } from 'src/frontend/types';

/**
 * NOTE: needs to be called DrawerMenu because Drawer is already defined in react-native-paper
 */
export function DrawerMenu() {
  const fireAuth = useAuth();
  const { data: user } = useUser();
  const { chats, status, error } = useGetAllChat();
  const { reset } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  const { colors } = useTheme();

  // ------------ Define navigation functions ------------
  const goToProfile = () => {
    //navigation.navigate('Profile');
    console.log('TODO: implement Profile Screen');
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
        return dateA.toMillis() - dateB.toMillis();
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

//TODO: fix that the footer doesn't get moved upwards when keyboard is opened
const DrawerFooter: React.FC<DrawerFooterProps> = ({ userName, onProfilePress, onLogoutPress }) => {
  const { colors } = useTheme();
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
