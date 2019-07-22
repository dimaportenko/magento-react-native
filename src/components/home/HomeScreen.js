import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, TouchableWithoutFeedback, Text, StyleSheet, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { MaterialHeaderButtons, Item } from '../common';
import {
  NAVIGATION_HOME_PRODUCT_PATH
} from '../../navigation/routes';
import { getHomeData, setCurrentProduct } from '../../actions';
import HomeSlider from './HomeSlider';
import FeaturedProducts from './FeaturedProducts';
import NavigationService from '../../navigation/NavigationService';
import Sizes from '../../constants/Sizes';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Magento React Native',
    headerBackTitle: ' ',
    headerLeft: (
      <MaterialHeaderButtons>
        <Item title="menu" iconName="menu" onPress={navigation.getParam('toggleDrawer')} />
      </MaterialHeaderButtons>
    ),
  });

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

  componentDidMount() {
    const { navigation } = this.props;
    if (this.props.slider.length === 0) {
      this.props.getHomeData();
    }
    navigation.setParams({ toggleDrawer: this.toggleDrawer });
  }

  toggleDrawer = () => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  }

  onProductPress = product => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name
    });
  };

  onRefresh = () => {
    this.props.getHomeData(true);
  };

  renderFeatured() {
    return _.map(this.props.featuredProducts, (value, key) => {
      return (
        <FeaturedProducts
          key={`featured${key}`}
          products={value}
          title={this.props.featuredCategories[key].title}
          onPress={this.onProductPress}
          currencySymbol={this.props.currencySymbol}
        />
      );
    });
  }

  render() {
    if (this.props.errorMessage) {
      return (
        <View style={styles.errorContainer}>
          <Text>{this.props.errorMessage}</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <HomeSlider slider={this.props.slider} />
        {this.renderFeatured()}
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const mapStateToProps = state => {
  const { refreshing } = state.home;
  const { errorMessage, currency } = state.magento;
  const { default_display_currency_symbol: currencySymbol } = currency;
  return { ...state.home, refreshing, errorMessage, currencySymbol };
};

export default connect(mapStateToProps, { getHomeData, setCurrentProduct })(HomeScreen);
