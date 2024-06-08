import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { Button, type ButtonProps } from 'react-native-paper';

export function SubmitButton(props: ButtonProps) {
  const { children, ...rest } = props;
  const { submitForm } = useFormikContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handles form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await submitForm();
    setIsSubmitting(false);
  };

  // Renders the button
  return (
    <Button
      mode='contained'
      onPress={handleSubmit}
      disabled={isSubmitting}
      loading={isSubmitting}
      {...rest}
    >
      {children}
    </Button>
  );
}
