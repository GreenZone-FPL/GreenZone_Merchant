import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import PropTypes from 'prop-types';


const RadioButtonPropTypes = {
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};


export const  RadioButton = ({
    label,
    selected,
    onPress,
    price
}) => {
    const radioColor = selected ? colors.primary : colors.gray400
    const textColor = selected ? colors.primary : colors.black
    return (

        <Pressable style={styles.radioContainer} onPress={onPress}>
            <View style={[styles.outerCircle, { borderColor: radioColor }]}>
                {selected && <View style={styles.innerCircle} />}
            </View>

            <Text style={[styles.label, { color: textColor }]}>
                {label}
            </Text>

            {/* Thông tin thêm */}

            {price && (
                <Text style={[styles.price, { color: textColor }]}>
                    {price}
                </Text>
            )}
        </Pressable>
    );
};

RadioButton.propTypes = RadioButtonPropTypes;



const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    },
    outerCircle: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
        borderRadius: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: GLOBAL_KEYS.PADDING_SMALL,
    },
    innerCircle: {
        width: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
        height: GLOBAL_KEYS.ICON_SIZE_DEFAULT / 2,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        backgroundColor: colors.primary,
    },
    label: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        flex: 1
    },
    price: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    },
});


