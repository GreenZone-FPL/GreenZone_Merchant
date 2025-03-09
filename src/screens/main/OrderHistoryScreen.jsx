import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { ButtonGroup, Column, DualTextRow, NormalText, Row, TitleText, LightStatusBar } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import orders from '../../utils/fakeOrders';
import { OrderGraph } from '../../layouts/graphs';

const { width, height } = Dimensions.get('window')
const OrderHistoryScreen = (props) => {
  const { navigation } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUnconfirmedOpen, setIsUnconfirmedOpen] = useState(true); // Trạng thái ẩn/hiện đơn chưa xác nhận
  const [isConfirmedOpen, setIsConfirmedOpen] = useState(true);     // Trạng thái ẩn/hiện đơn đã xác nhận

  const buttons = ['Đơn Tại Quầy', 'Đơn Online'];
  const orderType = selectedIndex === 0 ? 'Offline' : 'Online';

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <LightStatusBar/>
      <ButtonGroup
        buttons={buttons}
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
        containerColor={colors.white}
        selectedButtonColor={colors.pink500}
        containerStyle={{ marginBottom: 16 }}
      />

      {/* Đơn hàng chưa xác nhận */}
      <View style={styles.card}>
        <Pressable
          style={styles.header}
          onPress={() => setIsUnconfirmedOpen(!isUnconfirmedOpen)}
        >
          <Row style={{ alignItems: 'center', gap: 8 }}>
            <Icon source="timelapse" size={24} color={colors.red900} />
            <TitleText text="Đơn hàng chưa xác nhận" />
          </Row>
          <Icon
            source={isUnconfirmedOpen ? 'chevron-up' : 'chevron-down'}
            size={28}
            color={colors.gray700}
          />
        </Pressable>

        {isUnconfirmedOpen && (
          <OrderGridView 
          status="UnConfirmed"
           orderType={orderType}
           onItemPress={() => navigation.navigate(OrderGraph.OrderDetailScreen)}
           />
        )}
      </View>

      {/* Đơn hàng đã xác nhận */}
      <Column style={styles.card}>
        <Pressable
          style={styles.header}
          onPress={() => setIsConfirmedOpen(!isConfirmedOpen)}
        >
          <Row style={{ alignItems: 'center', gap: 8 }}>
            <Icon source="check-circle" size={24} color={colors.green500} />
            <TitleText text="Đơn hàng đã xác nhận" />
          </Row>
          <Icon
            source={isConfirmedOpen ? 'chevron-up' : 'chevron-down'}
            size={28}
            color={colors.gray700}
          />
        </Pressable>

        {isConfirmedOpen && (
          <OrderGridView status="Confirmed" orderType={orderType} />
        )}
      </Column>
    </ScrollView>
  );
};


// Màn hình từng trạng thái
const OrderGridView = ({ status, orderType, onItemPress }) => {
  const filteredOrders = orders.filter(
    (order) => order.status === status && order.orderType === orderType
  );

  return (
    <Column style={styles.scene}>

      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.orderId}
          scrollEnabled={false}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 16 }}
          renderItem={({ item }) => (
            <OrderItem
              onPress={onItemPress}
              order={item} />
          )}
        />
      ) : (
        <EmptyView message={`Không có đơn hàng ${orderType.toLowerCase()} nào`} />
      )}

    </Column>
  );
};

const OrderItem = ({
  order,
  onPress
}) => (
  <Pressable
    onPress={onPress}
    style={styles.orderItem}>

    <DualTextRow
      leftText={order.orderId}
      rightText={`${order.totalAmount}`}
      leftTextStyle={styles.orderName}
      rightTextStyle={styles.orderTotal}
      style={{ marginVertical: 0 }}
    />

    <DualTextRow
      leftText={order.status}
      rightText="4 sản phẩm"
      leftTextStyle={styles.orderStatus}
      rightTextStyle={styles.normalText}
      style={{ marginVertical: 0 }}
    />


    {/* FlatList con: Hiển thị danh sách sản phẩm */}
    <FlatList
      data={order.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Column style={styles.productItem}>
          <Image
            source={{ uri: 'https://www.onicifood.com/cdn/shop/products/332594556_3485601318363625_7384526670140317642_n.png?v=1677766982&width=1445' }}
            style={styles.productImage}
          />
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
        </Column>
      )}
      horizontal={true}
      scrollEnabled={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16 }}
    />

    <Row style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>

      <NormalText
        style={{ color: colors.gray850 }}
        text={order.createdAt} />


    </Row>
  </Pressable>
);

// Dữ liệu đơn hàng (cập nhật)


const EmptyView = ({ message }) => (
  <Column style={styles.emptyContainer}>
    <Image
      style={styles.image}
      resizeMode="cover"
      source={require('../../assets/images/empty_box.png')}
    />
    <TitleText text={message} />
  </Column>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.fbBg,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    // marginBottom: 24
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  scene: {
    width: '100%',
    backgroundColor: colors.transparent,
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    paddingVertical: 16
  },
  image: {
    width: width / 4.5,
    height: width / 4.5,
  },
  orderItem: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: 6,
    borderBottomColor: colors.grayBg,
    // marginBottom: 8,
    flex: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // maxWidth: width / 3.2

  },
  orderName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  orderStatus: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.pink500,
    fontWeight: '500'

  },
  orderTotal: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.pink500,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  orderTime: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray850,

  },

  productItem: {
    width: 80,
    maxHeight: 120,
    alignItems: 'center',
    gap: 5
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,

  },
  productName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    textAlign: 'center',
    overflow: 'hidden'
  },
  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray850
  },
  estimatedTime: {
    fontWeight: '400',
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  }
});
export default OrderHistoryScreen;