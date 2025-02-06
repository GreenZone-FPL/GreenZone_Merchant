import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { AuthGraph } from '../../layouts/graphs'

const ProfileScreen = (props) => {
  const navigation = props.navigation

  return (
    <View>
      <Text>ProfileScreen</Text>
      <Pressable onPress={() => navigation.navigate(AuthGraph.LoginScreen)}>
        <Text>Đăng xuất</Text>
      </Pressable>

    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})