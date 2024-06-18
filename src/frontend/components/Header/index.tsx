import type { DrawerHeaderProps } from '@react-navigation/drawer';
import React from 'react';

import { DrawerActions } from '@react-navigation/native';
import { Pressable, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { AilixirLogo } from 'src/frontend/icons';
import { DropdownMenu } from '../DropdownMenu';
import { Style } from './style';

export function Header(props: DrawerHeaderProps) {
  const { navigation } = props;
  return (
    <Surface style={Style.container} elevation={1}>
      <View style={{ flexDirection: 'row', alignItems:'center' }}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginRight: 16 }}
        >
          <AilixirLogo height={36} width={36} />
        </Pressable>
        <Text variant='titleLarge'>AiLixir</Text>
      </View>
      <DropdownMenu />
    </Surface>
  );
}
