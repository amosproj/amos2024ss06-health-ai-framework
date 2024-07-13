import React, { useState } from 'react';
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
import uuid from 'react-native-uuid';
import type { UserProfile } from 'src/frontend/types';
import { Style } from './style';

/**
 * This file renders a form to input personal information.
 *
 * This form allows the user to input their name, style instructions, and personalized instructions.
 * These informations should be used by the bot to generate personalized responses.
 */

const PersonalInfoForm = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [styleInstructions, setStyleInstructions] = useState('');
  const [personalInstructions, setPersonalInstructions] = useState('');

  const handleSave = () => {
    const data = {
      id: uuid.v4() as string,
      name,
      styleInstructions,
      personalInstructions
    };

    if (currentProfile) {
      const updatedProfiles = profiles.map((profile) =>
        profile.id === currentProfile.id ? data : profile
      );
      setProfiles(updatedProfiles);
    } else {
      setProfiles([...profiles, data]);
    }

    setName('');
    setStyleInstructions('');
    setPersonalInstructions('');
    setCurrentProfile(null);
  };

  const handleEdit = (profile: UserProfile) => {
    setCurrentProfile(profile);
    setName(profile.name);
    setStyleInstructions(profile.styleInstructions);
    setPersonalInstructions(profile.personalInstructions);
  };

  const handleDelete = (profile: UserProfile) => {
    const updatedProfiles = profiles.filter((p) => p.id !== profile.id);
    setProfiles(updatedProfiles);
    if (currentProfile === profile) {
      setName('');
      setStyleInstructions('');
      setPersonalInstructions('');
      setCurrentProfile(null);
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
                //label=""
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
                //label=""
                placeholder="Example: I'm a content creator who teaches people about the newest AI tools."
                value={personalInstructions}
                onChangeText={(text) => setPersonalInstructions(text)}
                style={Style.input}
                numberOfLines={4}
                maxLength={250}
                multiline={true}
              />
              <Button mode='contained' onPress={handleSave} style={Style.button}>
                {currentProfile ? 'Update' : 'Save'}
              </Button>
            </Card.Content>
          </Card>

          <Card style={Style.card}>
            <Card.Content>
              <Title>Saved Profiles</Title>
              {profiles.map((profile) => (
                <View key={profile.id} style={Style.profile}>
                  <Paragraph>Name: {profile.name}</Paragraph>
                  <Button
                    mode='outlined'
                    onPress={() => handleEdit(profile)}
                    style={Style.profileButton}
                  >
                    Edit
                  </Button>
                  <Button
                    mode='contained'
                    onPress={() => handleDelete(profile)}
                    style={Style.profileButton}
                  >
                    Delete
                  </Button>
                </View>
              ))}
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export { PersonalInfoForm };
