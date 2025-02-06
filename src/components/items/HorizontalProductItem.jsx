import PropTypes from 'prop-types';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';


const HorizontalProductItemPropTypes = {
    item: PropTypes.object.isRequired,
    enableAction: PropTypes.bool,
    onAction: PropTypes.func,
    imageStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    optionStyle: PropTypes.object,
    noteStyle: PropTypes.object,
    priceStyle: PropTypes.object,
    oldPriceStyle: PropTypes.object,
};


export const HorizontalProductItem = ({
    item,
    enableAction,
    onAction,
    imageStyle,
    containerStyle,
    titleStyle,
    optionStyle,
    noteStyle,
    priceStyle,
    oldPriceStyle }) => (
    <View style={[styles.itemProduct, containerStyle]}>
        <View style={styles.imageWrapper}>
            <Image style={[styles.itemImage, imageStyle]} source={item.image} />
            <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>x5</Text>
            </View>
        </View>

        <View style={styles.productInfo}>
            <Text style={[styles.productName, titleStyle]}>{item.name}</Text>
            <Text style={[styles.normalText, { color: colors.gray700 }, optionStyle]}>Lớn</Text>
            <Text style={[styles.normalText, { color: colors.gray700 }, optionStyle]}>Kem Phô Mai Macchiato</Text>
            <Text style={[styles.normalText, { color: colors.orange700 }, noteStyle]}>Note: Ít cafe, Nhiều sữa</Text>
        </View>

        <View style={styles.priceContainer}>
            <Text style={[styles.productPrice, priceStyle]}>{item.price}đ</Text>
            <Text style={[styles.lineThroughText, oldPriceStyle]}>70.000đ</Text>
            {
                enableAction &&
                <Pressable onPress={onAction}>
                    <Icon
                        source="square-edit-outline"
                        size={GLOBAL_KEYS.ICON_SIZE_SMALL}
                        color={colors.primary}
                    />
                </Pressable>
            }

        </View>
    </View>
);

HorizontalProductItem.propTypes = HorizontalProductItemPropTypes



const styles = StyleSheet.create({
    itemProduct: {
        flexDirection: 'row',
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        gap: GLOBAL_KEYS.GAP_SMALL,
        backgroundColor: colors.white,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: 8
    },
    itemImage: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 25,
    },
    normalText: {
        textAlign: 'justify',
        lineHeight: 20,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black
    },
    productInfo: {
        flexDirection: 'column',
        flex: 1,
        gap: 5,
    },
    productName: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        fontWeight: '500',

    },
    productPrice: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
        fontWeight: '500'
    },

    imageWrapper: {
        position: 'relative',
    },
    quantityBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.green100,
        borderColor: colors.white,
        borderWidth: 2,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        color: colors.black,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        fontWeight: '500',
    },
    priceContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-end'
    },
    lineThroughText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700,
        textDecorationLine: 'line-through',
    },
})