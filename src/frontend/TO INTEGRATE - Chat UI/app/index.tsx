import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import ChatUI from '@/components/ChatUI';

const Drawer = createDrawerNavigator();


function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ChatUI />
    </SafeAreaView>
  );
}

export default function Index(){
  return (
    
    <Drawer.Navigator>
      <Drawer.Screen name="Chat" component={ChatScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
