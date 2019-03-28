import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  NAVIGATION_CATEGORY_TREE_PATH,
  NAVIGATION_HOME_PRODUCT_PATH
} from '../../navigation/routes';
import { getHomeData, setCurrentProduct } from '../../actions';
import HomeSlider from './HomeSlider';
import FeaturedProducts from './FeaturedProducts';
import NavigationService from '../../navigation/NavigationService';
import { Button } from '../common';
import Sizes from '../../constants/Sizes';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Magento React Native',
    headerBackTitle: ' ',
  };

  static propTypes = {
    slider: PropTypes.array,
    getHomeData: PropTypes.func,
    navigation: PropTypes.object,
    featuredProducts: PropTypes.object,
    featuredCategories: PropTypes.object,
  };

  static defaultProps = {
    slider: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    if (this.props.slider.length === 0) {
      this.props.getHomeData();
    }
  }

  onProductPress = product => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name
    });
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.getHomeData();
    this.setState({ refreshing: false });
  };

  allCategories = () => {
    this.props.navigation.navigate(NAVIGATION_CATEGORY_TREE_PATH);
  };

  renderFeatured() {
    return _.map(this.props.featuredProducts, (value, key) => {
      return (
        <FeaturedProducts
          key={`featured${key}`}
          products={value}
          title={this.props.featuredCategories[key].title}
          onPress={this.onProductPress}
        />
      );
    });
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <HomeSlider slider={this.props.slider} />
        {this.renderFeatured()}
        <View style={styles.button}>
          <Button style={styles.buttonStyle} onPress={this.allCategories}>
            All Categories
          </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    padding: 10,
  },
  buttonStyle: {
    marginTop: 10,
    alignSelf: 'center',
    width: Sizes.WINDOW_WIDTH * 0.9,
    marginBottom: 3,
  }
});

const mapStateToProps = state => {
  return { ...state.home };
};

export default connect(mapStateToProps, { getHomeData, setCurrentProduct })(HomeScreen);
