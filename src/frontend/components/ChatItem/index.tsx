import { useDrawerStatus } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Menu, Text, TouchableRipple } from 'react-native-paper';
import { useDeleteChat, useGetChat, useUpdateChat } from 'src/frontend/hooks';

type ChatItemProps = {
  id: string;
  title: string;
};

export function ChatItem(props: ChatItemProps) {
  const { id, title } = props;
  const [isMenuVisible, setMenuVisible] = useState(false);
  const drawerStatus = useDrawerStatus();
  const { chat } = useGetChat(id);
  const { handleDelete } = useDeleteChat(id);

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
          <TouchableRipple
            rippleColor='rgba(0, 0, 0, .32)'
            style={{ height: 48, paddingHorizontal: 16, justifyContent: 'center' }}
            onLongPress={() => setMenuVisible(true)}
          >
            <Text variant='titleSmall'>{title}</Text>
          </TouchableRipple>
        }
      >
        <Menu.Item leadingIcon='archive' onPress={handleArchive} title='Archive' />
        <Menu.Item leadingIcon='trash' onPress={handleDelete} title='Delete' />
      </Menu>
    </View>
  );
}
