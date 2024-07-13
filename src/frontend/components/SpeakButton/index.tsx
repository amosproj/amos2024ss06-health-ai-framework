import { Style } from './style';
import { IconButton } from 'react-native-paper';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';

export function SpeakButton(props: { response: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <IconButton
      icon= {!isSpeaking ? 'volume-up' : 'volume-mute'}
      size={16}
      onPress={() => {
        if(isSpeaking) {
          setIsSpeaking(false);
          Speech.stop();
        } else {
          setIsSpeaking(true);
          Speech.speak(props.response ? props.response : '',
              { language: 'en-US', pitch: 1, rate: 1 });
        }
      }}
      style={Style.speakButton}
    />
  )
}
