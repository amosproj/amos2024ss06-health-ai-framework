import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from 'reactfire';
import { Screens } from 'src/frontend/helpers';
import type { AppRoutesParams } from 'src/frontend/routes';

export function Chat() {
  const fireAuth = useAuth();
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

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
      <Button onPress={handleSignOut}>Sign Out</Button>
    </View>
  );
}
