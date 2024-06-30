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

type UserProfile = {
  name: string;
  styleInstructions: string;
  personalInstructions: string;
};

const PersonalInfoForm = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [styleInstructions, setStyleInstructions] = useState('');
  const [personalInstructions, setPersonalInstructions] = useState('');

  const handleSave = () => {
    const data = {
      name,
      styleInstructions,
      personalInstructions
    };

    if (currentProfile) {
      const updatedProfiles = profiles.map((profile) =>
        profile === currentProfile ? data : profile
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
    const updatedProfiles = profiles.filter((p) => p !== profile);
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
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Personal Information</Title>
              <TextInput
                label='Name'
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
              />
              <Text variant='titleSmall'>
                Style Instructions: How would you like the bot to respond?
              </Text>
              <TextInput
                //label=""
                placeholder='Example: The style should be formal and detailed'
                value={styleInstructions}
                onChangeText={(text) => setStyleInstructions(text)}
                style={styles.input}
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
                style={styles.input}
                numberOfLines={4}
                maxLength={250}
                multiline={true}
              />
              <Button mode='contained' onPress={handleSave} style={styles.button}>
                {currentProfile ? 'Update' : 'Save'}
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Saved Profiles</Title>
              {profiles.map((profile, index) => (
                <View key={index} style={styles.profile}>
                  <Paragraph>Name: {profile.name}</Paragraph>
                  <Button
                    mode='outlined'
                    onPress={() => handleEdit(profile)}
                    style={styles.profileButton}
                  >
                    Edit
                  </Button>
                  <Button
                    mode='contained'
                    onPress={() => handleDelete(profile)}
                    style={styles.profileButton}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  card: {
    marginBottom: 16
  },
  input: {
    marginBottom: 16
  },
  button: {
    marginTop: 16
  },
  textInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  profileButton: {
    marginLeft: 10
  }
});

export default PersonalInfoForm;
