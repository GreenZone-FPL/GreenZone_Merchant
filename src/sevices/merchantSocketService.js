import {io} from 'socket.io-client';
import {AppAsyncStorage} from '../utils';
import mitt from 'mitt';

class MerchantSocketService {
  constructor() {
    this.socket = null;
    this.emitter = mitt(); // Tạo emitter để phát sự kiện
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
          auth: {token},
        });

        this.socket.on('connect', () => {
          console.log('Merchant connected', this.socket.id);
          this.socket.emit('store.join', storeId);
          console.log(`Merchant joined store room: ${storeId}`);
        });

        this.socket.on('order.new', data => {
          console.log('New Order:', data);
          this.emitter.emit('order.new', data);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected');
        });

        this.socket.on('connect_error', error => {
          console.log('Lỗi kết nối:', error);
        });
      } catch (error) {
        console.log('Lỗi khi khởi tạo socket:', error);
      }
    }
  }

  on(event, callback) {
    this.emitter.on(event, callback); // Đăng ký lắng nghe sự kiện
  }

  off(event, callback) {
    this.emitter.off(event, callback); // Hủy lắng nghe sự kiện
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('❌ Socket đã ngắt kết nối');
    }
  }
}

export default new MerchantSocketService();
