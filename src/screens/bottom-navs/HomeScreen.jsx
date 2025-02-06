import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { OrderGraph } from '../../layouts/graphs'

const HomeScreen = (props) => {
  const navigation = props.navigation
  return (
    <View>
      <Text>HomeScreen</Text>
      <Pressable onPress={() => navigation.navigate(OrderGraph.OrderHistoryScreen)}>
        <Text>Đơn hàng</Text>
      </Pressable>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})