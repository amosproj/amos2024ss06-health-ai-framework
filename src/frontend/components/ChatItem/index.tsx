import React, { useState } from 'react';
import { Menu, Text, TouchableRipple } from 'react-native-paper';
import { useDeleteChat, useGetChat } from 'src/frontend/hooks';

interface ChatItemProps {
  id: string;
  title: string;
}

export function ChatItem(props: ChatItemProps) {
  const { id, title } = props;
  const { chat } = useGetChat(id);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const { handleDelete } = useDeleteChat(id);
  const handleRename = async () => {};
  const handleArchive = async () => {};

  return (
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
      <Menu.Item leadingIcon='pen' onPress={handleRename} title='Rename' />
      <Menu.Item leadingIcon='archive' onPress={handleArchive} title='Archive' />
      <Menu.Item leadingIcon='trash' onPress={handleDelete} title='Delete' />
    </Menu>
  );
}
