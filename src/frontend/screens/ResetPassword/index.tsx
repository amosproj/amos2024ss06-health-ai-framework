import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { useAuth } from 'reactfire';
import { Screens } from 'src/frontend/helpers';
import type { AppRoutesParams } from 'src/frontend/routes';
import type { AuthStackParams } from 'src/frontend/routes/AuthRoutes';

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export function ResetPassword() {
  const fireAuth = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      await confirmPasswordReset(fireAuth, oobCode || '', password);
      reset({ index: 0, routes: [{ name: 'Auth', params: { screen: Screens.LogIn } }] });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <View>
      <Text>ForgotPassword</Text>
    </View>
  );
}
