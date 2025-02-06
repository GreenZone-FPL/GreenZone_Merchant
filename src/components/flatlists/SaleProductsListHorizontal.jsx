import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GLOBAL_KEYS, colors} from '../../constants';
import {TextFormatter} from '../../utils';
import {Column} from '../containers/Column';
import {Row} from '../containers/Row';
import {SaleCountdown, SaleDiscount, SalePrice} from '../sale/Sale';

const width = Dimensions.get('window').width;

export const SaleProductsListHorizontal = ({onItemClick}) => {
  return (
    <Column style={styles.headerContainer}>
      <Row style={styles.headerTextContainer}>
        <Text style={styles.headerText}>Bánh chỉ 19k</Text>

        <SaleCountdown
          startDate={data.time.startDate}
          endDate={data.time.endDate}
          currentDate={data.time.currentDate}
        />
      </Row>
      <FlatList
        data={data.bakeryProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ItemProduct item={item} onItemClick={() => onItemClick()} />
        )}
        horizontal
        contentContainerStyle={{gap: GLOBAL_KEYS.GAP_DEFAULT}}
        showsHorizontalScrollIndicator={false}
      />
    </Column>
  );
};

const ItemProduct = ({item, onItemClick}) => {
  const [showSale, setShowSale] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSale(false);
    }, data.time.endDate - data.time.startDate);

    return () => clearTimeout(timeout);
  }, [data.time.endDate, data.time.startDate]);

  return (
    <Column style={styles.itemProduct}>
      {item.discount > 0 ? (
        <SaleDiscount showSale={showSale} percentDiscount={item.discount} />
      ) : (
        <Text style={styles.itemDiscountZero} />
      )}
      <View style={styles.imageContainer}>
        <View style={styles.imageBackground} />
        <Image source={{uri: item.image}} style={styles.itemImage} />
      </View>

      <Text numberOfLines={2} ellipsizeMode="clip" style={styles.itemName}>
        {item.name}
      </Text>

      <SalePrice
        showSale={showSale}
        price={item.price}
        discount={item.discount}
      />

      <TouchableOpacity onPress={onItemClick}>
        <Text style={styles.selectButton}>Chọn</Text>
      </TouchableOpacity>
    </Column>
  );
};

const data = {
  time: {
    startDate: Date.now(),
    endDate: Date.now() + 10000,
    currentDate: Date.now(),
  },
  bakeryProducts: [
    {
      id: '1',
      name: 'Bánh Mochi Kem Matcha Bánh Mochi Kem Matcha',
      image:
        'https://png.pngtree.com/png-vector/20240904/ourmid/pngtree-mocha-cake-png-image_13753009.png',
      price: 49000,
      discount: 3,
    },
    {
      id: '2',
      name: 'Bánh Mỳ Phô Mai Bơ Tỏi',
      image:
        'https://file.aiquickdraw.com/imgcompressed/img/compressed_3853822f62aaa8180ec3a3e4a496a3ae.webp',
      price: 59000,
      discount: 30,
    },
    {
      id: '3',
      name: 'Bánh Su Kem Truyền Thống',
      image:
        'https://file.aiquickdraw.com/imgcompressed/img/compressed_931fa9581aea9f5cf9e014eee6844588.webp',
      price: 35000,
      discount: 0,
    },
    {
      id: '4',
      name: 'Bánh Mochi Kem Dâu',
      image:
        'https://t3.ftcdn.net/jpg/09/18/94/82/240_F_918948232_4gcbeg4scK6sS9jeqtnrU9HQ9NffQsoT.jpg',
      price: 49000,
      discount: 10,
    },
  ],
};

const styles = StyleSheet.create({
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
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    color: colors.primary,
    marginLeft: GLOBAL_KEYS.PADDING_DEFAULT,
    fontWeight: 'bold',
  },
  itemProduct: {
    width: width / 3.5,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  itemDiscountZero: {
    backgroundColor: colors.white,
  },
  imageContainer: {
    height: width / 3.5,
    justifyContent: 'flex-end',
  },
  imageBackground: {
    height: width / 3.5 / 2,
    backgroundColor: colors.green100,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  itemImage: {
    width: width / 3.5,
    height: width / 3.5,
    resizeMode: 'cover',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    position: 'absolute',
  },

  itemName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '500',
    flex: 1,
  },
  selectButton: {
    backgroundColor: colors.primary,
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_SMALL,
  },
});

export default SaleProductsListHorizontal;
