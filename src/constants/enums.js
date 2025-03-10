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
  // dành cho đơn delivery, sản phẩm đã được chuẩn bị xong, và đang đợi nhân viên đem đi giao
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

  // Các trạng thái đảm bảo đơn hàng đã thanh toán
  const paidStatuses = [
    OrderStatus.COMPLETED.value,
    OrderStatus.SHIPPING_ORDER.value,
    OrderStatus.READY_FOR_PICKUP.value,
  ];

  // Nếu đơn hàng có trạng thái đã thanh toán
  if (paidStatuses.includes(order.status)) {
    return 'Đã thanh toán';
  }

  // Nếu phương thức thanh toán là ONLINE, đơn hàng đã thanh toán
  if (order.paymentMethod === PaymentMethod.ONLINE.value) {
    return 'Đã thanh toán';
  }

  // Nếu phương thức là COD và đơn hàng đang được xử lý => Đã thanh toán
  if (
    order.paymentMethod === PaymentMethod.COD.value &&
    order.status === OrderStatus.PROCESSING.value
  ) {
    return 'Đã thanh toán';
  }

  // Nếu đơn hàng đang chờ thanh toán => Chưa thanh toán
  if (order.status === OrderStatus.AWAITING_PAYMENT.value) {
    return 'Chưa thanh toán';
  }

  return 'Chưa thanh toán'; // Mặc định nếu không thuộc bất kỳ điều kiện nào
};
