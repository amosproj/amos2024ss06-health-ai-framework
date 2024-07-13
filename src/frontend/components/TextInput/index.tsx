import { useField, useFormikContext } from 'formik';
import React, { useState } from 'react';
import {
  TextInput as BaseTextInput,
  type TextInputProps as BaseTextInputProps,
  HelperText
} from 'react-native-paper';

/**
 * This file renders a text input field.
 */


type TextInputProps = BaseTextInputProps & {
  fieldName: string; // The name of the field
  submitOnEnter?: boolean; // Whether to submit the form when Enter is pressed
};

export function TextInput(props: TextInputProps) {
  const { fieldName, submitOnEnter = false, secureTextEntry, ...rest } = props;
  const [, meta] = useField(fieldName);
  const { setFieldValue, submitForm } = useFormikContext();
  const [isTextVisible, setTextVisible] = useState(!secureTextEntry);

  // handleTextInputChange is a function that updates the field value in Formik's state.
  const handleTextInputChange = (text: string) => setFieldValue(fieldName, text);

  // handleSubmitEditing is a function that submits the form.
  const handleSubmitEditing = async () => await submitForm();

  return (
    <>
      <BaseTextInput
        mode='flat'
        {...rest}
        onChangeText={handleTextInputChange}
        secureTextEntry={secureTextEntry ? !isTextVisible : undefined}
        onSubmitEditing={submitOnEnter ? handleSubmitEditing : undefined}
      />
      <HelperText type='error' visible={meta?.touched && Boolean(meta?.error)}>
        {meta?.error}
      </HelperText>
    </>
  );
}
