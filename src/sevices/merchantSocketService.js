class MerchantSocketService {
  constructor() {
    this.socket = null;
  }

  async initialize() {
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
          console.log('New Order:', data);
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
   * Lắng nghe sự kiện từ server
   * @param {string} event - Tên sự kiện
   * @param {function} callback - Hàm xử lý khi sự kiện xảy ra
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn(`⚠️ Socket chưa được khởi tạo, không thể lắng nghe sự kiện: ${event}`);
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
      console.warn(`⚠️ Socket chưa được khởi tạo, không thể huỷ lắng nghe sự kiện: ${event}`);
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
