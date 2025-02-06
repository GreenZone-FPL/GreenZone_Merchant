import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TextFormatter } from '../../utils';

const width = Dimensions.get('window').width;

export const  ProductsListVertical = props => {
  const {onItemClick} = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Món Mới Phải Thử</Text>
      <FlatList
        data={productsNewDish}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ItemProduct item={item} onItemClick={onItemClick} />
        )}
        contentContainerStyle={styles.flatListContentContainer}
        scrollEnabled={false}
      />
    </View>
  );
};

const ItemProduct = ({item, onItemClick}) => {
  return (
    <View style={styles.itemProduct}>
      <Image style={styles.itemImage} source={item.image} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{TextFormatter.formatCurrency(item.price)}</Text>
      </View>
      <TouchableOpacity onPress={() => onItemClick()} style={styles.addButton}>
        <Icon
          source="plus"
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

const productsNewDish = [
  {
    id: '1',
    name: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
    image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
    price: 69000,
  },
  {
    id: '2',
    name: 'Combo 3 Olong Tea',
    image: require('../../assets/images/imgae_product_combo/image_combo_3_milk_tea.png'),
    price: 79000,
  },
  {
    id: '3',
    name: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
    image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
    price: 69000,
  },
  {
    id: '4',
    name: 'Combo 3 Olong Tea',
    image: require('../../assets/images/imgae_product_combo/image_combo_3_milk_tea.png'),
    price: 79000,
  },
];

const styles = StyleSheet.create({
  container: {
    marginHorizontal: GLOBAL_KEYS.GAP_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
    color: colors.black,
  },

  flatListContentContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  itemProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  itemImage: {
    width: width / 4.5,
    height: width / 4.5,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  productInfo: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  productName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  productPrice: {
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.red900,
  },
  addButton: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.primary,
    position: 'absolute',
    end: 0,
    bottom: 0,
  },
});


