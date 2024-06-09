import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Style } from './style';

export function Landing() {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '50%'], []);
  console.log(process.env.YOUTUBE_DATA_API_V3);

  return (
    <View style={Style.container}>
      <Text>{process.env.YOUTUBE_DATA_API_V3}</Text>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={0}>
        <BottomSheetView>
          <Text variant='titleLarge' style={Style.title}>
            Login To Continue
          </Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
