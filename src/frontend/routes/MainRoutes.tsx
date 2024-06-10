import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Screens } from '../helpers';
import { Chat } from '../screens';

const MainRouteDrawer = createDrawerNavigator();

export function MainRoutes() {
  return (
    <MainRouteDrawer.Navigator>
      <MainRouteDrawer.Screen key={'123'} name={Screens.Chat} component={Chat} />
    </MainRouteDrawer.Navigator>
  );
}
