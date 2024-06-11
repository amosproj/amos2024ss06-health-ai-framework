import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from 'reactfire';
import { ScreenLayout, SubmitButton, TextInput } from 'src/frontend/components';
import { Screens } from 'src/frontend/helpers';
import { AilixirLogo } from 'src/frontend/icons';
import type { AppRoutesParams } from 'src/frontend/routes';
import * as Yup from 'yup';
import { Style } from './style';

type ForgotPasswordFormData = {
  email: string;
};

export function ForgotPassword() {
  const fireAuth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

  const handleForgotPassword = useCallback(
    async (data: ForgotPasswordFormData) => {
      const { email } = data;
      setIsSubmitting(true);
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
        navigate('Auth', { screen: Screens.LogIn });
      } catch (error) {
        console.error(error);
      }
      setIsSubmitting(false);
    },
    [fireAuth]
  );

  return (
    <ScreenLayout>
      <View style={Style.container}>
        <View style={Style.header}>
          <AilixirLogo height={80} width={80} style={{ marginBottom: 16 }} />
          <Text variant='titleLarge'>Forgot Password</Text>
        </View>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required()
          })}
          onSubmit={handleForgotPassword}
          validateOnBlur={true}
          validateOnChange={true}
        >
          <View style={Style.formContainer}>
            <TextInput
              fieldName='email'
              label='Email'
              keyboardType='email-address'
              disabled={isSubmitting}
            />
            <SubmitButton>Send Password Reset Email</SubmitButton>
          </View>
        </Formik>
      </View>
    </ScreenLayout>
  );
}
