import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from 'reactfire';
import { SubmitButton, TextInput } from 'src/frontend/components';
import { Screens } from 'src/frontend/helpers';
import { AilixirLogo } from 'src/frontend/icons';
import type { AppRoutesParams } from 'src/frontend/routes';
import * as Yup from 'yup';
import { Style } from './style';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUp() {
  const fireAuth = useAuth();
  const { navigate } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      const { name, email, password } = data;
      try {
        // const { user } = await createUserWithEmailAndPassword(fireAuth, email, password);
        // await updateProfile(user, { displayName: name, photoURL: '' });
        navigate('Auth', { screen: Screens.ForgotPassword });
      } catch (error) {
        console.error(error);
      }
    },
    [fireAuth, navigate]
  );

  return (
    <View style={Style.container}>
      <View style={Style.header}>
        <AilixirLogo height={120} width={120} />
        <Text variant='headlineSmall'>Create An Account</Text>
      </View>
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required(),
          name: Yup.string().required(),
          password: Yup.string().min(6).required(),
          confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
        })}
        onSubmit={handleSignUp}
        validateOnBlur={true}
        validateOnChange={true}
      >
        <View style={Style.formContainer}>
          <TextInput fieldName='name' label='Name' mode='flat' />
          <TextInput fieldName='email' label='Email' />
          <TextInput fieldName='password' label='Password' secureTextEntry={true} />
          <TextInput fieldName='confirmPassword' label='Confirm Password' secureTextEntry={true} />
          <SubmitButton>Create Account</SubmitButton>
        </View>
      </Formik>
    </View>
  );
}
