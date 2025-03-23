import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {HorizontalProductItem} from '../../../components';
import {GLOBAL_KEYS, colors} from '../../../constants';

const ProductsInfo = ({orderItems}) => {
  return (
    <View style={[styles.container, {borderBottomWidth: 0}]}>
      <FlatList
        data={orderItems}
        keyExtractor={item => item.product._id}
        renderItem={({item}) => {
          const formattedItem = {
            productName: item.product.name,
            image: item.product.image,
            variantName: item.product.size,
            price: item.price,
            quantity: item.quantity,
            isVariantDefault: false,
            toppingItems: Array.isArray(item.toppingItems)
              ? item.toppingItems
              : [],
          };
          return (
            <HorizontalProductItem item={formattedItem} enableAction={false} />
          );
        }}
        contentContainerStyle={styles.flatListContent}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: colors.gray200,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginBottom: GLOBAL_KEYS.GAP_SMALL,
  },
  flatListContent: {
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
});

export default ProductsInfo;
