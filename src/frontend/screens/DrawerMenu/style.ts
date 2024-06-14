import { StyleSheet } from 'react-native';

export const Style = StyleSheet.create({
    drawerContainer: {
      paddingVertical: 16,
      //backgroundColor: 'red',
      flex: 1,
    },
    searchbar: {
      marginHorizontal: 16,
    },
    footer: {
      //backgroundColor: 'blue',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      // align footer to bottom
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  });