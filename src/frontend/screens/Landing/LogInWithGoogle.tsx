import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React from 'react';
import { Button, Text } from 'react-native-paper';
import { useAuth } from 'reactfire';
import type { AppRoutesParams } from 'src/frontend/routes';

export function LogInWithGoogle() {
  const fireAuth = useAuth();
  const { reset } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

  const handleLogInWithGoogle = async () => {
    try {
      // Configure Google Signin
      GoogleSignin.configure({
        // Get the web client ID from the Expo configuration
        webClientId: Constants.expoConfig?.extra?.googleAuthClientId,
        // We want to force the code for the refresh token
        forceCodeForRefreshToken: true
      });
      // Sign in with Google
      // This will prompt the user to choose a Google account to sign in with
      const { idToken } = await GoogleSignin.signIn();
      // Create a credential object using the ID token
      // This credential object will be used to authenticate with Firebase
      const googleCredential = GoogleAuthProvider.credential(idToken);
      // Sign in with the credential object using Firebase
      // This will create a Firebase user if it doesn't exist, or sign in the existing user
      const { user: fireUser } = await signInWithCredential(fireAuth, googleCredential);
      reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onPress={handleLogInWithGoogle}
      mode='contained'
      contentStyle={{
        height: 48
      }}
      labelStyle={{ fontSize: 18 }}
    >
      Sign in with Google
    </Button>
  );
}
