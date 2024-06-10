import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Screens } from 'src/frontend/helpers';
import { AilixirLogo } from 'src/frontend/icons';
import type { AppRoutesParams } from 'src/frontend/routes';
import { LogInWithGoogle } from './LogInWithGoogle';
import { Style } from './style';

export function Landing() {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

  return (
    <View style={Style.container}>
      <Text>{process.env.YOUTUBE_DATA_API_V3}</Text>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={0}>
        <BottomSheetView style={Style.sheetContainer}>
          <View style={Style.sheetHeader}>
            <AilixirLogo width={80} height={80} style={{ alignSelf: 'center' }} />
            <Text variant='titleLarge' style={Style.title}>
              AiLixir
            </Text>
          </View>
          <View style={Style.sheetContent}>
            <LogInWithGoogle />
            <Button
              mode='contained'
              onPress={() => navigate('Auth', { screen: Screens.SignUp })}
              contentStyle={{
                height: 48
              }}
              labelStyle={{ fontSize: 18 }}
            >
              Sign up with Email
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
