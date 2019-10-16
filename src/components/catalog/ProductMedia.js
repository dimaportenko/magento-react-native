import React, { PureComponent } from 'react';
import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { magento } from '../../magento';
import { Spinner } from '../common';
import { ThemeContext } from '../../theme';

class ProductMedia extends PureComponent {
  static contextType = ThemeContext;

  renderMedia() {
    const { media } = this.props;

    if (!media) {
      return <Spinner />;
    }
    return (
      <Swiper
        showsPagination
        pagingEnabled
        autoplay={false}
      >
        {this.renderMediaItems()}
      </Swiper>
    );
  }

  renderMediaItems() {
    const theme = this.context;
    const { media } = this.props;

    return media.map((item) => {
      console.log('media item');
      console.log(magento.getProductMediaUrl() + item.file);
      return (
        <FastImage
          key={item.id}
          style={styles.imageStyle(theme)}
          resizeMode="contain"
          source={{ uri: magento.getProductMediaUrl() + item.file }}
        />
      );
    });
  }

  render() {
    const theme = this.context;
    return (
      <View style={styles.imageContainer(theme)}>
        {this.renderMedia()}
      </View>
    );
  }
}

const styles = {
  imageContainer: theme => ({
    height: theme.dimens.productDetailImageHeight,
  }),
  imageStyle: theme => ({
    height: (theme.dimens.productDetailImageHeight - 10),
    top: 0,
  }),
};

export default ProductMedia;
