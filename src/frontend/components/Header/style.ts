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
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButton: {
    marginVertical: -4
  }
});
