import * as React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Avatar, Drawer, IconButton, Searchbar, Text } from 'react-native-paper';
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
  const navigation = useNavigation();

  // remove keyboard once menu is closed
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
        <Searchbar
            placeholder="Search chat history"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchbar}
          />
        <Drawer.Section>
          <Drawer.Item label="MedicineBot" onPress={() => {}} style={styles.bot} />
          <Drawer.Item label="CarBot" onPress={() => {}} style={styles.bot} />
          <Drawer.Item label="ChessBot" onPress={() => {}} style={styles.bot} />
        </Drawer.Section>
        <Drawer.Section title="Recent Chats">
            <Drawer.Item
                label="How can I fix my diet?"
                onPress={() => {}}
                style={styles.paragraph}
            />
          <Drawer.Item label="Which car should I buy next?" onPress={() => {}} style={styles.paragraph} />
          <Drawer.Item label="What's insomnia?" onPress={() => {}} style={styles.paragraph} />
        </Drawer.Section>
      </DrawerContentScrollView>
        <View style={styles.footer}>
            <IconButton
                icon="account"
                size={30}
                onPress={() => { /* Profile Settings */ }}
            />
            <Text style={styles.title} variant="titleLarge">Dave1234</Text>
            <IconButton
                icon="logout"
                size={30}
                onPress={() => { /* Handle logout */ }}
            />
        </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    drawerContent: {
        paddingTop: 20,
    },
    searchbar: {
        marginBottom: 20,
        marginHorizontal: 10,
    },
    bot: {
        backgroundColor: 'lightgrey',
        marginBottom: 5,
        borderRadius: 30
    },
    paragraph: {
        color: 'black',
        marginVertical: 0,
        paddingVertical: 0,
    },
    drawerItemContent: {
        marginVertical: 0, // Override internal vertical margin
        paddingVertical: 0, // Override internal vertical padding
      },
    title: {
        marginLeft: 10,
        fontSize: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingBottom: 5,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1,
    },
});