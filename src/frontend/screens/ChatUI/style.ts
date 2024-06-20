import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 16,
      paddingTop: 50,
    },
    chatContainer: {
      flex: 1,
      marginVertical: 20,
    },
    message: {
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      maxWidth: '80%',
      alignSelf: 'flex-start',
    },
    sentMessage: {
      alignSelf: 'flex-end',
    },
    receivedMessage: {
      alignSelf: 'flex-start',
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderTopWidth: 1
    },
    input: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 15,
    }
  });