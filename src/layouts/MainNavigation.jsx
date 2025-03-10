import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-paper';
import HomeScreen from '../screens/main/HomeScreen';
import OrderHistoryScreen from '../screens/main/OrderHistoryScreen';
import StatisticsScreen from '../screens/main/StatisticsScreen';
import {colors, GLOBAL_KEYS} from '../constants';

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: {
          backgroundColor: colors.fbBg,
          height: 50,
        },
        tabBarLabelStyle: {
          fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER - 2,
          fontWeight: '500',
        },
        tabBarIcon: ({color, size}) => {
          let iconName = '';
          if (route.name === 'HomeScreen') {
            iconName = 'home';
          } else if (route.name === 'OrderHistoryScreen') {
            iconName = 'clock-time-two';
          } else if (route.name === 'StatisticsScreen') {
            iconName = 'chart-line-variant';
          }
          return <Icon source={iconName} color={color} size={size} />;
        },
      })}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{tabBarLabel: 'Trang Chủ'}}
      />
      <Tab.Screen
        name="OrderHistoryScreen"
        component={OrderHistoryScreen}
        options={{tabBarLabel: 'Đơn Hàng'}}
      />
      <Tab.Screen
        name="StatisticsScreen"
        component={StatisticsScreen}
        options={{tabBarLabel: 'Thống Kê'}}
      />
    </Tab.Navigator>
  );
};

export default MainNavigation;
