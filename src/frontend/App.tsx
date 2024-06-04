import { useFonts } from 'expo-font';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { UpdateApp } from './components';
import { Fonts, LightTheme } from './helpers';

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
      <SafeAreaView style={{ flex: 1 }}>
        <PaperProvider theme={LightTheme}>
          <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
            <UpdateApp />
            <Toast />
          </View>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
