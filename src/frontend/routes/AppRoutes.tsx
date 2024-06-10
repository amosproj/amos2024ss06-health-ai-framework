import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Fallback } from '../screens';
import { AuthRoutes, type AuthStackParams } from './AuthRoutes';
import { type MainDrawerParams, MainRoutes } from './MainRoutes';

export type AppRoutesParamList = {
  Auth: NavigatorScreenParams<AuthStackParams>;
  Main: NavigatorScreenParams<MainDrawerParams>;
};

const AppRouteStack = createNativeStackNavigator<AppRoutesParamList>();

export function AppRoutes() {
  return (
    <NavigationContainer fallback={<Fallback />}>
      <AppRouteStack.Navigator initialRouteName='Auth' screenOptions={{ headerShown: false }}>
        <AppRouteStack.Screen name='Auth' component={AuthRoutes} />
        <AppRouteStack.Screen name='Main' component={MainRoutes} />
      </AppRouteStack.Navigator>
    </NavigationContainer>
  );
}
