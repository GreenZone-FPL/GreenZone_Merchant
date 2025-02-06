import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';
import HomeScreen from '../../screens/bottom-navs/HomeScreen';
import OrderHistoryScreen from '../../screens/order/OrderHistoryScreen';
import { AuthGraph, BottomGraph, OrderGraph } from '../graphs';



const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={BottomGraph.HomeScreen} component={HomeScreen} />

      <HomeStack.Screen name={AuthGraph.LoginScreen} component={LoginScreen} />
      <HomeStack.Screen name={OrderGraph.OrderHistoryScreen} component={OrderHistoryScreen} />
     
    </HomeStack.Navigator>
  );
};


export default HomeStackScreen;
