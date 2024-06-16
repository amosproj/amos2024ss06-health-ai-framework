import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

// don't know how to do properly
export const Style = StyleSheet.create({
    drawerContainer: {
      paddingTop: 24,
      //backgroundColor: 'red',
      flex: 1,
    },
    searchbar: {
      marginHorizontal: 16,
    },
    footer: {
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      // align footer to bottom
    //   position: 'absolute',
    //   bottom: 0,
    //   left: 0,
    //   right: 0,
    },
  });
