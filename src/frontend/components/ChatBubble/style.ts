import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const Style = StyleSheet.create({
    sentMessage: {
      alignSelf: 'flex-end'
    },
    receivedMessage: {
      alignSelf: 'flex-start'
    },
    speakButton: {
      alignSelf: 'flex-start',
      marginLeft: -10
    },
    message: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      maxWidth: '80%',
      alignSelf: 'flex-start'
    },
    llmName: {
      fontWeight: 'bold',
      marginBottom:5,
    }
});


