import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';
import StatisticsScreen from '../../screens/bottom-navs/StatisticsScreen';
import { AuthGraph, BottomGraph } from '../graphs';



const StatisticsStack = createNativeStackNavigator();
const StatisticsStackScreen = () => {
  return (
    <StatisticsStack.Navigator
      screenOptions={{ headerShown: false }}>
      <StatisticsStack.Screen name={BottomGraph.StatisticsScreen} component={StatisticsScreen} />

      <StatisticsStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />

    </StatisticsStack.Navigator>
  );
};


export default StatisticsStackScreen
