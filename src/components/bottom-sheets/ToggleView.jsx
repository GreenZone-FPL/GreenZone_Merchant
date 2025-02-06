import React, { useState } from "react";
import { Image, LayoutAnimation, Platform, RefreshControl, ScrollView, StyleSheet, Text, UIManager } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

// Kích hoạt LayoutAnimation trên Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ToggleView = () => {
  const [refreshing, setRefreshing] = useState(false);
  const isVertical = useSharedValue(0); // 0 = Horizontal, 1 = Vertical
  const [isVerticalState, setIsVerticalState] = useState(0); // State để cập nhật UI ngay lập tức

  // Toggle ngay lập tức khi kéo xuống, không chờ Refresh xong mới đổi
  const onRefresh = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newValue = isVertical.value === 0 ? 1 : 0;
    isVertical.value = newValue;
    setIsVerticalState(newValue); // Cập nhật UI ngay lập tức

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Animation cho container
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    flexDirection: isVertical.value ? "column" : "row",
    alignItems: isVertical.value ? "flex-start" : "center",
    justifyContent: "center",
  }));

  // Animation cho hình ảnh
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(isVertical.value ? 0 : -30) },
      { translateY: withSpring(isVertical.value ? -20 : 0) },
      { scale: withSpring(isVertical.value ? 1.1 : 1) },
    ],
    opacity: withSpring(isVertical.value ? 1 : 0.9),
  }));

  // Animation cho text
  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(isVertical.value ? 0 : 30) },
      { translateY: withSpring(isVertical.value ? 20 : 0) },
    ],
    opacity: withSpring(isVertical.value ? 1 : 0.9),
  }));

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Animated.View style={[styles.box, containerAnimatedStyle]}>
        {isVerticalState ? ( // Sử dụng isVerticalState thay vì isVertical.value
          // Khi isVertical = 1: Hiển thị view ngang chứa ảnh + "Deliver to"
          <Animated.View style={[styles.horizontalContainer, imageAnimatedStyle]}>
            <Image
              source={{ uri: "https://www.odtap.com/wp-content/uploads/2018/10/food-delivery.jpg" }}
              style={styles.image}
            />
            <Text style={styles.deliverText}>Deliver to</Text>
          </Animated.View>
        ) : (
          // Khi isVertical = 0: Hiển thị ảnh như cũ
          <Animated.Image
            source={{ uri: "https://www.odtap.com/wp-content/uploads/2018/10/food-delivery.jpg" }}
            style={[styles.image, imageAnimatedStyle]}
          />
        )}

        <Animated.Text style={[styles.text, textAnimatedStyle]}>
          Hello, React Native!
        </Animated.Text>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#ddd",
    padding: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  deliverText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default ToggleView;
