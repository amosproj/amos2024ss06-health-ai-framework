import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Screens } from '../helpers';
import { Landing, Login } from '../screens';

export type AuthStackParams = {
  [Screens.Landing]: undefined;
  [Screens.LogIn]: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParams>();

export function AuthRoutes() {
  return (
    <AuthStack.Navigator initialRouteName={Screens.Landing} screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={Screens.Landing} component={Landing} />
      <AuthStack.Screen name={Screens.LogIn} component={Login} />
    </AuthStack.Navigator>
  );
}
