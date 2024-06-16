import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Screens } from '../helpers';
import { Chat, DrawerMenu } from '../screens';

export type MainDrawerParams = {
  [Screens.Chat]: undefined;
};

const MainRouteDrawer = createDrawerNavigator<MainDrawerParams>();

export function MainRoutes() {
  return (
    <MainRouteDrawer.Navigator drawerContent={(props) => <DrawerMenu/>}>
      <MainRouteDrawer.Screen key={'123'} name={Screens.Chat} component={Chat} />
    </MainRouteDrawer.Navigator>
  );
}
