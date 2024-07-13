import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

/**
 * This file renders the Sign Up screen.
 *
 * This screen allows the user to input their name, email, and password to create an account.
 */

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUp() {
  const fireAuth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      const { name, email, password } = data;
      setIsSubmitting(true);
      try {
        const { user } = await createUserWithEmailAndPassword(fireAuth, email, password);
        await updateProfile(user, { displayName: name, photoURL: '' });
        navigate('Auth', { screen: Screens.LogIn });
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
          <Text variant='titleLarge'>Create An Account</Text>
        </View>
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required(),
            name: Yup.string().required(),
            password: Yup.string().min(6).required(),
            confirmPassword: Yup.string()
              .required()
              .oneOf([Yup.ref('password')], 'Passwords must match')
          })}
          onSubmit={handleSignUp}
          validateOnBlur={true}
          validateOnChange={true}
        >
          <View style={Style.formContainer}>
            <TextInput
              fieldName='name'
              label='Name'
              mode='flat'
              keyboardType='name-phone-pad'
              disabled={isSubmitting}
            />
            <TextInput
              fieldName='email'
              label='Email'
              keyboardType='email-address'
              disabled={isSubmitting}
            />
            <TextInput
              fieldName='password'
              label='Password'
              secureTextEntry={true}
              disabled={isSubmitting}
            />
            <TextInput
              fieldName='confirmPassword'
              label='Confirm Password'
              secureTextEntry={true}
              submitOnEnter={true}
            />
            <SubmitButton>Create Account</SubmitButton>
          </View>
        </Formik>
      </View>
    </ScreenLayout>
  );
}
