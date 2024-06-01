import { fetchUpdateAsync, reloadAsync, useUpdates } from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, Text, useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export function UpdateApp() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { isUpdateAvailable, isDownloading } = useUpdates();

  useEffect(() => {
    setIsOpen(isUpdateAvailable);
  }, [isUpdateAvailable]);

  const handleUpdate = async () => {
    try {
      await fetchUpdateAsync();
      await reloadAsync();
      Toast.show({
        type: 'success',
        text1: 'Update Success',
        text2: 'The app has been updated successfully.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Error',
        text2: 'Failed to update the app. Please try again.',
      })
    }
  };

  return (
    <Dialog visible={isOpen}>
      <Dialog.Icon icon={'alert'} color={theme.colors.error} />
      <Dialog.Title style={{ textAlign: 'center' }}>
        <Text variant='titleLarge'>Update Available</Text>
      </Dialog.Title>
      <Dialog.Content>
        <Text variant='bodyMedium' style={{ textAlign: 'center' }}>
          A new version of the app is now available.
        </Text>
        <Text variant='bodyMedium' style={{ textAlign: 'center' }}>
          Please update to continue using the app.
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setIsOpen(false)} textColor={theme.colors.error}>
          LATER
        </Button>
        <Button
          onPress={handleUpdate}
          disabled={isDownloading}
          loading={isDownloading}
          mode='contained-tonal'
        >
          UPDATE NOW
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
