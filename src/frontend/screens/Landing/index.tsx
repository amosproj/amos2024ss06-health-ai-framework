import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { LogInWithGoogle } from './LogInWithGoogle';
import { Style } from './style';

export function Landing() {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '50%'], []);

  return (
    <View style={Style.container}>
      <Text>{process.env.YOUTUBE_DATA_API_V3}</Text>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={0}>
        <BottomSheetView style={Style.sheetContainer}>
          <Text variant='titleLarge' style={Style.title}>
            Login To Continue
          </Text>
          <LogInWithGoogle />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
