// src/frontend/screens/CustomInstructions.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PersonalInfoForm } from '../../components/PersonalInfoForm';
import { Style } from './style';

export function CustomInstructions() {
  return (
    <View style={Style.container}>
      <Text style={Style.title}>Custom Instructions</Text>
      <PersonalInfoForm />
    </View>
  );
}
