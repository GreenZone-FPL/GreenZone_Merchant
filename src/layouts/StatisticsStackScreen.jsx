import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import StatisticsScreen from './MainNavigation';

const StatisticsStack = createNativeStackNavigator();
const StatisticsStackScreen = () => {
  return (
    <StatisticsStack.Navigator screenOptions={{headerShown: false}}>
      <StatisticsStack.Screen
        name={'StatisticsScreen'}
        component={StatisticsScreen}
      />
      <StatisticsStack.Screen name={'LoginScreen'} component={LoginScreen} />
    </StatisticsStack.Navigator>
  );
};

export default StatisticsStackScreen;
