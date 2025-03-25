export const DeliveryMethod = Object.freeze({
  PICK_UP: {label: 'Nhận tại cửa hàng', value: 'pickup'},
  DELIVERY: {label: 'Giao hàng tận nơi', value: 'delivery'},
});

export const PaymentMethod = Object.freeze({
  ONLINE: {label: 'online', value: 'online'},
  COD: {label: 'cod', value: 'cod'},
});

export const OrderStatus = Object.freeze({
  AWAITING_PAYMENT: {label: 'Chờ thanh toán', value: 'awaitingPayment'},
  PENDING_CONFIRMATION: {label: 'Chờ xác nhận', value: 'pendingConfirmation'},
  PROCESSING: {label: 'Đang xử lý', value: 'processing'},
  READY_FOR_PICKUP: {label: 'Chờ lấy hàng', value: 'readyForPickup'},
  SHIPPING_ORDER: {label: 'Đang giao hàng', value: 'shippingOrder'},
  COMPLETED: {label: 'Hoàn thành', value: 'completed'},
  CANCELLED: {label: 'Đã hủy', value: 'cancelled'},
  FAILED_DELIVERY: {label: 'Giao hàng thất bại', value: 'failedDelivery'},

  getLabels() {
    return Object.values(this).map(status => status.label);
  },

  getValues() {
    return Object.values(this).map(status => status.value);
  },
});

// Cách sử dụng:
// console.log(OrderStatus.getLabels()); // Lấy toàn bộ label
// console.log(OrderStatus.getValues()); // Lấy toàn bộ value

export const checkPaymentStatus = order => {
  if (!order) return 'Không có đơn hàng';

  // Nếu đơn hàng có trạng thái đã hoàn thành
  if (order.status === OrderStatus.COMPLETED.value) {
    return 'Đã thanh toán';
  }

  // Nếu phương thức thanh toán là ONLINE, đơn hàng đã thanh toán
  if (order.paymentMethod === PaymentMethod.ONLINE.value) {
    return 'Đã thanh toán';
  }

  // Nếu phương thức là COD + PickUp và chờ lấy hàng hoặc đang chuẩn bị => Đã thanh toán
  if (
    (order.paymentMethod === PaymentMethod.COD.value &&
      order.status === OrderStatus.PROCESSING.value &&
      order.deliveryMethod === DeliveryMethod.PICK_UP.value) ||
    (order.paymentMethod === PaymentMethod.COD.value &&
      order.deliveryMethod === DeliveryMethod.PICK_UP.value &&
      order.status === OrderStatus.READY_FOR_PICKUP.value)
  ) {
    return 'Đã thanh toán';
  }

  // Nếu đơn hàng đang chờ thanh toán => Chưa thanh toán
  if (order.status === OrderStatus.AWAITING_PAYMENT.value) {
    return 'Chưa thanh toán';
  }

  // Nếu đơn hàng có ship (Delivery) nhưng phương thức là CODE thì chưa thanh toán
  if (
    order.paymentMethod == PaymentMethod.COD.value &&
    order.deliveryMethod == DeliveryMethod.DELIVERY.value
  ) {
    return 'Chưa thanh toán';
  }

  return 'Chưa thanh toán';
};
