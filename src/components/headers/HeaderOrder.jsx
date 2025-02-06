import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import PropTypes from 'prop-types'
import { Category2, ArrowCircleDown, Heart, SearchNormal1 ,ArrowDown2} from 'iconsax-react-native';
import { Row } from '../containers/Row';

const HeaderOrderPropTypes = {
  title: PropTypes.string,
  onCategoryPress: PropTypes.func,
  onFavoritePress: PropTypes.func,
  onSearchProduct: PropTypes.func,
};

export const HeaderOrder = (props) => {
  const { title,onCategoryPress , onFavoritePress , onSearchProduct} = props;
  return (
    <View style={styles.header}>
      <Row>
      <Category2 size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary} variant="Bulk" />
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onCategoryPress}>
          <ArrowDown2 size={GLOBAL_KEYS.ICON_SIZE_SMALL} color={colors.primary}/>
        </TouchableOpacity>
      </Row>
      <Row>
          <TouchableOpacity onPress={onSearchProduct}>
            <SearchNormal1 size={GLOBAL_KEYS.ICON_SIZE_DEFAULT} color={colors.primary}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={onFavoritePress}>
            <Heart size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}  color={colors.primary}/>
          </TouchableOpacity>
      </Row>
    </View>
  );
};

HeaderOrder.propTypes = HeaderOrderPropTypes


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    marginBottom: 8,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.black,
  },
  image: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },

});


