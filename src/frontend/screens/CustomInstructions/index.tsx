// src/frontend/screens/CustomInstructions.tsx
import React from 'react';
import { View, Text, StyleSheet  } from 'react-native';
import  PersonalInfoForm  from '../../components/PersonalInfoForm';

export function CustomInstructions() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Custom Instructions</Text>
        <PersonalInfoForm />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
  });