import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { AilixirLogo } from 'src/frontend/icons';
import { DropdownMenu } from '../DropdownMenu';
import { SavingChat } from '../SavingChat';
import { Style } from './style';

/**
 * This file holds the code for rendering the header of the Chat UI.
 *
 * It contains the logic for ...
 * - Opening the Drawer
 * - Selecting the LLM model
 * - Saving the chat to the device and clipboard.
 */

export function Header(props: DrawerHeaderProps) {
  const { navigation } = props;

  return (
    <Surface style={Style.container} elevation={1}>
      <View style={Style.viewContainer}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={Style.drawer}
        >
          <AilixirLogo height={36} width={36} />
        </Pressable>
        <Text variant='titleLarge'>AiLixir</Text>
      </View>
      <View style={Style.buttons}>
        <DropdownMenu />
        <SavingChat />
      </View>
    </Surface>
  );
}
