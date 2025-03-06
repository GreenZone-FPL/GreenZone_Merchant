import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Notifications} from 'react-native-notifications';

class MyComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Đăng ký thông báo
    Notifications.registerRemoteNotifications();

    // Xử lý thông báo khi app đang mở (foreground)
    this.foregroundListener =
      Notifications.events().registerNotificationReceivedForeground(
        (notification, completion) => {
          console.log(`📩 Notification received in foreground:`, notification);
          completion({alert: true, sound: true, badge: false});
        },
      );

    // Xử lý khi người dùng nhấn vào thông báo
    this.openedListener = Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        console.log(`📨 Notification opened:`, notification.payload);
        completion();
      },
    );
  }

  componentWillUnmount() {
    // Hủy đăng ký lắng nghe sự kiện để tránh memory leak
    if (this.foregroundListener) {
      this.foregroundListener.remove();
    }
    if (this.openedListener) {
      this.openedListener.remove();
    }
  }

  render() {
    return (
      <View>
        <Text>🔔 React Native Notifications Demo</Text>
      </View>
    );
  }
}

export default MyComponent;
