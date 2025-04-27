import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppContainer } from './src/containers/useAppContainer';
import { AppContextProvider, useAppContext } from './src/context/appContext';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs()
function App() {
  return (
    <AppContextProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <FlashMessage position="top" />
      </SafeAreaProvider>
    </AppContextProvider>
  );
}

const AppNavigator = () => {
  const { authState} = useAppContext();
 
  const {loadingSplash} = useAppContainer()

  // Show splash screen while loading or checking token
  if (loadingSplash) {
    return <SplashScreen />;
  }

  // After the token check, show the appropriate screen
  return authState.needAuthen ? <LoginScreen /> : <MainNavigation />;
};

export default App;
