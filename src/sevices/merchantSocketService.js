import { AppAsyncStorage } from "../utils";
import io from 'socket.io-client'

class MerchantSocketService {
  constructor() {
    this.socket = null;
  }

  async initialize(callback) {
    if (!this.socket) {
      try {
        const token = await AppAsyncStorage.readData(
          AppAsyncStorage.STORAGE_KEYS.accessToken,
        );
        const storeId = await AppAsyncStorage.readData('storeId');

        console.log('Token:', token);
        console.log('storeId:', storeId);

        if (!token || !storeId) {
          console.log(
            'Không tìm thấy token hoặc storeId, không thể kết nối socket!',
          );
          return;
        }

        this.socket = io('https://greenzone.motcaiweb.io.vn', {
          path: '/socket.io/',
          transports: ['websocket'],
          auth: { token },
        });

        this.socket.on('connect', () => {
          console.log('Merchant connected', this.socket.id);
          this.socket.emit('store.join', storeId);
          console.log(`Merchant joined store room: ${storeId}`);
        });

        this.socket.on('order.new', (data) => {
          console.log('📩 Received new order:', data);
          /**
           New Order: {"message": "📦 Đơn hàng mới #67e036a784526a4a39d6509e cần xử lý trước
           3/18/2025, 9:28:15 PM", "orderId": "67e036a784526a4a39d6509e", "storeId": "67b68d7698c1fc822e49fabd"}
           */
           if(callback){
            callback(data);
            console.log('✅ Callback executed');
          } else {
            console.log('⚠️ Callback is undefined');
          }
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected');
        });

        this.socket.on('connect_error', (error) => {
          console.log('Lỗi kết nối:', error);
        });
      } catch (error) {
        console.log('Lỗi khi khởi tạo socket:', error);
      }
    }
  }

  /**
   * Hủy lắng nghe sự kiện
   * @param {string} event - Tên sự kiện
   * @param {function} callback - Hàm callback đã đăng ký trước đó (tuỳ chọn)
   */
  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    } else {
      console.log(`⚠️ Socket chưa được khởi tạo, không thể huỷ lắng nghe sự kiện: ${event}`);
    }
  }

  /**
   * Ngắt kết nối socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('❌ Socket đã ngắt kết nối');
    }
  }
}

export default new MerchantSocketService();
