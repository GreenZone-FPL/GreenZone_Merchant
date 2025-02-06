import { Tab, TabView } from '@rneui/themed';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { colors, GLOBAL_KEYS } from '../../constants';

const CustomTabViewPropTypes = {
  tabIndex: PropTypes.number,
  setTabIndex: PropTypes.func,
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

/**
 *
 * Usage example
 *  <CustomTabView
      tabIndex={tabIndex}
      setTabIndex={setTabIndex}
      tabBarConfig={{
        titles: ['Tab A', 'Tab B', 'Tab C'],
      }}
    >
      <View>
        <Text>Đây là nội dung của Tab A</Text>
      </View>

      <View>
        <Text>Đây là nội dung của Tab B</Text>
      </View>

      <View>
        <Text>Đây là nội dung của Tab C</Text>
      </View>

    </CustomTabView>
 */

export const CustomTabView = ({
  tabIndex = 0,
  setTabIndex = () => { },
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
  children
}) => {
  return (
    <>
      {/* Tab configuration */}

      <Tab
        value={tabIndex}
        onChange={(e) => setTabIndex(e)}
        indicatorStyle={[styles.indicatorStyle, tabBarConfig.indicatorStyle]}
        containerStyle={[styles.tabContainer, tabBarConfig.containerStyle]}
        variant="primary"
        scrollable={tabBarConfig.scrollable}
      >
        {
          tabBarConfig.titles.map((title, index) => {
            return (
              <Tab.Item
                title={title}
                titleStyle={[
                  styles.titleStyle,
                  { color: index === tabIndex ? tabBarConfig.titleActiveColor : tabBarConfig.titleInActiveColor },
                  tabBarConfig.titleStyle
                ]}
                containerStyle={[styles.tabItemContainer, tabBarConfig.tabItemContainerStyle]}
              />
            )
          })
        }
      </Tab>

      {/* TabView configuration */}
      <TabView
        value={tabIndex}
        onChange={setTabIndex}
        animationType="spring"
        containerStyle={[styles.tabViewContainer, tabViewConfig.tabViewContainerStyle]}
      >
        {children &&
          React.Children.map(children, (child, index) => (
            <TabView.Item key={index} style={[styles.tabViewItem, tabViewConfig.tabViewItemStyle]}>
              {index === tabIndex && child}
            </TabView.Item>
          ))}
      </TabView>
    </>
  )
}

CustomTabView.propTypes = CustomTabViewPropTypes


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
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT
  }
})