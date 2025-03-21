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
        tabBarInactiveTintColor: colors.gray700,
        tabBarStyle: {
          backgroundColor: colors.fbBg,
        },
        tabBarLabelStyle: {
          fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
          fontWeight: '500',
        },
        tabBarIcon: ({color}) => {
          const iconSize = 31;
          let iconName = '';
          if (route.name === 'HomeScreen') {
            iconName = 'home';
          } else if (route.name === 'OrderHistoryScreen') {
            iconName = 'clock-time-two';
          } else if (route.name === 'StatisticsScreen') {
            iconName = 'chart-line-variant';
          }
          return <Icon source={iconName} color={color} size={iconSize} />;
        },
      })}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{tabBarLabel: ''}}
      />
      <Tab.Screen
        name="OrderHistoryScreen"
        component={OrderHistoryScreen}
        options={{tabBarLabel: ''}}
      />
      <Tab.Screen
        name="StatisticsScreen"
        component={StatisticsScreen}
        options={{tabBarLabel: ''}}
      />
    </Tab.Navigator>
  );
};

export default MainNavigation;
