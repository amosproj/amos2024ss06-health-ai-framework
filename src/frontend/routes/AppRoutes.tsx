import dynamicLinks, { type FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import {
  NavigationContainer,
  type NavigationContainerRef,
  type NavigatorScreenParams
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { useUser } from 'reactfire';
import { Screens } from '../helpers';
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
  const navigationContainerRef = useRef<NavigationContainerRef<AppRoutesParams> | null>(null);

  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    const url = link.url;
    const params = new URL(url).searchParams;
    const mode = params.get('mode');
    const oobCode = params.get('oobCode') || '';
    if (mode === 'resetPassword') {
      navigationContainerRef.current?.navigate('Auth', {
        screen: Screens.ResetPassword,
        params: { oobCode: oobCode }
      });
    }
  };

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) handleDynamicLink(link);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  if (status === 'loading') return <Fallback />;
  return (
    <NavigationContainer fallback={<Fallback />} ref={navigationContainerRef}>
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
