import React from 'react';
import { Text, View } from 'react-native';

type LoginFormData = {
  email: string;
  password: string;
};

export function Login() {
  const handleLogin = (formData: LoginFormData) => {
    const { email, password } = formData;
  };

  return (
    <View>
      <Text>EmailPasswordLogin</Text>
    </View>
  );
}
