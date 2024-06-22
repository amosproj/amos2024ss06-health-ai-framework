import { type RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, Menu, Checkbox, List } from 'react-native-paper';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import { useLLMs } from 'src/frontend/hooks/useLLMs';

export const DropdownMenu = () => {
  const router = useRoute<RouteProp<MainDrawerParams>>();
  const chatId = router.params?.chatId;
  const [isVisible, setIsVisible] = useState(false);
  const { activeLLMs, toggleLLM, status } = useLLMs(chatId || 'default');

  const activeLLMsCount = Object.values(activeLLMs).filter(llm => llm.active).length;
  const activeLLMsNames = Object.values(activeLLMs).filter(llm => llm.active).map(llm => llm.name);
  const buttonLabel = activeLLMsCount === 1 ? activeLLMsNames[0] : `${activeLLMsCount} LLMs Selected`;

  return (
    <Menu
      visible={isVisible}
      onDismiss={() => setIsVisible(false)}
      anchorPosition='bottom'
      anchor={
        <Button
          mode='outlined'
          onPress={() => setIsVisible(true)}
          icon={'brain'}
          loading={status === 'loading'}
        >
          {buttonLabel}
        </Button>
      }
    >
      <List.Section>
        {Object.entries(activeLLMs).map(([key, llm]) => (
          <Menu.Item
            key={key}
            title={
              <List.Item
                title={llm.name}
                right={() => (
                  <Checkbox
                    status={llm.active ? 'checked' : 'unchecked'}
                    onPress={() => toggleLLM(key)}
                  />
                )}
              />
            }
          />
        ))}
      </List.Section>
    </Menu>
  );
};