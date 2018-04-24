import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { magento } from '../../magento';
import { Spinner } from '../common';


class ProductMedia extends Component {

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
    const { media } = this.props;

    return media.map(item => {
      console.log('media item');
      console.log(magento.getProductMediaUrl() + item.file);
      return (
        <Image
          key={item.id}
          style={styles.imageStyle}
          resizeMode="contain"
          source={{ uri: magento.getProductMediaUrl() + item.file }}
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.imageContainer}>
        {this.renderMedia()}
      </View>
    );
  }
}

const styles = {
  imageContainer: {
    height: 300,
  },
  imageStyle: {
    height: 290,
    top: 0
  },
};

const mapStateToProps = ({ product }) => {
  const { media } = product.current;

  return { media };
};

export default connect(mapStateToProps)(ProductMedia);
