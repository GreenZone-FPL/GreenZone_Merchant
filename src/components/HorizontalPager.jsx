import React, { useRef } from 'react';
import { StyleSheet, View, Button, Image } from 'react-native';
import PagerView from 'react-native-pager-view';

const HorizontalPagerWithImages = () => {
  const pagerRef = useRef(null);

  const goToPage = (pageIndex) => {
    if (pagerRef.current) {
      pagerRef.current.setPage(pageIndex); // Di chuyển đến trang chỉ định (có animation)
    }
  };



  return (
    <View style={{ flex: 1 }}>
      <PagerView style={styles.pagerView} initialPage={0} ref={pagerRef}>

        {
          array.map((item, index) => {
            return (
              <View key={index + 1} style={styles.page}>
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )
          })
        }

      </PagerView>


    </View>
  );
};

const array = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqK7awHfreuNem8DGGseQd0eQ25VMbu96LqQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6SqCfVLKEyD1hZ6XZwxAnFtCHMH9CQ2DatQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkQoLOhGJZLvlLb2M_-2Np1Cny4mFUIHLFxPfhMmvwWSlTD--eDhJMdvFd7bz5MGS5KKE&usqp=CAU'
]

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 300
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default HorizontalPagerWithImages;
