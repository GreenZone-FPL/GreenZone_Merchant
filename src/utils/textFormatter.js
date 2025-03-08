export const TextFormatter = {
  // Định dạng số lượng, đảm bảo số lượng tối thiểu có 2 chữ số.
  formatQuantity(quantity) {
    return quantity === 0 ? '0' : String(quantity).padStart(2, '0');
  },

  // Định dạng văn bản số lượng sản phẩm.
  formatTextProduct(quantity) {
    return quantity > 1 ? `${quantity} products` : `${quantity} product`;
  },

  // Định dạng tiền tệ theo đơn vị VND.
  formatCurrency(amount) {
    return amount
      .toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})
      .replace(/\s₫/, '₫');
  },

  // Định dạng ngày tháng (YYYY-MM-DD HH:mm:ss).
  formatDate(date) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
  // Trả về chuỗi theo định dạng: "h/m/d/m/y"
  formatDateTime(dateString) {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${hours}:${formattedMinutes}/${formattedDay}/${formattedMonth}/${year}`;
  },
};

function pad(value) {
  return String(value).padStart(2, '0');
}
