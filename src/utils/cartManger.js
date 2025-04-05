export const cartManager = cart => {
  const pickupOrder = {
    deliveryMethod: cart.deliveryMethod,
    fulfillmentDateTime: cart.fulfillmentDateTime,
    note: cart.note,
    totalPrice: cart.totalPrice,
    paymentMethod: cart.paymentMethod,
    store: cart.store,
    voucher: cart.voucher,
    orderItems: cart.orderItems.map(item => ({
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

  const addToCart = async (
    product,
    variant,
    selectedToppings,
    price,
    quantity,
  ) => {
    try {
      // Không sắp xếp toppings nữa
      const toppingItems = selectedToppings || [];
      const existingIndex = cart.orderItems.findIndex(
        item =>
          item.productId === product._id &&
          item.variant === variant?._id &&
          JSON.stringify(item.toppingItems || []) ===
            JSON.stringify(toppingItems),
      );

      if (existingIndex !== -1) {
        cart.orderItems[existingIndex].quantity += quantity;
      } else {
        cart.orderItems.push({
          variant: variant?._id || null,
          quantity: quantity,
          price: price,
          toppingItems: toppingItems,
          itemId: new Date().getTime(),
          productId: product._id,
          productName: product.name,
          variantName: variant?.size || '',
          image: product.image,
          isVariantDefault: product.variant.length === 1,
        });
      }

      // Cập nhật giá tổng sau khi thêm món
      cart.totalPrice += price * quantity;

      return cart;
    } catch (error) {
      console.error('Lỗi khi thêm món vào giỏ hàng:', error);
      throw error; // Bạn có thể ném lại lỗi để xử lý ở nơi khác
    }
  };
};
