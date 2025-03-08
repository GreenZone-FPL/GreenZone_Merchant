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
