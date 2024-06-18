
/*
import * as React from 'react';
import { Text} from "react-native-paper";
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { IconButton } from 'react-native-paper';
import { CustomDrawerContent } from '@/components/CustomDrawerContent';

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



const Drawer = createDrawerNavigator();

function ChatScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chat Screen</Text>
    </View>
  );
}

function LoginScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Login Screen</Text>
        </View>
    );
}

function ProfileScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Profile Screen</Text>
        </View>
    );
}

export default function Index() {
  return (
        // <NavigationContainer>
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
            headerLeft: () => (
                <IconButton
                icon="menu"
                size={24}
                onPress={() => navigation.toggleDrawer()}
                />
            ),
            })}
        >
            <Drawer.Screen name="Chat" component={ChatScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Login" component={LoginScreen} />
        </Drawer.Navigator>
        // </NavigationContainer>
  );
}


*/