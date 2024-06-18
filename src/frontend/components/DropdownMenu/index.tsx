import * as FileSystem from 'expo-file-system';
import React, { useMemo, useState } from 'react';
import { Button, IconButton, Menu } from 'react-native-paper';

export const DropdownMenu = () => {
  const llmModels = useMemo(() => {
    return [
      { label: 'OpenAi', value: 'OpenAi' },
      { label: 'Gemini', value: 'Gemini' },
      { label: 'Mistral', value: 'Mistral' },
      { label: 'Claude', value: 'Claude' }
    ];
  }, []);
  const [isVisible, setIsVisible] = useState(false);

  const handleLLMModelChange = async (model: string) => {
    console.log(`Selected model: ${model}`);
  };

  return (
    <Menu
      visible={isVisible}
      onDismiss={() => setIsVisible(false)}
      anchorPosition='bottom'
      anchor={
        <Button mode='outlined' onPress={() => setIsVisible(true)} icon={'brain'}>
          TEST
        </Button>
      }
    >
      {llmModels.map((model) => {
        const { label, value } = model;
        return (
          <Menu.Item
            key={value}
            onPress={async () => {
              await handleLLMModelChange(value);
            }}
            title={label}
          />
        );
      })}
    </Menu>
  );
};
