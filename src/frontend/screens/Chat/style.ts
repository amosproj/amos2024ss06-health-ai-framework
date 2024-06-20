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
      backgroundColor: '#E6E6FA', // TODO Light gray with a lilac tint
      alignSelf: 'flex-end',
    },
    receivedMessage: {
      backgroundColor: '#F5F5F5', // TODO Light gray
      alignSelf: 'flex-start',
    },
    messageText: {
      color: '#333',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderTopWidth: 1,
      borderColor: '#ddd',
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 15,
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: '#9370DB', // TODO More lilac
      borderRadius: 20,
      padding: 10,
    },
  });