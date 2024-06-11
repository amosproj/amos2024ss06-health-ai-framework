import React from 'react';
import { Text, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps
} from 'react-native-keyboard-aware-scroll-view';

export function ScreenLayout(props: KeyboardAwareScrollViewProps) {
  const { contentContainerStyle, children, ...rest } = props;
  return (
    <KeyboardAwareScrollView {...rest} contentContainerStyle={[contentContainerStyle, { flex: 1 }]}>
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 20 }}>{children}</View>
    </KeyboardAwareScrollView>
  );
}
