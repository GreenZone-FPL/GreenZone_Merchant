import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { QuantitySelector } from '../buttons/QuantitySelector';


const CheckoutFooterPropTypes = {
    quantity: PropTypes.number.isRequired,
    handlePlus: PropTypes.func.isRequired,
    handleMinus: PropTypes.func.isRequired,
    totalPrice: PropTypes.number,
    buttonTitle: PropTypes.string,
    onButtonPress: PropTypes.func,
    backgroundColor: PropTypes.string
};

/**
 * Usage Example
 *  <CheckoutFooter
        quantity={quantity}
        handlePlus={() => {
            if (quantity < 10) {
                setQuantity(quantity + 1)
            }
        }}
        handleMinus={() => {
            if (quantity > 1) {
                setQuantity(quantity - 1)
            }
        }}
        totalPrice={68000}
        buttonTitle="Thêm vào giỏ hàng"
        onButtonPress={() => { console.log('Thêm vào giỏ hàng') }}
    />
 */
export const CheckoutFooter = ({
    quantity,
    handlePlus,
    handleMinus,
    totalPrice,
    buttonTitle,
    onButtonPress,
    backgroundColor = colors.green100
}) => {
    return (
        <View style={[styles.footer, { backgroundColor: backgroundColor }]}>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <View style={[styles.column, { paddingHorizontal: 0 }]}>
                    <Text style={styles.quantityInfoText}>{quantity} sản phẩm</Text>
                    <Text style={styles.totalText}>{totalPrice}đ</Text>
                </View>

                <QuantitySelector
                    quantity={quantity}
                    handlePlus={handlePlus}
                    handleMinus={handleMinus}
                />
            </View>

            <PrimaryButton title={buttonTitle} onPress={onButtonPress} />
        </View>
    );
};


CheckoutFooter.propTypes = CheckoutFooterPropTypes;


const styles = StyleSheet.create({
    footer: {
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        elevation: 4,
        backgroundColor: colors.green100,
    },
    infoContainer: {
        flexDirection: 'column',
        marginBottom: GLOBAL_KEYS.PADDING_SMALL,
    },
    quantityInfoText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
    },
    totalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: 'bold',
        color: colors.primary,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
    },
    quantityText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: 'bold',
        color: colors.black,
        marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    },
});


