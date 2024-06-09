import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { type FirebaseOptions, initializeApp } from 'firebase/app';
import { initializeAuth as getAuth, getReactNativePersistence as store } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { type ReactNode, useMemo } from 'react';
import { AuthProvider, FirebaseAppProvider, FirestoreProvider } from 'reactfire';

type FirebaseProviderProps = {
  children: ReactNode;
};

export function FirebaseProvider(props: FirebaseProviderProps) {
  const { children } = props;

  const firebaseConfig = useMemo<FirebaseOptions>(() => Constants.expoConfig?.extra?.firebase, []);
  const fireApp = useMemo(() => initializeApp(firebaseConfig), [firebaseConfig]);
  const fireAuth = useMemo(() => getAuth(fireApp, { persistence: store(AsyncStorage) }), [fireApp]);
  const fireStore = useMemo(() => getFirestore(fireApp), [fireApp]);

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} firebaseApp={fireApp}>
      <AuthProvider sdk={fireAuth}>
        <FirestoreProvider sdk={fireStore}>{children}</FirestoreProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}
