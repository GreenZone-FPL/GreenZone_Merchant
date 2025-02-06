import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image , Dimensions} from 'react-native';
import React from 'react';
import { GLOBAL_KEYS, colors } from '../../constants';
import { TitleText } from '../texts/TitleText';
import { Icon } from 'react-native-paper';
import { Row } from '../containers/Row';

const width = Dimensions.get('window').width;

export const NotificationList = props => {
    const {onSeeMorePress} = props;
    return (
        <View style={{ marginTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TitleText text='Khám phá thêm' style={{ marginStart: 16 }} />
                <TouchableOpacity style={{ flexDirection: 'row', marginEnd: 16 }} onPress={onSeeMorePress}>
                    <Text style={{ color: colors.primary }}>Xem thêm</Text>
                    <Icon
                        source="chevron-double-right"
                        size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>
            <FlatList
                data={ListAdventising}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.title} numberOfLines={2} >{item.title}</Text>
                        <Text style={styles.type}>{item.type}</Text>
                        <Row>
                            <Icon
                                source="calendar-month-outline"
                                size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                                color={colors.primary}
                            />
                            <Text style={styles.date}>{item.date}</Text>
                        </Row>
                        
                    </View>
                )}
            />
        </View>
    );
};

// Danh sách 
const ListAdventising = [
    {
        id: '1',
        title: 'Ưu đãi đặc biệt',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt', 
        date: '03/02'
    },
    {
        id: '2',
        title: 'Giảm 50% combo Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt', 
        date: '03/02'
    },
    {
        id: '3',
        title: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt', 
        date: '03/02'
    },
    {
        id: '4',
        title: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/imgae_product_combo/image_combo_2_milk_tea.png'),
        type: '#Ưu đãi đặc biệt', 
        date: '03/02'
    },
    {
        id: '5',
        title: 'Sản phẩm mới',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone', 
        date: '03/02'
    },
    {
        id: '6',
        title: 'Mùa hè bùng cháy cùng GreenZone Trải ngiệm ngay',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone', 
        date: '03/02'
    },
    {
        id: '7',
        title: 'Sản phẩm mới',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone', 
        date: '03/02'
    },
    {
        id: '8',
        title: 'Sản phẩm mới',
        image: require('../../assets/images/banerlogin.png'),
        type: '#Cập nhật từ GreenZone', 
        date: '03/02'
    },
    {
        id: '9',
        title: 'Cùng thưởng thức đồ uống yêu thích của bạn',
        image: require('../../assets/images/drinkfaforite.jpg'),
        type: '#Favorite', 
        date: '03/02'
    },
];

// Style
const styles = StyleSheet.create({
    itemContainer: {
        width: width/2,
        padding: 10,
        marginHorizontal: 8,
    },
    image: {
        width: '100%',
        height: 160,
        borderRadius: 10,
    },
    title: {
        fontSize: GLOBAL_KEYS.TE,
        fontWeight: 'bold',
        marginTop: 8,
    },
    type: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: 'gray',
    },
    date: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
        color: colors.gray400,
        marginTop: 4,
    },
});

export default NotificationList;
