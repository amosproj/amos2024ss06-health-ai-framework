import * as React from 'react';
import { Appbar, Button, Text } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DropDownMenu } from './DropDownMenu';

const CustomHeader = ({navigation} ) => {

    const _toggleDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer())
    }

    return (
            <Appbar.Header mode='center-aligned'>
                <Appbar.Action
                    icon="menu"
                    onPress={_toggleDrawer}
                />
                {/*<Appbar.Content title="Some Title" onPress={() => {console.log("some Title")}}/>*/}


                <DropDownMenu/>
                <Text>Test</Text>
            </Appbar.Header>
    );
};

export default CustomHeader;

// Button to select the LLM

