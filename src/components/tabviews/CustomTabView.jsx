import {Tab, TabView} from '@rneui/themed';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {colors, GLOBAL_KEYS} from '../../constants';

const width = Dimensions.get('window').width;

const CustomTabViewPropTypes = {
  tabIndex: PropTypes.number.isRequired,
  setTabIndex: PropTypes.func.isRequired,
  tabBarConfig: PropTypes.shape({
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    titleStyle: PropTypes.object,
    indicatorStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    tabItemContainerStyle: PropTypes.object,
    titleActiveColor: PropTypes.string,
    titleInActiveColor: PropTypes.string,
    scrollable: PropTypes.bool,
  }),
  tabViewConfig: PropTypes.shape({
    tabViewContainerStyle: PropTypes.object,
    tabViewItemStyle: PropTypes.object,
  }),
  children: PropTypes.node,
  tabDescriptions: PropTypes.arrayOf(PropTypes.string), // Added prop for tab descriptions
};

export const CustomTabView = ({
  tabIndex = 0,
  setTabIndex = () => {},
  tabBarConfig = {
    titles: ['Tab 1', 'Tab 2', 'Tab 3'],
    titleStyle: {},
    indicatorStyle: {},
    containerStyle: {},
    tabItemContainerStyle: {},
    titleActiveColor: colors.primary,
    titleInActiveColor: colors.gray700,
    scrollable: false,
  },
  tabViewConfig = {
    tabViewContainerStyle: {},
    tabViewItemStyle: {},
  },
  children,
}) => {
  return (
    <>
      {/* Tab configuration */}
      <Tab
        value={tabIndex}
        onChange={e => setTabIndex(e)}
        indicatorStyle={[styles.indicatorStyle, tabBarConfig.indicatorStyle]}
        containerStyle={[styles.tabContainer, tabBarConfig.containerStyle]}
        variant="primary"
        scrollable={tabBarConfig.scrollable}>
        {tabBarConfig.titles.map((title, index) => (
          <Tab.Item
            key={index}
            title={title}
            titleStyle={[
              styles.titleStyle,
              {
                color:
                  index === tabIndex
                    ? tabBarConfig.titleActiveColor
                    : tabBarConfig.titleInActiveColor,
              },
              tabBarConfig.titleStyle,
            ]}
            containerStyle={[
              styles.tabItemContainer,
              tabBarConfig.tabItemContainerStyle,
            ]}
          />
        ))}
      </Tab>

      {/* TabView configuration */}
      <TabView
        value={tabIndex}
        onChange={setTabIndex}
        animationType="spring"
        containerStyle={[
          styles.tabViewContainer,
          tabViewConfig.tabViewContainerStyle,
        ]}>
        {children &&
          React.Children.map(children, (child, index) => (
            <TabView.Item
              key={`tab-view-${index}`}
              style={[styles.tabViewItem, tabViewConfig.tabViewItemStyle]}>
              {index === tabIndex && (
                <View style={{backgroundColor: colors.fbBg}}>
                  {child !== null && (
                    <View style={styles.tabDescriptionContainer}>
                      <Text style={[styles.tabDescriptionText, {width: '20%'}]}>
                        Phương thức
                      </Text>
                      <Text style={[styles.tabDescriptionText, {width: '30%'}]}>
                        Sản phẩm
                      </Text>
                      <Text style={[styles.tabDescriptionText, {width: '30%'}]}>
                        Khách hàng
                      </Text>
                      <Text style={[styles.tabDescriptionText, {width: '20%'}]}>
                        Trạng thái
                      </Text>
                    </View>
                  )}
                  {child}
                </View>
              )}
            </TabView.Item>
          ))}
      </TabView>
    </>
  );
};

CustomTabView.propTypes = CustomTabViewPropTypes;

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 3,
  },
  tabContainer: {
    backgroundColor: colors.white,
  },
  tabItemContainer: {
    backgroundColor: colors.white,
  },
  tabViewContainer: {
    backgroundColor: colors.green100,
  },
  tabViewItem: {
    backgroundColor: colors.white,
    width: '100%',
  },
  titleStyle: {
    color: colors.black,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  // Style for the description section
  tabDescriptionContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    width: width,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  tabDescriptionText: {
    color: colors.black,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    fontWeight: '500',
    textAlign: 'center',
    padding: 8,
  },
});
