import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { GLOBAL_KEYS, colors } from '../../constants';
import PropTypes from 'prop-types';

const DualTextRowPropTypes = {
    leftText: PropTypes.string,
    rightText: PropTypes.string,
    leftTextStyle: PropTypes.object,
    rightTextStyle: PropTypes.object,
    onRightPress: PropTypes.func,
    style: PropTypes.object
};


/**
 *
 * Component DualTextRow hiển thị 2 đoạn text (trái và phải) trong một hàng ngang.
 * Usage Example:
 *
 *  <DualTextRow
        leftText={'GIAO HÀNG'}
        rightText={'Thay đổi'}
        leftTextStyle={{color: colors.primary, fontWeight: '700'}}
        rightTextStyle={{color: colors.primary}}
        onRightPress={() => setIsVisibleModal(true)}
    />
 */
export const DualTextRow = ({
    leftText,  // Text bên trái
    rightText, // Text bên phải
    leftTextStyle = {},  // Style của text trái
    rightTextStyle = {}, // Style của text phải
    onRightPress, // Hàm xử lý khi nhấn vào text phải
    style, // Style của container
}) => {
    return (
        <View style={[styles.row, style]}>
            <Text style={[styles.normalText, leftTextStyle]}>{leftText}</Text>
            <Pressable onPress={onRightPress}>
                <Text style={[styles.normalText, rightTextStyle]}>{rightText}</Text>
            </Pressable>
        </View>
    );
};

DualTextRow.propTypes = DualTextRowPropTypes;



const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6,
    },
    normalText: {
        textAlign: 'justify',
        lineHeight: 20,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        fontWeight: '400'
    },
});
