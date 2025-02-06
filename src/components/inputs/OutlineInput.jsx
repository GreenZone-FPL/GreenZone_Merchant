import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';

export const  OutlineInput = ({ label, value, setValue, message, setIsPasswordVisible, isPasswordVisible = false, secureTextEntry = false }) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                label={label}
                value={value}
                onChangeText={setValue}
                mode="outlined"
                placeholder={`Enter your ${label.toLowerCase()}`}
                placeholderTextColor={colors.gray400}
                error={!!message}
                outlineColor={!!message ? colors.red800 : colors.primary}
                activeOutlineColor={colors.primary}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                right={
                    secureTextEntry && (
                        <TextInput.Icon
                            color={colors.gray400}
                            icon={isPasswordVisible ? "eye-off" : "eye"}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        />
                    )
                }
            />
            {message && <Text style={styles.errorText}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.white,
        elevation: 3,
        shadowColor: colors.green500,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT
    },
    errorText: {
        color: colors.red900,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        marginTop: 4,
    },
});


