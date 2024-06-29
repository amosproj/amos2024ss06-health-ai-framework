import PersonalInfoForm from '@/components/CustomInstructions';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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
