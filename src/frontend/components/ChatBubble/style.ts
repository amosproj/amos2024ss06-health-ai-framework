import { StyleSheet } from 'react-native';

export const Style = StyleSheet.create({
  chevronButtonLeft: {
    padding: 0,
    margin: 0,
    marginLeft: 0
    //backgroundColor: 'red',
  },
  chevronButtonRight: {
    padding: 0,
    margin: 0,
    marginRight: 0
    //backgroundColor: 'red',
  },
  llmName: {
    textAlign: 'center',
    fontWeight: 'bold',
    minWidth: '20%',
    padding: 0
    //backgroundColor: 'blue',
  },
  llmSelector: {
    margin: 0,
    padding: 0,
    marginTop: -10,
    marginLeft: -10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'space-between'
    //backgroundColor: 'white',
  },
  messageContent: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    maxWidth: '100%'
  },
  textView: {
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '100%'
  },
  messageWrapper: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  sentMessage: {
    alignSelf: 'flex-end'
  },
  receivedMessage: {
    alignSelf: 'flex-start'
  },
  chatBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start'
  }
});
