import PropTypes from 'prop-types';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter } from '../../utils';
import { Row } from '../containers/Row';
import { Column } from '../containers/Column';
import { NormalText } from '../texts/NormalText';
import { color } from '@rneui/base';


const HorizontalProductItemPropTypes = {
  item: PropTypes.object.isRequired,
  enableAction: PropTypes.bool,
  enableDelete: PropTypes.bool,
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
  enableDelete,
  onAction,
  imageStyle,
  containerStyle,
  titleStyle,
  optionStyle,
  noteStyle,
  priceStyle,
  confirmDelete,
  oldPriceStyle,
}) => (
  <View style={[styles.itemProduct, containerStyle]}>
    <View style={styles.imageWrapper}>
      <Image
        style={[styles.itemImage, imageStyle]}
        source={{ uri: item.image }}
      />
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>x{item.quantity}</Text>
      </View>
    </View>

    <Column style={styles.productInfo}>
      <Text style={[styles.productName, titleStyle]}>{item.productName}</Text>
      {item.variantName && !item.isVariantDefault && (
        <Text
          style={[styles.normalText, { color: colors.pink500, fontWeight: '500' }, optionStyle]}>
          {item.variantName}
        </Text>
      )}

      {item.toppingItems?.map(topping => {
        if (topping.quantity > 0) {
          return (
            <Text
              key={topping._id}
              style={[styles.normalText, { color: colors.gray850 }, optionStyle]}>
              x{topping.quantity} {topping.name}
            </Text>
          );
        }
        return null;
      })}

      {item.note && (
        <Text style={[styles.normalText, { color: colors.orange700 }, noteStyle]}>
          Note: {item.note}
        </Text>
      )}
    </Column>

    <Column style={styles.priceContainer}>
      <Text style={[styles.productPrice, priceStyle]}>
        {TextFormatter.formatCurrency(item.price * item.quantity)}
      </Text>

      {enableDelete && (
        <Pressable onPress={confirmDelete}>
          <NormalText text="Xóa" style={{ color: colors.orange700 }} />
        </Pressable>
      )}

      {/* <Text style={[styles.lineThroughText, oldPriceStyle]}>{TextFormatter.formatCurrency(item.price)}</Text> */}
      {enableAction && (
        <Pressable onPress={onAction}>
          <Icon
            source="square-edit-outline"
            size={GLOBAL_KEYS.ICON_SIZE_SMALL}
            color={colors.primary}
          />
        </Pressable>
      )}
    </Column>
  </View>
);

HorizontalProductItem.propTypes = HorizontalProductItemPropTypes



const styles = StyleSheet.create({
  itemProduct: {
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: 4,
    gap: GLOBAL_KEYS.GAP_SMALL,
    backgroundColor: colors.white,
    borderBottomColor: colors.gray200,
    borderBottomWidth: 1,
    marginBottom: 8,
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
    color: colors.black,

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