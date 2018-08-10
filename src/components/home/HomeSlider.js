import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { magento } from '../../magento';

const HomeSlider = (props) => {
  const renderMediaItems = () => {
    return props.slider.map((image, index) => {
      return (
        <Image
          key={index}
          style={styles.imageStyle}
          resizeMode="cover"
          source={{ uri: magento.getMediaUrl() + image }}
        />
      );
    });
  };

  return (
    <View style={[styles.imageContainer, props.style]}>
      <Swiper
        showsPagination
        pagingEnabled
        autoplay
      >
        {renderMediaItems()}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 200,
  },
  imageStyle: {
    height: 190,
    top: 0
  },
});

export default HomeSlider;
