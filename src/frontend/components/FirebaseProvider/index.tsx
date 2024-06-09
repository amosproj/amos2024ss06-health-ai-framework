import { type FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { type ReactNode, useMemo } from 'react';
import { AuthProvider, FirebaseAppProvider, FirestoreProvider } from 'reactfire';

type FirebaseProviderProps = {
  children: ReactNode;
};

export function FirebaseProvider(props: FirebaseProviderProps) {
  const { children } = props;

  const firebaseConfig = useMemo<FirebaseOptions>(() => {
    return {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    };
  }, []);

  const fireApp = useMemo(() => initializeApp(firebaseConfig), [firebaseConfig]);
  const fireAuth = useMemo(() => getAuth(fireApp), [fireApp]);
  const fireStore = useMemo(() => getFirestore(fireApp), [fireApp]);

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} firebaseApp={fireApp}>
      <AuthProvider sdk={fireAuth}>
        <FirestoreProvider sdk={fireStore}>{children}</FirestoreProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}
