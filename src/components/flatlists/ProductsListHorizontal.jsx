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

export const  ProductsListHorizontal = props => {
  const {onItemClick} = props;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Combo 69K + Freeship</Text>
          <Text style={styles.timeText}>08:00:00</Text>
        </View>
        <FlatList
          data={productsCombo}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <ItemProduct item={item} onItemClick={() => onItemClick()} />
          )}
          horizontal={true}
          contentContainerStyle={{
            gap: GLOBAL_KEYS.GAP_DEFAULT,
          }}
          scrollEnabled={true}
        />
      </View>
    </View>
  );
};

const ItemProduct = ({item, onItemClick}) => {
  return (
    <View style={styles.itemProduct}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{TextFormatter.formatCurrency(item.price)}</Text>
      </View>
      <Text numberOfLines={4} style={styles.productNameText}>
        {item.name}
      </Text>
      <TouchableOpacity
        onPress={() => onItemClick()}
        style={styles.addButtonContainer}>
        <Icon
          source="plus"
          color={colors.primary}
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        />
      </TouchableOpacity>
    </View>
  );
};

const productsCombo = [
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
    name: 'Combo 3 Olong Tea',
    image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
    price: 79000,
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
    backgroundColor: colors.white,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  headerContainer: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: colors.black,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
  },
  timeText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    color: colors.primary,
    marginLeft: GLOBAL_KEYS.PADDING_DEFAULT,
  },

  itemProduct: {
    backgroundColor: colors.black,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    flex: 1,
  },
  itemImage: {
    width: 157,
    height: 235,
    resizeMode: 'cover',
    opacity: 0.6,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  priceContainer: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    position: 'absolute',
    end: 0,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  priceText: {
    color: colors.primary,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  productNameText: {
    color: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: '20%',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white,
  },
});


