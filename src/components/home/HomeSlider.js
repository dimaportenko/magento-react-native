import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Image, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import { magento } from '../../magento';
import Sizes from '../../constants/Sizes';

const HomeSlider = props => {
  const renderMediaItems = () => {
    return props.slider.map((slide, index) => {
      return (
        <View key={index} style={styles.slide}>
          <Image
            style={styles.imageStyle}
            resizeMode="cover"
            source={{ uri: magento.getMediaUrl() + slide.image }}
          />
          <Text style={styles.slideTitle}>{slide.title}</Text>
        </View>
      );
    });
  };

  return (
    <View style={[styles.imageContainer, props.style]}>
      <Swiper showsPagination={false} pagingEnabled autoplay={false}>
        {renderMediaItems()}
      </Swiper>
    </View>
  );
};

HomeSlider.propTypes = {
  slider: PropTypes.array,
  style: PropTypes.object,
};

HomeSlider.defaultProps = {
  slider: [],
  style: {},
};

const styles = StyleSheet.create({
  imageContainer: {
    height: Sizes.WINDOW_HEIGHT * 0.3,
  },
  imageStyle: {
    height: Sizes.WINDOW_HEIGHT * 0.3,
    width: Sizes.WINDOW_WIDTH,
    top: 0,
  },
  slide: {
    alignItems: 'center',
  },
  slideTitle: {
    marginTop: Sizes.WINDOW_HEIGHT * 0.1,
    marginLeft: Sizes.WINDOW_WIDTH * 0.2,
    marginRight: Sizes.WINDOW_WIDTH * 0.2,
    position: 'absolute',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
});

export default HomeSlider;
