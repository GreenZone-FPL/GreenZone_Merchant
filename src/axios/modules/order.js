import axiosInstance from '../axiosInstance';
import {OrderStatus} from '../../constants';
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
// export const getOrders = async status => {
//   try {
//     const url = status
//       ? `/v1/order/store/all?status=${status}`
//       : '/v1/order/store/all';

//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     console.log('error', error);
//     throw error;
//   }
// };

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
  shipperId,
) => {
  try {
    const body = {status};

    // Nếu là đơn "delivery" và chuyển sang "readyForPickup", thì cần shipper
    if (deliveryMethod === 'delivery' && status === 'readyForPickup') {
      body.shipper = shipperId;
    }

    const response = await axiosInstance.patch(
      `/v1/order/${orderId}/status`,
      body,
    );

    return response.data;
  } catch (error) {
    console.log('Lỗi API:', error.response?.data || error.message);
    throw error;
  }
};

// export const updateStatusOrder = async (orderId, status, shipper) => {
//   try {
//     const response = await axiosInstance.patch(`/v1/order/${orderId}/status`, {
//       status,
//       shipper,
//     });

//     console.log('Cập nhật trạng thái đơn hàng thành công:', response.data);
//     return response.data;
//   } catch (error) {
//     console.(
//       'Lỗi khi cập nhật trạng thái đơn hàng:',
//       error.response ? error.response.data : error.message,
//     );
//     throw error;
//   }
// };
