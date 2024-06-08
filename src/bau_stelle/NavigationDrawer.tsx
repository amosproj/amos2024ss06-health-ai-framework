import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text } from "react-native-reanimated/lib/typescript/Animated";

const Drawer = createDrawerNavigator();

const NavigationDrawer = () => {
    return (
        <Drawer.Navigator
            initialRouteName='TODO: someScreen'
            drawerContent={() => (
            <DrawerContentScrollView>
                <Text>Some Text</Text>
                <DrawerItem
                    label={'DrawerItem'}
                    onPress={() => {
                        //TODO: do some stuff
                        //eg. navigate to some other screen
                    }}
                />

            </DrawerContentScrollView>
            )}
        >
        {/*TODO: add all screens where the drawer should be accessible*/}
            <Drawer.Screen name='someScreen' component={someComponent}/>

        </Drawer.Navigator>
    );
}