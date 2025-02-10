import React from 'react';
import { FlatList, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { Column, DualTextRow, HorizontalProductItem, NormalText, OverlayStatusBar, PaymentMethodRow, Row, TitleText } from '../../components';
import { GLOBAL_KEYS, colors } from '../../constants';
import { OrderGraph } from '../../layouts/graphs';

const OrderDetailScreen = (props) => {

    const { navigation } = props;


    return (
        <View style={styles.modalContainer}>
            <OverlayStatusBar />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.modalContent}>

                <Row style={{ width: '100%', backgroundColor: 'white', justifyContent: 'space-between', paddingHorizontal: 16 }}>
                    <View style={{ width: 24, height: 24 }}></View>
                    <TitleText text='Chi tiết đơn hàng' style={{ alignSelf: 'center' }} />
                    <IconButton
                        icon="close"
                        size={GLOBAL_KEYS.ICON_SIZE_SMALL}
                        iconColor={colors.primary}
                        style={styles.closeButton}
                        onPress={() => navigation.goBack()}
                    />
                </Row>

                <Title
                    title={'Đơn hàng đang thực hiện'}
                    titleStyle={{ fontWeight: '500', margin: GLOBAL_KEYS.PADDING_DEFAULT }}
                />
                <ShipperInfo  />
                <MerchantInfo />
                <RecipientInfo />

                <ProductsInfo />


                <PaymentDetails />

            </ScrollView>

        </View >



    );
};

const ShipperInfo = ({ messageClick }) => {
    return (
        <Row style={{ gap: 16, marginVertical: 8, marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT }}>
            <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/helmet.png')} />
            <Column style={{ flex: 1 }}>
                <NormalText text='Shipper' style={{ fontWeight: '500' }} />
                <Row>
                    <Icon
                        source="star"
                        color={colors.yellow700}
                        size={20}
                    />
                    <NormalText text='5.0' />
                    <NormalText text='60B7-40035' style={{ color: colors.yellow700 }} />

                </Row>
            </Column>

            <Row style={{ gap: 24 }}>

                <Icon
                    source="phone-outline"
                    color={colors.black}
                    size={20}
                />
                <Pressable onPress={messageClick}>
                    <Icon
                        source="message-outline"
                        color={colors.black}
                        size={20}
                    />
                </Pressable>

            </Row>
        </Row>
    )
}

const ProductsInfo = () => {
    return (
        <View style={[styles.areaContainer, { borderBottomWidth: 0 }]}>
            <Title
                title={'Danh sách sản phẩm'}
                icon='sticker-text-outline'
            />
            <FlatList
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <HorizontalProductItem item={item} />
                )}
                contentContainerStyle={{ marginVertical: GLOBAL_KEYS.PADDING_DEFAULT }}
                scrollEnabled={false}
            />
        </View>
    )
}

const MerchantInfo = () => {
    return (
        <View style={styles.areaContainer}>
            <Title title='Cửa hàng' icon='store' />
            <Title title='Green Zone' titleStyle={{ color: colors.black }} />
            <Text style={styles.normalText}>1 Tô Ký, Trung Mỹ Tây, Quận 12, Hồ Chí Minh</Text>
        </View>
    )
}

const RecipientInfo = () => (
    <View style={styles.areaContainer}>
        <Title title='Người nhận' icon='map-marker' />
        <Title title='Ngọc Đại | 012345678' titleStyle={{ color: colors.black }} />
        <Text style={styles.normalText}>
            FPT Polytechnic TP. HCM - Tòa F, Công Viên Phần Mềm Quang Trung, Tòa nhà GenPacific Lô 3 đường 16, Trung Mỹ Tây, Quận 12, Hồ Chí Minh
        </Text>
    </View>
);

const Title = ({
    title,
    icon,
    titleStyle,
    iconColor = colors.primary,
    iconSize = GLOBAL_KEYS.ICON_SIZE_DEFAULT }) => {
    return (
        <View style={styles.titleContainer}>
            {
                icon &&
                <Icon
                    source={icon}
                    color={iconColor}
                    size={iconSize}
                />
            }

            <Text style={[styles.greenText, titleStyle]}>{title}</Text>
        </View>

    )
}


const PaymentDetails = () => (
    <View style={{ marginBottom: 8, marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT }}>

        <DualTextRow
            leftText="CHI TIẾT THANH TOÁN"
            leftTextStyle={{ color: colors.primary, fontWeight: 'bold' }}
        />
        <OrderId />
        {[
            { leftText: 'Tạm tính (2 sản phẩm)', rightText: '69.000đ' },
            { leftText: 'Phí giao hàng', rightText: '18.000đ' },
            { leftText: 'Giảm giá', rightText: '-28.000đ', rightTextStyle: { color: colors.primary } },
            {
                leftText: 'Đã thanh toán',
                rightText: '68.000đ',
                leftTextStyle: { paddingHorizontal: 4, paddingVertical: 2, borderWidth: 1, borderRadius: 6, borderColor: colors.primary, color: colors.primary },
                rightTextStyle: { fontWeight: '700', color: colors.primary }
            },
            { leftText: 'Thời gian đặt hàng', rightText: '2024/07/03, 20:08' },
        ].map((item, index) => (
            <DualTextRow key={index} {...item} />
        ))}



        <PaymentMethodRow enableChange={false} />

        <Pressable style={styles.button} onPress={() => { }}>
            <NormalText text='Đã hoàn thành đơn hàng' />
        </Pressable>
    </View>
);

const OrderId = () => {
    return (
        <Row style={[styles.row, { marginBottom: 6 }]}>
            <NormalText text='Mã đơn hàng' />
            <Pressable style={styles.row} onPress={() => { }}>

                <Text style={[styles.normalText, { fontWeight: 'bold', marginRight: 8 }]}>202407032008350</Text>
                <Icon
                    source='content-copy'
                    color={colors.teal900}
                    size={18}
                />
            </Pressable>
        </Row>
    )
}



const products = [
    {
        id: '1',
        name: 'Trà Xanh Sữa Hạnh Nhân (Latte)',
        image: require('../../assets/images/product1.png'),
        price: 69000,
    },
    {
        id: '2',
        name: 'Combo 3 Olong Tea',
        image: require('../../assets/images/product1.png'),
        price: 79000,
    },
    {
        id: '3',
        name: 'Combo 2 Trà Sữa Trân Châu Hoàng Kim',
        image: require('../../assets/images/product1.png'),
        price: 69000,
    },
    {
        id: '4',
        name: 'Trà Xanh Sữa Hạnh Nhân (Latte)',
        image: require('../../assets/images/product1.png'),
        price: 79000,
    },
];



const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.overlay,
        flex: 1,
        width: '100%',

    },
    modalContent: {
        width: '75%',
        alignSelf: 'center',
        backgroundColor: colors.white,
        flexDirection: 'column',
        gap: GLOBAL_KEYS.GAP_SMALL,
        margin: StatusBar.currentHeight,
        flexDirection: 'column',
        flex: 1,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE
    },
    row: {
        flexDirection: 'row',
        gap: GLOBAL_KEYS.GAP_SMALL,
        justifyContent: 'flex-end',
        flex: 1
    },
    closeButton: {
        backgroundColor: colors.green100,
        alignSelf: 'flex-end'
    },

    greenText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.primary,
        fontWeight: '600'
    },
    titleContainer: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: GLOBAL_KEYS.GAP_SMALL
    },
    areaContainer: {
        borderBottomWidth: 5,
        borderColor: colors.gray200,
        paddingVertical: 8,
        marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    button: {
        backgroundColor: colors.white,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.gray200,
        borderWidth: 2,
        marginVertical: 16
    },
});

export default OrderDetailScreen;

