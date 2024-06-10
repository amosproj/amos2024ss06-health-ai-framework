import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useUser } from 'reactfire';
import { Fallback } from '../screens';
import { AuthRoutes, type AuthStackParams } from './AuthRoutes';
import { type MainDrawerParams, MainRoutes } from './MainRoutes';

export type AppRoutesParams = {
  Auth: NavigatorScreenParams<AuthStackParams>;
  Main: NavigatorScreenParams<MainDrawerParams>;
};

const AppRouteStack = createNativeStackNavigator<AppRoutesParams>();

export function AppRoutes() {
  const { data: user, status } = useUser();
  if (status === 'loading') return <Fallback />;
  return (
    <NavigationContainer fallback={<Fallback />}>
      <AppRouteStack.Navigator
        initialRouteName={status === 'success' && user?.uid ? 'Main' : 'Auth'}
        screenOptions={{ headerShown: false }}
      >
        <AppRouteStack.Screen name='Auth' component={AuthRoutes} />
        <AppRouteStack.Screen name='Main' component={MainRoutes} />
      </AppRouteStack.Navigator>
    </NavigationContainer>
  );
}
