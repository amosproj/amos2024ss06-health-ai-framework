import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import PersonalInfoForm from '@/components/CustomInstructions';

const Drawer = createDrawerNavigator();

export default function Index() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='Instructions' component={PersonalInfoForm} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
