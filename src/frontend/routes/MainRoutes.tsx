import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Header } from '../components';
import { Screens } from '../helpers';
import { ChatUI, DrawerMenu, CustomInstructions } from '../screens';

export type MainDrawerParams = {
  [Screens.Chat]: { chatId: string | null };
  [Screens.CustomInstructions]: undefined;
};

const MainRouteDrawer = createDrawerNavigator<MainDrawerParams>();

export function MainRoutes() {
  return (
    <MainRouteDrawer.Navigator drawerContent={(props) => <DrawerMenu />}>
      <MainRouteDrawer.Screen
        name={Screens.Chat}
        component={ChatUI}
        options={{ header: (props) => <Header {...props} /> }}
      />
      <MainRouteDrawer.Screen
        name={Screens.CustomInstructions}
        component={CustomInstructions}
        options={{ header: (props) => <Header {...props} /> }}
      />
    </MainRouteDrawer.Navigator>
  );
}
