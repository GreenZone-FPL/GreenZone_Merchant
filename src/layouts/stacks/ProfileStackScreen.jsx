import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/auth/LoginScreen';
import ProfileScreen from '../../screens/bottom-navs/ProfileScreen';
import { AuthGraph, BottomGraph, MainGraph } from '../graphs';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      name={MainGraph.ProfileStackScreen}
      screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name={BottomGraph.ProfileScreen}
        component={ProfileScreen}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
