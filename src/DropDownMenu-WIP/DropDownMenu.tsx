import * as React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Menu, Divider, PaperProvider, Button } from 'react-native-paper';

export function DropDownMenu() {
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    return (
        <PaperProvider>

            <View
                style={{
                    //paddingTop: 50,
                    //flexDirection: 'row',
                    //justifyContent: 'center'
                }}
            >
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Button onPress={openMenu}>Show Menu</Button>}
                    anchorPosition='bottom'
                >
                    <Menu.Item onPress={() => {}} title="Item1"/>
                    <Divider/>
                    <Menu.Item onPress={() => {}} title="Item2"/>
                </Menu>
            </View>

        </PaperProvider>
        // <Provider>
        //   <View style={styles.container}>
        //     <Menu
        //       visible={visible}
        //       onDismiss={closeMenu}
        //       anchor={<Button onPress={openMenu}>Show menu</Button>}
        //     >
        //       <Menu.Item onPress={() => {}} title="Manage Chat" />
        //       <Menu.Item onPress={() => {}} title="Share" />
        //       <Menu.Item onPress={() => {}} title="Rename" />
        //       <Divider />
        //       <Menu.Item onPress={() => {}} title="Archive" />
        //       <Menu.Item onPress={() => {}} title="Delete" />
        //     </Menu>
        //   </View>
        // </Provider>
    );
};

// interface  {
//     label: string;
//     onPress: () => void;
// }

// const RecentChatButton: React.FC<RecentChatButtonProps> = ({label, onPress, }) => {
//     return (
//         <Button
//             textColor='black'
//             onPress = {onPress}
//             style={{}}
//             contentStyle={{justifyContent: 'flex-start', paddingLeft: 16}}
//             labelStyle={{fontWeight: 'bold'}}
//         >
//             {label}
//         </Button>
//     );
// }