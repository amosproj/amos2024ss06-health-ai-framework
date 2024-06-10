import { useFonts } from 'expo-font';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { FirebaseProvider, UpdateApp } from './components';
import { Fonts, LightTheme } from './helpers';
import { AppRoutes } from './routes';

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
            <FirebaseProvider>
              <AppRoutes />
              <Toast />
              <UpdateApp />
            </FirebaseProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
