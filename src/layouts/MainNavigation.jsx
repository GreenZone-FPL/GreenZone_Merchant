import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { Column } from '../components';
import { colors, GLOBAL_KEYS } from '../constants';
import HomeScreen from '../screens/main/HomeScreen';
import OrderHistoryScreen from '../screens/main/OrderHistoryScreen';
import StatisticsScreen from '../screens/main/StatisticsScreen';
import { AuthGraph } from './graphs';
const { width, height } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

const DrawerItems = ({ navigation, selectedScreen, setSelectedScreen }) => {
  const items = [
    { name: 'Home', screen: 'Home', icon: 'home' },
    { name: 'OrderHistory', screen: 'OrderHistory', icon: 'clock-time-two' },
    { name: 'Statistics', screen: 'Statistics', icon: 'chart-line-variant' },
  ];

  return items.map((item) => (
    <TouchableOpacity
      key={item.name}
      style={[styles.drawerButton, selectedScreen === item.screen && styles.selectedDrawerButton]}
      onPress={() => {
        setSelectedScreen(item.screen);
        navigation.navigate(item.screen); // Điều hướng tới màn hình đã chọn
        navigation.closeDrawer(); // Đóng Drawer sau khi chọn
      }}
    >
      <Icon
        source={item.icon}
        color={selectedScreen === item.screen ? colors.primary : colors.black}
        size={24}
      />
      <Text style={[styles.drawerButtonText, selectedScreen === item.screen && styles.selectedDrawerButtonText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ));
};

const CustomDrawerContent = ({ navigation }) => {
  const [selectedScreen, setSelectedScreen] = React.useState('Home');

  return (
    <SafeAreaView style={styles.drawerContent}>
      <Column style={styles.drawerItems}>
        <DrawerItems
          navigation={navigation}
          selectedScreen={selectedScreen}
          setSelectedScreen={setSelectedScreen}
        />
      </Column>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate(AuthGraph.LoginScreen)}>
        <Icon
          source="exit-to-app"
          color={colors.black}
          size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
        />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const MainNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fafafa',
          width: 240,
          height: height,  // Đảm bảo Drawer chiếm toàn bộ chiều cao màn hình
        },
        drawerActiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
          fontWeight: 'bold',
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Statistics" component={StatisticsScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fbBg,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: colors.fbBg,
    height: height,
  },
  drawerItems: {
    marginBottom: 20,
  },
  drawerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 12,
    marginVertical: 5,
    backgroundColor: colors.fbBg,
    borderRadius: 6,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  selectedDrawerButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.green700,
  },
  drawerButtonText: {
    color: colors.black,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    marginLeft: 10,
  },
  selectedDrawerButtonText: {
    color: colors.black,
  },
  logoutButton: {
    flexDirection: 'row',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: 12,
    backgroundColor: colors.transparent,
    borderRadius: 5,
    position: 'absolute',
    alignItems: 'center',
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    bottom: 40,
  },
  logoutButtonText: {
    color: colors.black,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    marginLeft: 10,
  },
});

export default MainNavigation;
