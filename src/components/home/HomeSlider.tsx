import React, { FC, useContext } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import { Text } from '../common';
import { magento } from '../../magento';
import { ThemeContext } from '../../theme';
import { HomeReducerType } from '../../reducers/HomeReducer';
import { ThemeType } from '../../theme/theme';

const HomeSlider: FC<{
  slider: HomeReducerType['slider'];
  style?: ViewStyle;
}> = ({ slider, style }) => {
  const theme = useContext(ThemeContext);

  const renderMediaItems = () =>
    slider?.map((slide, index) => (
      <View key={index} style={styles.slide}>
        <FastImage
          style={imageStyle(theme)}
          resizeMode="cover"
          source={{ uri: magento.getMediaUrl() + slide.image }}
        />
        <Text style={slideTitle(theme)}>{slide.title}</Text>
      </View>
    ));

  return (
    <View style={[imageContainer(theme), style]}>
      <Swiper showsPagination={false} pagingEnabled autoplay={false}>
        {renderMediaItems()}
      </Swiper>
    </View>
  );
};

const imageContainer = (theme: ThemeType) => ({
  height: theme.dimens.WINDOW_HEIGHT * 0.3,
});
const imageStyle = (theme: ThemeType) => ({
  height: theme.dimens.WINDOW_HEIGHT * 0.3,
  width: theme.dimens.WINDOW_WIDTH,
  top: 0,
});
const slideTitle = (theme: ThemeType): StyleProp<TextStyle> => ({
  marginTop: theme.dimens.WINDOW_HEIGHT * 0.1,
  marginLeft: theme.dimens.WINDOW_WIDTH * 0.2,
  marginRight: theme.dimens.WINDOW_WIDTH * 0.2,
  position: 'absolute',
  fontSize: 24,
  color: theme.colors.white,
  textAlign: 'center',
});

const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
  },
});

export default HomeSlider;
