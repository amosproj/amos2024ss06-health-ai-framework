import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Fallback } from '../screens';
import { AuthRoutes } from './AuthRoutes';
import { MainRoutes } from './MainRoutes';

const AppRouteStack = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <NavigationContainer fallback={<Fallback />}>
      <AppRouteStack.Navigator initialRouteName='AuthRoute' screenOptions={{ headerShown: false }}>
        <AppRouteStack.Screen name='AuthRoute' component={AuthRoutes} />
        <AppRouteStack.Screen name='MainRoutes' component={MainRoutes} />
      </AppRouteStack.Navigator>
    </NavigationContainer>
  );
}
