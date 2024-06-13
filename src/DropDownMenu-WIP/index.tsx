import * as React from 'react';
import { View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { IconButton, Appbar, Text } from 'react-native-paper';

// custom components
import { CustomDrawerContent } from '@/components/CustomDrawerContent';
import CustomHeader from '@/components/CustomHeader';

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

npm install @react-navigation/native @react-navigation/drawer @react-navigation/stack
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-paper

*/

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

// const Stack = createStackNavigator();
// function HomeStack() {
//     return (
//         <Stack.Navigator
//             screenOptions={{
//             header: ({ navigation, scene, previous }) => (
//                 <CustomHeader navigation={navigation} previous={previous} />
//             ),
//             }}
//         >
//             <Stack.Screen name="Chat" component={ChatScreen} />
//             <Stack.Screen name="Profile" component={ProfileScreen} />
//             <Stack.Screen name="Login" component={LoginScreen} />
//         </Stack.Navigator>
//     );
// }

export default function Index() {

    //const navigation = useNavigation();
    return (
            // <Appbar.Header>
            //     <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}/>
            // </Appbar.Header>
            // <NavigationContainer>
            <Drawer.Navigator
                drawerContent={props => <CustomDrawerContent {...props} />}
                screenOptions={({ navigation }) => ({
                    header: ({navigation}) => (
                        <CustomHeader navigation={navigation}/>
                    ),
                    // headerLeft: () => (
                    //     <IconButton
                    //     icon="menu"
                    //     size={24}
                    //     onPress={() => navigation.toggleDrawer()}
                    //     />
                    // ),
                })}
            >
                <Drawer.Screen name="Chat" component={ChatScreen} />
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Login" component={LoginScreen} />
            </Drawer.Navigator>
            // </NavigationContainer>
    );
}


