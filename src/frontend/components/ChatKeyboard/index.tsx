import { useEffect, useRef } from 'react';
import { type ScrollView, TextInput } from 'react-native';
import { Keyboard } from 'react-native';
import { useTheme } from 'react-native-paper';
import { styles } from './style';

/**
 * This file renders the chat keyboard in the chat UI below the chat
 *
 * The Keyboard disappears when we click somewhere else on the screen
 * or when we close the component where the keyboard was used.
 */

type ChatKeyboardProps = {
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
};

export function ChatKeyboard(props: ChatKeyboardProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const { colors } = useTheme();
  return (
    <TextInput
      style={[styles.input, { borderColor: colors.outlineVariant }]}
      placeholder='Write something here...'
      value={props.text}
      onChangeText={(text) => props.setText(text)}
      onSubmitEditing={() => props.onSend()}
      blurOnSubmit={false}
    />
  );
}
