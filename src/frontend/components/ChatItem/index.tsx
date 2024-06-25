import { useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { Screens } from 'src/frontend/helpers';
import { useDeleteChat, useGetChat, useActiveChatId } from 'src/frontend/hooks';
import type { AppRoutesParams } from 'src/frontend/routes';

export type ChatItemProps = {
  id: string;
  title: string;
};

export function ChatItem(props: ChatItemProps) {
  //const { activeChatId, setActiveChatId } = useActiveChatId();
  const { id, title } = props;
  //const { chat } = useGetChat(id);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const drawerStatus = useDrawerStatus();
  const { handleDelete } = useDeleteChat(id);
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

  useEffect(() => {
    if (drawerStatus === 'closed') {
      setMenuVisible(false);
      Keyboard.dismiss();
    }
  }, [drawerStatus]);

  const handleArchive = async () => {};

  return (
    <View>
      <Menu
        visible={isMenuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchorPosition='bottom'
        anchor={
          <Button
            textColor='black'
            onPress={() => navigate('Main', { screen: Screens.Chat, params: { chatId: id } })}
            onLongPress={() => setMenuVisible(true)}
            style={{}}
            contentStyle={{ justifyContent: 'flex-start', paddingLeft: 16 }}
          >
            {/* {title} */}
            <Text variant='titleSmall' style={{ fontWeight: 'bold' }}>
              {title}
            </Text>
          </Button>
        }
      >
        <Menu.Item leadingIcon='archive' onPress={handleArchive} title='Archive' />
        <Menu.Item leadingIcon='trash' onPress={handleDelete} title='Delete' />
      </Menu>
    </View>
  );
}
