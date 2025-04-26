import {DeliveryMethod, PaymentMethod} from '../constants';

export const CartManager = (() => {
  return {
    // Hàm tạo giỏ hàng và orderItem
    createOrder: function (
      selectedProduct,
      selectedSize,
      selectedToppings,
      prevCart,
      merchant,
      cart,
    ) {
      // Tính tổng giá topping, nhân với số lượng topping
      const totalToppingPrice = (selectedToppings || []).reduce(
        (total, topping) =>
          total + (topping.extraPrice || 0) * (topping.quantity || 1),
        0,
      );

      // Tổng giá sản phẩm = giá sản phẩm + tổng giá topping
      const totalProductPrice = selectedSize.sellingPrice + totalToppingPrice;

      // Tạo orderItem
      const newItem = {
        _id: Date.now().toString(),
        variant: selectedSize._id,
        quantity: selectedProduct.quantity,
        price: totalProductPrice || 0,
        toppingItems: selectedToppings || [],
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        variantName: selectedSize.size,
        image: selectedProduct.image,
        isVariantDefault: false,
        selectedProduct: selectedProduct,
        selectedSize: selectedSize,
        selectedToppings: selectedToppings,
      };

      if (!newItem) return prevCart;

      if (
        !prevCart ||
        !prevCart.orderItems ||
        prevCart.orderItems.length === 0
      ) {
        return {
          _id: Date.now().toString(),
          deliveryMethod: DeliveryMethod.PICK_UP.value,
          fulfillmentDateTime: new Date().toISOString(),
          note: null,
          totalPrice: 0,
          paymentMethod: PaymentMethod.COD.value,
          shippingAddress: null,
          store: merchant,
          owner: cart?.owner,
          voucher: null,
          orderItems: [newItem],
          consigneeName: cart?.consigneeName,
          consigneePhone: cart?.consigneePhone,
        };
      } else {
        const existingItemIndex = prevCart.orderItems.findIndex(
          item =>
            item.variant === newItem.variant &&
            JSON.stringify(item.toppingItems) ===
              JSON.stringify(newItem.toppingItems),
        );

        if (existingItemIndex !== -1) {
          // Nếu đã tồn tại, tăng số lượng và cập nhật lại totalPrice của orderItem đó
          const updatedOrderItems = [...prevCart.orderItems];
          const currentItem = updatedOrderItems[existingItemIndex];
          const newQuantity =
            currentItem.quantity + selectedProduct?.quantity || 1;
          updatedOrderItems[existingItemIndex] = {
            ...currentItem,
            quantity: newQuantity,
            totalPrice: newQuantity * currentItem.totalProductPrice, // Cập nhật lại tổng giá
          };

          const updatedTotalPrice = updatedOrderItems.reduce(
            (total, item) => total + item.totalPrice,
            0,
          );

          return {
            ...prevCart,
            orderItems: updatedOrderItems,
            totalPrice: updatedTotalPrice,
          };
        } else {
          // Nếu orderItem chưa tồn tại, thêm vào mảng orderItems và cập nhật tổng giá giỏ hàng
          const updatedTotalPrice =
            prevCart.orderItems.reduce(
              (total, item) => total + item.totalPrice,
              0,
            ) + newItem.totalPrice;

          return {
            ...prevCart,
            orderItems: [...prevCart.orderItems, newItem],
            totalPrice: updatedTotalPrice,
          };
        }
      }
    },

    // Hàm xác nhận thêm vào giỏ hàng
    confirmAddToCart: function (
      selectedProduct,
      selectedSize,
      selectedToppings,
      setSelectedProduct,
      setSelectedToppings,
      setSelectedSize,
      setOpenMenu,
      setCart,
      merchant,
      cart,
    ) {
      setCart(prevCart => {
        // Tính toán giá trị mới cho orderItem
        const totalToppingPrice = selectedToppings.reduce(
          (total, topping) =>
            total + (topping.extraPrice || 0) * topping.quantity,
          0,
        );
        const totalProductPrice = selectedSize.sellingPrice + totalToppingPrice;

        const newItem = {
          _id: Date.now().toString(),
          variant: selectedSize._id,
          quantity: selectedProduct?.quantity,
          price: totalProductPrice,
          toppingItems: selectedToppings.map(item => ({
            topping: item?._id,
            quantity: item?.quantity,
            price: item.extraPrice,
          })),
          product: selectedProduct,
          size: selectedSize,
          topping: selectedToppings,
          totalToppingPrice,
          totalProductPrice,
          totalPrice: totalProductPrice * (selectedProduct?.quantity || 1),
        };

        // Cập nhật giỏ hàng với newItem
        return this.createOrder(
          selectedProduct,
          selectedSize,
          selectedToppings,
          prevCart,
          merchant,
          cart,
        );
      });

      setTimeout(() => {
        setSelectedToppings([]);
        setSelectedSize(null);
        setSelectedProduct(null);
        setOpenMenu(false);
        updateTotalPrice(setCart);
      }, 300);
    },

    // Hàm thay đổi số lượng sản phẩm trong giỏ hàng
    changeProductQuantity: (product, number, setSelectedProduct) => {
      setSelectedProduct(prev => {
        if (prev) {
          const newQty = prev.quantity + number;
          if (newQty < 1 || newQty > 99) {
            return prev;
          }
          return {...prev, quantity: newQty};
        }
        return {...product, quantity: number};
      });
    },

    // Hàm thay đổi số lượng topping
    changeToppingQuantity: (topping, number, setSelectedToppings) => {
      setSelectedToppings(prev => {
        const existing = prev.find(t => t._id === topping._id);
        if (existing) {
          const newQty = existing.quantity + number;

          if (newQty > 3) {
            return prev;
          }
          if (newQty === 0) {
            const toppings = prev.filter(item => item._id !== topping._id);
            return toppings;
          }
          return prev.map(t =>
            t._id === topping._id ? {...t, quantity: newQty} : t,
          );
        } else if (number > 0) {
          return [...prev, {...topping, quantity: number}];
        }
        return prev;
      });
    },

    toggleTopping: (topping, setSelectedToppings) => {
      setSelectedToppings(prev => {
        const exists = prev.some(t => t._id === topping._id);

        if (exists) {
          return prev.filter(t => t._id !== topping._id);
        }

        if (prev.length >= 3) {
          return prev;
        }

        return [...prev, {...topping, quantity: 1}];
      });
    },

    // hàm update product ở cart qua dialogUpdateToping
    updateProduct: (orderItemUpdate, setCart) => {
      setCart(prev => {
        const orderItems = Array.isArray(prev.orderItems)
          ? prev.orderItems
          : [];
        const index = orderItems.findIndex(
          item => item._id === orderItemUpdate._id,
        );
        const newOrderItems =
          index !== -1
            ? orderItems.map(item =>
                item._id === orderItemUpdate._id ? orderItemUpdate : item,
              )
            : [...orderItems, orderItemUpdate];
        return {...prev, orderItems: newOrderItems};
      });
      updateTotalPrice(setCart);
    },
  };
})();

// ham cap nhap tong tien don hang
export const updateTotalPrice = setCart => {
  setCart(prev => {
    const total = prev?.orderItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let totalPrice = total;
    let voucherDiscountAmount = 0;
    if (prev?.voucherInfor) {
      if (prev?.voucherInfor?.discountType === 'percentage') {
        voucherDiscountAmount = total * (prev?.voucherInfor?.value / 100);
        totalPrice = total - voucherDiscountAmount;
      } else if (prev?.voucherInfor?.discountType === 'fixedAmount') {
        voucherDiscountAmount = prev?.voucherInfor?.value;
        totalPrice = total - voucherDiscountAmount;
      }
    }

    return {
      ...prev,
      totalPrice,
      voucherDiscountAmount,
    };
  });
};
