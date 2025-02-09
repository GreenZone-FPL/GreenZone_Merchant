/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthGraph, MainGraph, OrderGraph } from './src/layouts/graphs';
import LoginScreen from './src/screens/auth/LoginScreen';
import MainNavigation from './src/layouts/MainNavigation';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
const BaseStack = createNativeStackNavigator();
function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer>
          <BaseStack.Navigator screenOptions={{ headerShown: false }}>
            <BaseStack.Screen
              name={MainGraph.graphName}
              component={MainNavigation}
            />
            <BaseStack.Screen
              name={AuthGraph.LoginScreen}
              component={LoginScreen}
            />
            <BaseStack.Screen
              name={OrderGraph.OrderDetailScreen}
              component={OrderDetailScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'transparentModal',
                headerShown: false,
              }}
            />

          </BaseStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>

  );
}

export default App;
