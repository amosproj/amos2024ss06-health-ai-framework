import React, { useState, useEffect } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Provider as PaperProvider,
  Paragraph,
  Text,
  TextInput,
  Title
} from 'react-native-paper';
import { Style } from './style';

const PersonalInfoForm = () => {
  const firestore = useFirestore();
  const { data: user } = useUser();
  
  const [name, setName] = useState('');
  const [styleInstructions, setStyleInstructions] = useState('');
  const [personalInstructions, setPersonalInstructions] = useState('');

  useEffect(() => {
    if (user) {
      const userDoc = doc(firestore, 'users', user.uid);
      getDoc(userDoc).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setStyleInstructions(data.styleInstructions || '');
          setPersonalInstructions(data.personalInstructions || '');
        }
      });
    }
  }, [user, firestore]);

  const handleSave = async () => {
    if (user) {
      const userDoc = doc(firestore, 'users', user.uid);
      await setDoc(userDoc, {
        name,
        styleInstructions,
        personalInstructions
      }, { merge: true });
    }
  };
  
  return (
    <PaperProvider>
      <SafeAreaView style={Style.container}>
        <ScrollView>
          <Card style={Style.card}>
            <Card.Content>
              <Title>Personal Information</Title>
              <TextInput
                label='Name'
                value={name}
                onChangeText={(text) => setName(text)}
                style={Style.input}
              />
              <Text variant='titleSmall'>
                Style Instructions: How would you like the bot to respond?
              </Text>
              <TextInput
                placeholder='Example: The style should be formal and detailed'
                value={styleInstructions}
                onChangeText={(text) => setStyleInstructions(text)}
                style={Style.input}
                numberOfLines={4}
                maxLength={250}
                multiline={true}
              />
              <Text variant='titleSmall'>
                Personalized Instructions: What do you want the bot to know about you?
              </Text>
              <TextInput
                placeholder="Example: I'm a content creator who teaches people about the newest AI tools."
                value={personalInstructions}
                onChangeText={(text) => setPersonalInstructions(text)}
                style={Style.input}
                numberOfLines={4}
                maxLength={250}
                multiline={true}
              />
              <Button mode='contained' onPress={handleSave} style={Style.button}>
                Save
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export { PersonalInfoForm };