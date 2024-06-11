import { StyleSheet } from 'react-native';

export const Style = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    textAlign: 'center',
    marginVertical: 16
  },
  sheetContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'stretch',
    padding: 24
  },
  sheetHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sheetContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  }
});
