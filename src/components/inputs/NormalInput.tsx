import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors } from '../../constants/color'
import LabelInput from './LabelInput';
import { Column } from '../containers/Column';

interface NormalInputProps extends TextInputProps {
  required: boolean,
  label?: string;
  value: string;
  setValue: (text: string) => void;
  invalidMessage?: string;
  secureTextEntry?: boolean;
  isPasswordVisible?: boolean;
  setIsPasswordVisible?: (visible: boolean) => void;
  style?: ViewStyle;
}

export const NormalInput: React.FC<NormalInputProps> = ({
  required = false,
  label = '',
  placeholder = '',
  value,
  setValue,
  invalidMessage,
  secureTextEntry = false,
  isPasswordVisible = false,
  setIsPasswordVisible,
  style,
  editable = true,
  keyboardType = 'default',
  onSubmitEditing,
  returnKeyType = 'done',
  autoFocus = false,
}) => {
  return (
    <Column style={[styles.container, style]}>
      <LabelInput label={label} required={required} style={{fontSize: 14}}/>


      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        editable={editable}
        keyboardType={keyboardType}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        autoFocus={autoFocus}
        style={styles.input}
      />

      {!!invalidMessage && <Text style={styles.errorText}>{invalidMessage}</Text>}
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: colors.gray400,
  },
  input: {
    fontSize: 14,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  errorText: {
    marginTop: 4,
    color: colors.red800,
    fontSize: 12,
  },
});


