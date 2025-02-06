import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated from 'react-native-reanimated';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import {GLOBAL_KEYS, colors} from '../../constants';

const width = Dimensions.get('window').width;

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const CarouselComponent = props => {
  const {data, time, zoom = false, activeIndex, setActiveIndex} = props;

  const handleSnapToItem = useCallback(
    index => {
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  return (
    <View style={styles.container}>
      <Carousel
        loop={true}
        width={width - GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2}
        height={width / 2.5}
        autoPlay={true}
        data={data}
        scrollAnimationDuration={time}
        onSnapToItem={handleSnapToItem}
        renderItem={({item, index}) => (
          <Animated.View
            style={[
              styles.itemContainer,
              zoom && {transform: [{scale: activeIndex === index ? 1 : 0.7}]},
            ]}>
            <Image
              source={{uri: item.image}}
              style={styles.image}
              resizeMode="cover"
            />
          </Animated.View>
        )}
      />

      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export const ZoomCarousel = ({data, time}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <CarouselComponent
      data={data}
      time={time}
      zoom={true}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
    />
  );
};

export const ImageCarousel = ({data, time}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <CarouselComponent
      data={data}
      time={time}
      zoom={false}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT + GLOBAL_KEYS.PADDING_SMALL,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: GLOBAL_KEYS.PADDING_SMALL,
    width: '100%',
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  dot: {
    width: GLOBAL_KEYS.ICON_SIZE_SMALL,
    height: GLOBAL_KEYS.ICON_SIZE_SMALL / 3,
    backgroundColor: colors.gray200,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});
