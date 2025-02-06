/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthGraph, MainGraph } from './src/layouts/graphs';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';

const BaseStack = createNativeStackNavigator();
function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BaseStack.Navigator screenOptions={{headerShown: false}}>
        <BaseStack.Screen
            name={AuthGraph.LoginScreen}
            component={LoginScreen}
          />
          <BaseStack.Screen
            name={MainGraph.graphName}
            component={MainNavigation}
          />
        </BaseStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
