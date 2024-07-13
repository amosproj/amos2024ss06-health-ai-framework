import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from 'reactfire';
import { ScreenLayout, SubmitButton, TextInput } from 'src/frontend/components';
import { Screens } from 'src/frontend/helpers';
import { AilixirLogo } from 'src/frontend/icons';
import type { AppRoutesParams } from 'src/frontend/routes';
import type { AuthStackParams } from 'src/frontend/routes/AuthRoutes';
import * as Yup from 'yup';
import { Style } from './style';

/**
 * This file renders the Reset Password screen.
 *
 * This screen allows the user to reset their password after clicking on the link in the password reset email.
 */

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export function ResetPassword() {
  const fireAuth = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const { reset } = useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
  const router = useRoute<RouteProp<AuthStackParams>>();
  const oobCode = router.params?.oobCode;

  useEffect(() => {
    const getEmail = async () => {
      setIsVerified(false);
      try {
        const email = await verifyPasswordResetCode(fireAuth, oobCode || '');
        setEmail(email);
      } catch (error) {
        setEmail('');
        if (error instanceof FirebaseError) {
          if (error.code === AuthErrorCodes.INVALID_OOB_CODE) {
            setError('Invalid link');
          }
          setError(error.message);
        }
      }
      setIsVerified(true);
    };
    getEmail();
  }, [oobCode]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    const { password } = data;
    setIsSubmitting(true);
    Keyboard.dismiss();
    try {
      await confirmPasswordReset(fireAuth, oobCode || '', password);
      reset({ index: 0, routes: [{ name: 'Auth', params: { screen: Screens.LogIn } }] });
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <ScreenLayout>
      <View style={Style.container}>
        {!isVerified ? (
          <ActivityIndicator size='large' />
        ) : (
          <>
            <View style={Style.header}>
              <AilixirLogo height={80} width={80} style={{ marginBottom: 16 }} />
              <Text variant='titleLarge'>Reset Password</Text>
            </View>
            {email ? (
              <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={Yup.object().shape({
                  password: Yup.string().min(6).required(),
                  confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password')], 'Passwords must match')
                    .required()
                })}
                onSubmit={handleResetPassword}
                validateOnBlur={true}
                validateOnChange={true}
                disabled={isSubmitting}
              >
                <View style={Style.formContainer}>
                  <TextInput fieldName='password' label='Password' secureTextEntry={true} />
                  <TextInput
                    fieldName='confirmPassword'
                    label='Confirm Password'
                    secureTextEntry={true}
                    submitOnEnter={true}
                    disabled={isSubmitting}
                  />
                  <SubmitButton>Reset Password</SubmitButton>
                </View>
              </Formik>
            ) : (
              <Text>{error}</Text>
            )}
          </>
        )}
      </View>
    </ScreenLayout>
  );
}
