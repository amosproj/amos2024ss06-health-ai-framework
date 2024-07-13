// src/frontend/screens/CustomInstructions.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PersonalInfoForm } from '../../components/PersonalInfoForm';
import { Style } from './style';

/**
 * This file renders the Custom Instructions screen.
 *
 * This screen allows the user to input their name, style instructions, and personalized instructions
 * to be sent to the LLM as additional information for a customised experience for the user.
 */

export function CustomInstructions() {
  return (
    <View style={Style.container}>
      <Text style={Style.title}>Custom Instructions</Text>
      <PersonalInfoForm />
    </View>
  );
}
