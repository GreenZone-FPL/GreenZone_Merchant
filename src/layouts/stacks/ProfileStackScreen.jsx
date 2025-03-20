import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ProfileScreen from '../../screens/bottom-navs/ProfileScreen';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      name={'ProfileStackScreen'}
      screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name={'ProfileScreen'} component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
