import { Link, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from 'reactfire';
import { ScreenLayout, SubmitButton, TextInput } from 'src/frontend/components';
import { Screens } from 'src/frontend/helpers';
import { AilixirLogo } from 'src/frontend/icons';
import type { AppRoutesParams } from 'src/frontend/routes';
import * as Yup from 'yup';
import { Style } from './style';

/**
 * This file renders the Login screen.
 *
 * This screen allows the user to input their email and password to log in.
 */

type LoginFormData = {
  email: string;
  password: string;
};

export function Login() {
  const fireAuth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      const { email, password } = data;
      setIsSubmitting(true);
      try {
        await signInWithEmailAndPassword(fireAuth, email, password);
        navigate('Main', { screen: Screens.Chat });
      } catch (error) {
        console.error(error);
      }
      setIsSubmitting(false);
    },
    [fireAuth, navigate]
  );

  return (
    <ScreenLayout>
      <View style={Style.container}>
        <View style={Style.header}>
          <AilixirLogo height={80} width={80} style={{ marginBottom: 16 }} />
          <Text variant='titleLarge'>Login to Account</Text>
        </View>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required()
          })}
          onSubmit={handleLogin}
          validateOnBlur={true}
          validateOnChange={true}
        >
          <View style={Style.formContainer}>
            <TextInput
              fieldName='email'
              label='Email'
              keyboardType='email-address'
              blurOnSubmit={false}
              disabled={isSubmitting}
            />
            <TextInput
              fieldName='password'
              label='Password'
              secureTextEntry={true}
              returnKeyType='done'
              submitOnEnter={true}
              disabled={isSubmitting}
            />
            <Pressable
              style={{ marginBottom: 20 }}
              onPress={() => navigate('Auth', { screen: Screens.ForgotPassword })}
            >
              <Text variant='bodyMedium' style={{ textAlign: 'right' }}>
                Forgot Password?
              </Text>
            </Pressable>
            <SubmitButton>Login</SubmitButton>
          </View>
        </Formik>
      </View>
    </ScreenLayout>
  );
}
