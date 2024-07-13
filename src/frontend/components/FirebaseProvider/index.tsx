import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { initializeAuth as getAuth, getReactNativePersistence as store } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { type ReactNode, useEffect, useMemo } from 'react';
import { AuthProvider, FirebaseAppProvider, FirestoreProvider, FunctionsProvider } from 'reactfire';

/**
 * This file provides global variables for using firebase hooks
 */


type FirebaseProviderProps = {
  children: ReactNode;
};

export function FirebaseProvider(props: FirebaseProviderProps) {
  const { children } = props;

  const fireApp = useMemo(() => initializeApp(Constants.expoConfig?.extra?.firebase), []);
  const fireAuth = useMemo(() => getAuth(fireApp, { persistence: store(AsyncStorage) }), [fireApp]);
  const fireStore = useMemo(() => getFirestore(fireApp, 'ailixir-users'), [fireApp]);
  const fireFunction = useMemo(() => getFunctions(fireApp), [fireApp]);

  return (
    <FirebaseAppProvider
      firebaseConfig={Constants.expoConfig?.extra?.firebase}
      firebaseApp={fireApp}
    >
      <AuthProvider sdk={fireAuth}>
        <FirestoreProvider sdk={fireStore}>
          <FunctionsProvider sdk={fireFunction}>{children}</FunctionsProvider>
        </FirestoreProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}
