import * as React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, IconButton, Searchbar, Text, Button } from 'react-native-paper';
import { View, StyleSheet, Keyboard} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

/* setting up project
npx create-expo-app@latest my-app
cd my-app
npm install
npm reset-project
npx expo start
*/

/* needed to install before running this code

npm install react-native-paper
npm install react-native-vector-icons

npm install @react-navigation/native @react-navigation/drawer
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-paper
npm install react-native-safe-area-context

*/

export function CustomDrawerContent(props) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
                <Drawer.Section showDivider={false}>
                    <Searchbar
                        placeholder="Search chat history"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        style={styles.searchbar}
                    />
                    {/* custom padding because doesn't work with Drawer.Section props*/}
                    <View style={{height: 10}}/>
                </Drawer.Section>
                <Drawer.Section style={{marginTop: 10}}>
                    <Drawer.Item label="MedicineBot" onPress={() => {}} style={styles.agentSelectionItem} />
                    <Drawer.Item label="CarBot" onPress={() => {}} style={styles.agentSelectionItem} />
                    <Drawer.Item label="ChessBot" onPress={() => {}} style={styles.agentSelectionItem} />
                    {/* custom padding because doesn't work with Drawer.Section props*/}
                    <View style={{height: 10}}/>
                </Drawer.Section>
                <Drawer.Section title="Recent Chats" showDivider={false}>
                    <RecentChatButton label="How can I fix my diet?" onPress={() => { /* TODO: Open respective chat */ }}/>
                    <RecentChatButton label="Which car should I buy next?" onPress={() => { /* TODO: Open respective chat */ }}/>
                    <RecentChatButton label="What's insomnia?" onPress={() => { /* TODO: Open respective chat */}}/>
                </Drawer.Section>
            </DrawerContentScrollView>
            <DrawerFooter
                userName="Dave1234"
                onProfilePress={() => { /* TODO: Open Profile Settings */ }}
                onLogoutPress={() => { /* TODO: Handle logout */ }}
            />
        </SafeAreaView>
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
        <View style={styles.footer}>
            <IconButton
                icon="account"
                onPress={onProfilePress}
            />
            <Text variant="titleMedium">{userName}</Text>
            <IconButton
                icon="logout"
                onPress={onLogoutPress}
            />
        </View>
    );
}

// ---------- MARK: styles ----------

const styles = StyleSheet.create({
    drawerContent: {
        paddingTop: 20,
    },
    searchbar: {
        marginHorizontal: 16,
    },
    agentSelectionItem: {
        backgroundColor: '#FFE5FA',
        marginVertical: 3,
        borderRadius: 30
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        //position: 'absolute',
    },
});