import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { IconButton } from 'react-native-paper';
import { Style } from './style';

const data = [
  { label: 'OpenAi', value: 'OpenAi' },
  { label: 'Gemini', value: 'Gemini' },
  { label: 'Mistral', value: 'Mistral' },
  { label: 'Claude', value: 'Claude' }
];

const DropdownMenu = () => {
  const [selectedValue, setSelectedValue] = useState(data[0].label);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleModelChange = (option: any) => {
    setSelectedValue(option.label);
    // Alert.alert('Model Changed', `Selected Model: ${option.label}`);
  };

  const handleSave = async () => {
    try {
      const chatContent = 'Your chat content here'; // Replace with actual chat content
      const fileUri = `${FileSystem.documentDirectory}chat.txt`;
      await FileSystem.writeAsStringAsync(fileUri, chatContent);
      Alert.alert('Chat Saved', `Chat saved to ${fileUri}`);
    } catch (error) {
      console.error('Error saving chat:', error);
      Alert.alert('Error', 'Failed to save chat.');
    }
  };

  return (
    <View style={Style.headerContainer}>
      <Dropdown
        style={Style.dropdown}
        placeholder={'Select an option'}
        selectedTextStyle={Style.selectedTextStyle}
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
