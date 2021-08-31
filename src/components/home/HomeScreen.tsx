import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import _ from 'lodash';
import { MaterialHeaderButtons, Text, Item } from '../common';
import { NAVIGATION_HOME_PRODUCT_PATH } from '../../navigation/routes';
import { getHomeData, setCurrentProduct } from '../../actions';
import HomeSlider from './HomeSlider';
import CurrencyPicker from './CurrencyPicker';
import FeaturedProducts from './FeaturedProducts';
import NavigationService from '../../navigation/NavigationService';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { StoreStateType } from '../../reducers';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = (state: StoreStateType) => {
  const {
    errorMessage,
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = state.magento;
  return {
    ...state.home,
    errorMessage,
    currencySymbol,
    currencyRate,
  };
};

const connector = connect(mapStateToProps, { getHomeData, setCurrentProduct });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

type State = {};

class HomeScreen extends Component<Props, State> {
  static contextType = ThemeContext;

  static navigationOptions = ({ navigation }: { navigation: any }) => ({
    title: translate('home.title'),
    headerBackTitle: ' ',
    headerLeft: () => (
      <MaterialHeaderButtons>
        <Item
          title="menu"
          iconName="menu"
          onPress={navigation.getParam('toggleDrawer')}
        />
      </MaterialHeaderButtons>
    ),
    headerRight: () => <CurrencyPicker />,
  });

  componentDidMount() {
    const { navigation } = this.props;
    if (this.props.slider?.length === 0) {
      this.props.getHomeData();
    }
    navigation.setParams({ toggleDrawer: this.toggleDrawer });
  }

  toggleDrawer = () => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  };

  onProductPress = (product: ProductType) => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      product,
      title: product.name,
    });
  };

  onRefresh = () => {
    this.props.getHomeData(true);
  };

  renderFeatured() {
    return _.map(this.props.featuredProducts, (value, key) => (
      <FeaturedProducts
        key={`featured${key}`}
        products={value}
        title={this.props.featuredCategories[key].title}
        onPress={this.onProductPress}
        currencySymbol={this.props.currencySymbol}
        currencyRate={this.props.currencyRate}
      />
    ));
  }

  render() {
    const theme = this.context;

    if (this.props.errorMessage) {
      return (
        <View style={styles.errorContainer}>
          <Text>{this.props.errorMessage}</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={container(theme)}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <HomeSlider slider={this.props.slider} />
        {this.renderFeatured()}
      </ScrollView>
    );
  }
}

const container = (theme: ThemeType) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
});

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connector(HomeScreen);
