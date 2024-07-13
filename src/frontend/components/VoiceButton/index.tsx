import Voice, {
  type SpeechResultsEvent,
  type SpeechStartEvent,
  type SpeechRecognizedEvent
} from '@react-native-voice/voice';
import React from 'react';
import { useEffect, useState } from 'react';
import { Vibration } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

/**
 * This file contains the VoiceButton component which is used to record voice messages.
 *
 * The user should be able to hold the button to record a voice message and release the button to stop recording.
 * The recorded message should be converted to text and displayed in the chat input field.
 */

type VoiceButtonProps = {
  text: string;
  setText: (text: string) => void;
  onPress: () => void;
  isSendButtonDisabled: boolean;
};

export function VoiceButton(props: VoiceButtonProps) {
  const { colors } = useTheme();
  const [started, setStarted] = useState('');
  const [recognized, setRecognized] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: SpeechStartEvent) => {
    setStarted('√');
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    setRecognized('√');
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    setResults(e.value ?? []);
    props.setText(e.value?.[0] ?? '');
  };

  const startRecognition = async () => {
    setIsRecording(true); // Set recording state to true
    Vibration.vibrate(50); // Vibrate for 50 milliseconds on press

    setRecognized('');
    setStarted('');
    setResults([]);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
      setIsRecording(false); // Reset recording state on error
    }
  };

  const stopRecognition = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
    Vibration.vibrate(50); // Vibrate for 50 milliseconds on release
    setIsRecording(false); // Reset recording state
  };

  if (props.text.trim()) {
    return (
      <IconButton
        icon='paper-plane'
        onPress={props.onPress}
        onPressOut={stopRecognition}
        iconColor={colors.onPrimary}
        containerColor={colors.primary}
        style={{ marginHorizontal: 5, paddingRight: 3 }}
        disabled={props.isSendButtonDisabled}
      />
    );
  }
  return (
    <IconButton
      icon='microphone'
      onPressIn={startRecognition}
      onPressOut={stopRecognition}
      iconColor={colors.onPrimary}
      containerColor={isRecording ? colors.inversePrimary : colors.primary}
      style={{ marginHorizontal: 5 }}
      disabled={props.isSendButtonDisabled}
    />
  );
}
