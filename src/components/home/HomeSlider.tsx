import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import { Text } from '../common';
import { magento } from '../../magento';
import { ThemeContext } from '../../theme';

const HomeSlider = ({ slider, style }) => {
  const theme = useContext(ThemeContext);

  const renderMediaItems = () =>
    slider.map((slide, index) => (
      <View key={index} style={styles.slide}>
        <FastImage
          style={styles.imageStyle(theme)}
          resizeMode="cover"
          source={{ uri: magento.getMediaUrl() + slide.image }}
        />
        <Text style={styles.slideTitle(theme)}>{slide.title}</Text>
      </View>
    ));

  return (
    <View style={[styles.imageContainer(theme), style]}>
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
  imageContainer: theme => ({
    height: theme.dimens.WINDOW_HEIGHT * 0.3,
  }),
  imageStyle: theme => ({
    height: theme.dimens.WINDOW_HEIGHT * 0.3,
    width: theme.dimens.WINDOW_WIDTH,
    top: 0,
  }),
  slide: {
    alignItems: 'center',
  },
  slideTitle: theme => ({
    marginTop: theme.dimens.WINDOW_HEIGHT * 0.1,
    marginLeft: theme.dimens.WINDOW_WIDTH * 0.2,
    marginRight: theme.dimens.WINDOW_WIDTH * 0.2,
    position: 'absolute',
    fontSize: 24,
    color: theme.colors.white,
    textAlign: 'center',
  }),
});

export default HomeSlider;
