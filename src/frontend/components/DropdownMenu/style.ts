import { StyleSheet } from 'react-native';

export const Style = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: '#FFFFFF', // Customize as needed
    elevation: 4, // Add shadow on Android
    shadowColor: '#000', // Add shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  dropdown: {
    margin: 4,
    height: 50,
    width: 100,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
  },
  iconButton: {
    marginLeft: 10,
  },
});
