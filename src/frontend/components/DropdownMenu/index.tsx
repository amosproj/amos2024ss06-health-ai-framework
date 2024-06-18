import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import { IconButton } from 'react-native-paper';


const data = [
  { label: 'OpenAi', value: 'OpenAi' },
  { label: 'Gemini', value: 'Gemini' },
  { label: 'Mistral', value: 'Mistral' },
  { label: 'Claude', value: 'Claude' },
];

const DropdownMenu = () => {
  const [selectedValue, setSelectedValue] = useState(data[0].label);

  const handleModelChange = (option) => {
    setSelectedValue(option.label);
    // Alert.alert('Model Changed', `Selected Model: ${option.label}`);
  };

  const handleSave = async () => {
    try {
      const chatContent = "Your chat content here"; // Replace with actual chat content
      const fileUri = FileSystem.documentDirectory + 'chat.txt';
      await FileSystem.writeAsStringAsync(fileUri, chatContent);
      Alert.alert('Chat Saved', `Chat saved to ${fileUri}`);
    } catch (error) {
      console.error('Error saving chat:', error);
      Alert.alert('Error', 'Failed to save chat.');
    }
  };

  return (
      <View style={styles.headerContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholder={'Select an option'}
          selectedTextStyle={styles.selectedTextStyle}
          data={data}
          onChange={handleModelChange}
          value={selectedValue}
          labelField={'label'}
          valueField={'value'}
        />
        <IconButton icon='download' onPress={handleSave} />
      </View>
  );
};

const styles = StyleSheet.create({
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

export default DropdownMenu;