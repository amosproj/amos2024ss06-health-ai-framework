import { type RouteProp, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Button, Menu } from 'react-native-paper';
import { useGetChat, useUpdateChat } from 'src/frontend/hooks';
import type { MainDrawerParams } from 'src/frontend/routes/MainRoutes';

export const DropdownMenu = () => {
  const router = useRoute<RouteProp<MainDrawerParams>>();
  const chatId = router.params?.chatId;
  const [isVisible, setIsVisible] = useState(false);
  const { chat, status } = useGetChat(chatId || 'default');
  const { updateChat, isUpdating } = useUpdateChat(chatId || 'default');

  const llmModels: { [key: string]: string } = useMemo(() => {
    return {
      'gpt-4': 'OpenAi',
      'google-gemini': 'Gemini',
      'mistral-ai': 'Mistral',
      'claude-ai': 'Claude'
    };
  }, []);

  const handleLLMModelChange = async (model: string) => {
    setIsVisible(false);
    try {
      await updateChat({ model: model });
    } catch (error) {
      console.error(error);
    }
  };

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
          loading={status === 'loading' || isUpdating}
        >
          {llmModels[chat?.model || 'gpt-4']}
        </Button>
      }
    >
      {Object.entries(llmModels).map((model) => {
        const [key, value] = model;
        return (
          <Menu.Item
            key={key}
            onPress={async () => {
              await handleLLMModelChange(key);
            }}
            title={value}
          />
        );
      })}
    </Menu>
  );
};
