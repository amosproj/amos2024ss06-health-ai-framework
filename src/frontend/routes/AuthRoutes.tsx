import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Screens } from '../helpers';
import { ForgotPassword, Landing, Login, ResetPassword, SignUp } from '../screens';

export type AuthStackParams = {
  [Screens.Landing]: undefined;
  [Screens.LogIn]: undefined;
  [Screens.SignUp]: undefined;
  [Screens.ForgotPassword]: undefined;
  [Screens.ResetPassword]: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParams>();

export function AuthRoutes() {
  return (
    <AuthStack.Navigator initialRouteName={Screens.Landing} screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={Screens.Landing} component={Landing} />
      <AuthStack.Screen name={Screens.LogIn} component={Login} />
      <AuthStack.Screen name={Screens.SignUp} component={SignUp} />
      <AuthStack.Screen name={Screens.ForgotPassword} component={ForgotPassword} />
      <AuthStack.Screen name={Screens.ResetPassword} component={ResetPassword} />
    </AuthStack.Navigator>
  );
}
