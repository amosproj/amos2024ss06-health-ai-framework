import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Screens } from './helpers';
import { Fallback, Landing, Login } from './screens';

const NativeStack = createNativeStackNavigator();

export function AppNavigation() {
  return (
    <NavigationContainer fallback={<Fallback />}>
      <NativeStack.Navigator screenOptions={{ headerShown: false }}>
        <NativeStack.Screen name={Screens.Landing} component={Landing} />
        <NativeStack.Screen name={Screens.LogIn} component={Login} />
      </NativeStack.Navigator>
    </NavigationContainer>
  );
}
