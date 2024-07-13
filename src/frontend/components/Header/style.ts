import { StyleSheet } from 'react-native';

export const Style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    minHeight: 64,
    backgroundColor: '#fff'
  },
  drawer: {
    marginRight: 12
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttons: {
    flexDirection: 'row'
  }
});
