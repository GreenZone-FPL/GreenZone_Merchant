import moment from 'moment';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Column, NormalText, Row} from '../../../components';
import {colors, GLOBAL_KEYS, OrderStatus} from '../../../constants';
import CallSupportButton from './CallSupportButton';

export const TimelineStatus = ({details}) => {
  const {
    status,
    createdAt,
    readyForPickupAt,
    shippingOrderAt,
    completedAt,
    cancelledAt,
  } = details;

  const formatTime = time => {
    return time ? moment(time).format('HH:mm') : null;
  };

  const timelineData = [
    createdAt && {
      time: formatTime(createdAt),
      title: 'Đơn mới',
      status: OrderStatus.PENDING_CONFIRMATION.value,
      description: 'Đơn hàng vừa được tạo',
    },
    readyForPickupAt && {
      time: formatTime(readyForPickupAt),
      title: 'Đơn hàng sẵn sàng',
      status: OrderStatus.READY_FOR_PICKUP.value,
      description: 'Đơn hàng đã chuẩn bị xong',
    },
    shippingOrderAt && {
      time: formatTime(shippingOrderAt),
      title: 'Đang giao hàng',
      status: OrderStatus.SHIPPING_ORDER.value,
      description: 'Nhân viên GreenZone đang giao hàng',
    },
    completedAt && {
      time: formatTime(completedAt),
      title: 'Hoàn tất',
      status: OrderStatus.COMPLETED.value,
      description: 'Đơn hàng đã hoàn thành',
    },
    cancelledAt && {
      time: formatTime(cancelledAt),
      title: 'Đơn hàng đã hủy',
      status: OrderStatus.CANCELLED.value,
      description: 'Đơn hàng bị hủy',
    },
  ].filter(Boolean);

  const TimelineItem = ({item, isLast}) => {
    const color = item.status == status ? colors.lemon : colors.black;

    return (
      <Row style={styles.itemContainer}>
        <Column style={styles.leftColumn}>
          <View style={styles.circle} />
          <NormalText text={item.time} style={{color: colors.gray700}} />

          {!isLast && <DottedLine />}
        </Column>

        <Column style={styles.rightContent}>
          <View style={styles.bubble}>
            <Text style={[styles.titleText, {color}]}>{item.title}</Text>
            <NormalText text={item.description} />
          </View>
        </Column>
      </Row>
    );
  };
  const DottedLine = () => {
    const dots = new Array(10).fill(0);
    return (
      <View style={styles.dottedLine}>
        {dots.map((_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>
    );
  };

  return (
    <Column style={styles.areaContainer}>
      <FlatList
        data={timelineData}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TimelineItem
            key={index}
            item={item}
            isLast={index === timelineData.length - 1}
          />
        )}
      />

      {/* <CallSupportButton
        phoneNumber={details.store.phoneNumber}
        label="Gọi hỗ trợ"
      /> */}
    </Column>
  );
};

const styles = StyleSheet.create({
  areaContainer: {
    backgroundColor: colors.white,
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  leftColumn: {
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  rightContent: {
    flex: 1,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.lemon,
  },
  dottedLine: {
    position: 'absolute',
    top: 10,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gray300,
  },

  bubble: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: 10,
    gap: 8,
  },
  timeText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    color: colors.gray700,
  },
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '500',
  },
});
