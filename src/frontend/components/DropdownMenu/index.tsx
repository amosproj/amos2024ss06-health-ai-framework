import { type RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, Menu, Checkbox, List } from 'react-native-paper';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';
import { useLLMs } from 'src/frontend/hooks/useLLMs';
import { View } from 'react-native';
import { Style } from './style';
import { useGetAllChat } from 'src/frontend/hooks';
import { Chat } from 'src/frontend/types';

export const DropdownMenu = () => {
  // get chatID after opening app copilot help
  const route = useRoute<RouteProp<MainDrawerParams>>();
  const chatId = route.params?.chatId;
  const [isVisible, setIsVisible] = useState(false);
  const { activeLLMs, toggleLLM } = useLLMs(chatId || 'default');

  const activeLLMsCount = Object.values(activeLLMs).filter(llm => llm.active).length;
  const activeLLMsNames = Object.values(activeLLMs).filter(llm => llm.active).map(llm => llm.name);
  const buttonLabel = activeLLMsCount === 1 ? activeLLMsNames[0] : `${activeLLMsCount} LLMs`;

  //TODO: useGetChat hook and update chat everytime it changes in firestore
  const { chats, status, error } = useGetAllChat();
  const [chat, setChat] = useState<Chat | null>(null); 
  useEffect(() => {
    if (status === 'success' && chats?.length > 0) {
        //TODO: replace this with real chat once we know which chat to get
        setChat(chats[0]);
    }
    else
    {
        setChat(null);
    }
  }, [chats?.length]); //TODO: also change this condition

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
          >
            {buttonLabel}
          </Button>
        }
      >
      <List.Section>
        {Object.entries(activeLLMs).map(([key, llm]) => (
          <Menu.Item
            key={key}
            onPress={() => toggleLLM(key)}
            title={
              <View style={Style.menuItem}>
                <List.Item
                  title={llm.name}
                  style={{ flex: 1 }}
                />
                <Checkbox
                  status={llm.active ? 'checked' : 'unchecked'}
                />
              </View>
            }
          />
        ))}
      </List.Section>
    </Menu>
  );
};
