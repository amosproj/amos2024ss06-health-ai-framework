import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Header } from '../components';
import { Screens } from '../helpers';
import { Chat, DrawerMenu } from '../screens';

export type MainDrawerParams = {
  [Screens.Chat]: { chatId: string };
};

const MainRouteDrawer = createDrawerNavigator<MainDrawerParams>();

export function MainRoutes() {
  return (
    <MainRouteDrawer.Navigator drawerContent={(props) => <DrawerMenu />}>
      <MainRouteDrawer.Screen
        name={Screens.Chat}
        component={Chat}
        options={{ header: (props) => <Header {...props} /> }}
      />
    </MainRouteDrawer.Navigator>
  );
}
