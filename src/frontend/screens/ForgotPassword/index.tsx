import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from 'reactfire';

type ForgotPasswordFormData = {
  email: string;
};

export function ForgotPassword() {
  const fireAuth = useAuth();

  const handleForgotPassword = useCallback(
    async (data: ForgotPasswordFormData) => {
      const { email } = data;
      try {
        await sendPasswordResetEmail(fireAuth, email, {
          url: 'https://amos-agent-framework.firebaseapp.com/__/auth/action',
          handleCodeInApp: true,
          iOS: {
            bundleId: 'com.amos.ailixir'
          },
          android: {
            packageName: 'com.amos.ailixir',
            installApp: true
          },
          dynamicLinkDomain: 'ailixir.page.link'
        });
      } catch (error) {
        console.error(error);
      }
    },
    [fireAuth]
  );

  handleForgotPassword({ email: 'preetvadaliya@gmail.com' });

  return (
    <View>
      <Text>ForgotPassword</Text>
    </View>
  );
}
