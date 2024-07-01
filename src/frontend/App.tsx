import { useFonts } from 'expo-font';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { ActiveChatProvider, FirebaseProvider, UpdateApp } from './components';
import { Fonts, LightTheme } from './helpers';
import { AppRoutes } from './routes';

LogBox.ignoreLogs([
  'Require cycle:',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.'
]);

export function App() {
  // load fonts and other assets here
  const [isFontLoaded] = useFonts({
    [Fonts.LIGHT]: require('assets/fonts/OpenSans-Light.ttf'),
    [Fonts.REGULAR]: require('assets/fonts/OpenSans-Regular.ttf'),
    [Fonts.MEDIUM]: require('assets/fonts/OpenSans-Medium.ttf'),
    [Fonts.SEMI_BOLD]: require('assets/fonts/OpenSans-SemiBold.ttf'),
    [Fonts.BOLD]: require('assets/fonts/OpenSans-Bold.ttf'),
    [Fonts.EXTRA_BOLD]: require('assets/fonts/OpenSans-ExtraBold.ttf')
  });

  // hide splash screen after fonts are loaded
  useEffect(() => {
    async function prepare() {
      await preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isFontLoaded) await hideAsync();
  }, [isFontLoaded]);

  if (!isFontLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <GestureHandlerRootView>
          <PaperProvider
            theme={LightTheme}
            settings={{ icon: (props) => <AwesomeIcon {...props} /> }}
          >
            <ActiveChatProvider>
              <FirebaseProvider>
                <AppRoutes />
                <Toast />
                <UpdateApp />
              </FirebaseProvider>
            </ActiveChatProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
