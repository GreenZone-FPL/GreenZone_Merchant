import {OrderStatus} from '../../constants';
import axiosInstance from '../axiosInstance';

export const createPickUpOrder = async order => {
  try {
    const request = {
      deliveryMethod: order.deliveryMethod,
      fulfillmentDateTime: order.fulfillmentDateTime,
      note: order.note,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      store: order.store,
      owner: order.owner,
      voucher: order.voucher,
      orderItems: order.orderItems.map(item => ({
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        toppingItems: item.toppingItems.map(t => ({
          topping: t.topping,
          quantity: t.quantity,
          price: t.price,
        })),
      })),
    };
    const response = await axiosInstance.post('/v1/order/create', request);
    return response;
  } catch (error) {
    console.log('Lỗi gọi API Order', error);
    throw error;
  }
};

export const getOrders = async status => {
  try {
    const response = await axiosInstance.get(`/v1/order/store/all`, {
      params: {
        status: status,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Lỗi khi lấy lịch sử đơn hàng:', error);
    throw error;
  }
};

export const getOrderDetail = async orderId => {
  try {
    const responses = await axiosInstance.get(`/v1/order/${orderId}`);
    return responses.data;
  } catch (error) {
    console.log('Lỗi khi lấy chi tiết đơn hàng:', error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId,
  status,
  deliveryMethod,
  shipperId = null,
  cancelReason = null,
) => {
  try {
    const body = {status};

    if (status === OrderStatus.CANCELLED.value) {
      body.cancelReason = cancelReason;
    }

    if (
      deliveryMethod === 'delivery' &&
      status === 'readyForPickup' &&
      shipperId
    ) {
      body.shipper = shipperId;
    }

    const response = await axiosInstance.patch(
      `/v1/order/${orderId}/status`,
      body,
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};
