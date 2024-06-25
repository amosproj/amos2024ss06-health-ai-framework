import { type RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, Menu, Checkbox, List } from 'react-native-paper';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import { useLLMs } from 'src/frontend/hooks/useLLMs';
import { View } from 'react-native';
import { Style } from './style';
import { useActiveChatId, useGetAllChat, useGetChat} from 'src/frontend/hooks';
import type { Chat } from 'src/frontend/types';
import type { ChatItemProps } from 'src/frontend/components/ChatItem'


export const DropdownMenu = () => {
  // get chatID after opening app copilot help
  const route = useRoute<RouteProp<MainDrawerParams>>();
  const chatId = route.params?.chatId;
  const [isVisible, setIsVisible] = useState(false);
  const { activeLLMs, toggleLLM } = useLLMs(chatId || 'default');

  const { activeChatId, setActiveChatId } = useActiveChatId();
  const { chat, status, error } = useGetChat(activeChatId);

  const activeLLMsCount = Object.values(activeLLMs).filter(llm => llm.active).length;
  const activeLLMsNames = Object.values(activeLLMs).filter(llm => llm.active).map(llm => llm.name);
  let buttonLabel = activeLLMsCount === 1 ? activeLLMsNames[0] : `${activeLLMsCount} LLMs`;

  // If no chatId is selected, set button label to "SELECT"
  if (chat === undefined) {
    buttonLabel = "";
  }

  // Determine if the button should be disabled
  const isButtonDisabled = chat === undefined || activeLLMsCount === 0;

  return (
      
      <Menu
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setIsVisible(true)}
            icon="brain"
            loading={status === 'loading'}
            disabled={isButtonDisabled}
          >
            {buttonLabel}
          </Button>
        }
      >
      <List.Section>
        {Object.entries(activeLLMs).map(([key, llm]) => (
          <Menu.Item
            key={key}
            onPress={() => {
              if (activeLLMsCount > 1 || !llm.active) {
                toggleLLM(key);
              }
            }}
            title={
              <View style={Style.menuItem}>
                <List.Item
                  title={llm.name}
                  style={{ flex: 1 }}
                />
                <Checkbox
                  status={llm.active ? 'checked' : 'unchecked'}
                  disabled={activeLLMsCount === 1 && llm.active}
                />
              </View>
            }
          />
        ))}
      </List.Section>
    </Menu>
  );
};
