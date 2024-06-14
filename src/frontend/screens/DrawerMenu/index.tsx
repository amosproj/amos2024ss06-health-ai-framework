import React from 'react';
import { View, Keyboard} from 'react-native';
import { Drawer, IconButton, Searchbar, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Style } from './style';

export function DrawerMenu() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: string) => setSearchQuery(query);

    // remove keyboard once menu is closed
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

    // define navigation functions
    const goToProfile = () => {
        //navigation.navigate('Profile');
        console.log("goToProfile");
    }
    const handleLogout = () => {
        //TODO: additional stuff
        //navigation.navigate('Login');
        console.log("handleLogout");
    }
    const goToChat = () => {
        //TODO: load correct chat
        //navigation.navigate('Chat');
        console.log("gotToChat");
    }

  return (
    <View style={Style.drawerContainer}>
      <Drawer.Section showDivider={false}>
        <Searchbar
          placeholder="Search chat history"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={Style.searchbar}
        />
        {/* custom padding because doesn't work with Drawer.Section props*/}
        <View style={{height: 10}}/>
      </Drawer.Section>
      <Drawer.Section title="Recent Chats" showDivider={false}>
        <RecentChatButton label="How can I fix my diet?" onPress={ goToChat }/>
        <RecentChatButton label="Which car should I buy next?" onPress={ goToChat }/>
        <RecentChatButton label="What's insomnia?" onPress={ goToChat }/>
      </Drawer.Section>
      <DrawerFooter
        userName="Dave1234"
        onProfilePress={() => { goToProfile() }}
        onLogoutPress={() => { handleLogout() }}
      />
    </View>
  );
}

// ---------- Custom Bold Text Button using React Native Paper ----------
interface RecentChatButtonProps {
    label: string;
    onPress: () => void;
}

const RecentChatButton: React.FC<RecentChatButtonProps> = ({label, onPress, }) => {
    return (
        <Button
            textColor='black'
            onPress = {onPress}
            style={{}}
            contentStyle={{justifyContent: 'flex-start', paddingLeft: 16}}
            labelStyle={{fontWeight: 'bold'}}
        >
            {label}
        </Button>
    );
}

// ---------- MARK: Footer ----------
interface DrawerFooterProps {
    userName: string;
    onProfilePress: () => void;
    onLogoutPress: () => void;
}

//TODO: fix that the footer doesn't get moved upwards when keyboard is opened
const DrawerFooter: React.FC<DrawerFooterProps> = ({userName, onProfilePress, onLogoutPress}) => {
    return (
        <View style={Style.footer}>
            <IconButton
              icon="user-alt"
              onPress={onProfilePress}
            />
            <Text variant="titleMedium">{userName}</Text>
            <IconButton
              icon="sign-out-alt"
              onPress={onLogoutPress}
            />
        </View>
    );
}
