import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { signOut } from 'firebase/auth';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';
import { useAuth } from 'reactfire';
import { Screens } from 'src/frontend/helpers';
import type { AppRoutesParams } from 'src/frontend/routes';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';

export function Chat() {
  const fireAuth = useAuth();
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  const router = useRoute<RouteProp<MainDrawerParams>>();

  const handleSignOut = async () => {
    try {
      GoogleSignin.configure({
        // Get the web client ID from the Expo configuration
        webClientId: Constants.expoConfig?.extra?.googleAuthClientId,
        // We want to force the code for the refresh token
        forceCodeForRefreshToken: true
      });
      await GoogleSignin.revokeAccess();
      await signOut(fireAuth);
      navigate('Auth', { screen: Screens.Landing });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>{router.params?.chatId}</Text>
    </View>
  );
}
