import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';

// PropTypes cho FlatInput
const FlatInputPropTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  message: PropTypes.string,
  setIsPasswordVisible: PropTypes.func,
  isPasswordVisible: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  style: PropTypes.object,
  editable: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
    'url',
  ]),
};

// PropTypes cho CustomFlatInput
const CustomFlatInputPropTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  message: PropTypes.string,
  rightIcon: PropTypes.string,
  onRightPress: PropTypes.func,
  rightIconColor: PropTypes.string,
  style: PropTypes.object,
  editable: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
    'url',
  ]),
};

/**
 * Usage Example:
 *
 * <FlatInput
 *    label="Email"
 *    placeholder="Enter your email"
 *    setValue={(text) => setEmail(text)}
 *    message={emailError}
 *    keyboardType="email-address"
 * />
 */
export const FlatInput = ({
  label = 'Default label',
  placeholder = 'Default place holder',
  value,
  setValue,
  message,
  setIsPasswordVisible,
  isPasswordVisible = false,
  secureTextEntry = false,
  style,
  editable = true,
  keyboardType = 'default',
  onSubmitEditing,
  returnKeyType = "done"
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={setValue}
        mode="flat"
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        error={!!message}
        outlineColor={!!message ? colors.red800 : colors.primary}
        activeUnderlineColor={colors.primary}
        underlineColor={colors.primary}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        style={styles.input}
        right={
          secureTextEntry && (
            <TextInput.Icon
              color={colors.gray400}
              icon={isPasswordVisible ? 'eye-off' : 'eye'}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          )
        }
        editable={editable}
        keyboardType={keyboardType}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
      />
      {message && <Text style={styles.errorText}>{message}</Text>}
    </View>
  );
};

FlatInput.propTypes = FlatInputPropTypes;

/**
 * Usage Example:
 *
 * <CustomFlatInput
 *    label="Email"
 *    placeholder="Enter your email"
 *    setValue={(text) => setEmail(text)}
 *    message={emailError}
 *    keyboardType="email-address"
 * />
 */
export const CustomFlatInput = ({
  label = 'Default label',
  placeholder = 'Default place holder',
  value,
  setValue,
  message,
  rightIcon = 'calendar',
  onRightPress,
  rightIconColor = colors.primary,
  style,
  editable = true,
  keyboardType = 'default',
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={setValue}
        mode="flat"
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        error={!!message}
        outlineColor={!!message ? colors.red800 : colors.primary}
        activeUnderlineColor={colors.primary}
        underlineColor={colors.primary}
        style={styles.input}
        right={
          <TextInput.Icon
            color={rightIconColor}
            icon={rightIcon}
            onPress={onRightPress}
          />
        }
        editable={editable}
        keyboardType={keyboardType}
      />
      {message && <Text style={styles.errorText}>{message}</Text>}
    </View>
  );
};

CustomFlatInput.propTypes = CustomFlatInputPropTypes;

const styles = StyleSheet.create({
  input: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    backgroundColor: colors.white,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  errorText: {
    color: colors.red900,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    marginTop: 4,
  },
  disabledInput: {
    backgroundColor: colors.gray200,
    color: colors.gray500,
  },
});


