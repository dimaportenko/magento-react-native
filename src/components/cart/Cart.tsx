import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ListRenderItemInfo,
  ViewStyle,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { cartItemProduct, refreshCart } from '../../actions';
import CartListItem from './CartListItem';
import NavigationService from '../../navigation/NavigationService';
import {
  NAVIGATION_CHECKOUT_PATH,
  NAVIGATION_HOME_SCREEN_PATH,
} from '../../navigation/routes';
import { Button, Text, Price } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { QuoteItemType } from '../../magento/types';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ cart, magento }: StoreStateType) => {
  const { products } = cart;
  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = magento;
  return {
    products,
    currencyRate,
    currencySymbol,
    cart: cart.quote,
    refreshing: cart.refreshing,
  };
};

const connector = connect(mapStateToProps, { cartItemProduct, refreshCart });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

type State = {};

class Cart extends Component<Props, State> {
  static contextType = ThemeContext;

  static navigationOptions = {
    title: translate('cart.title'),
    headerBackTitle: ' ',
  };

  static defaultProps = {
    cart: {},
    products: {},
    refreshing: false,
  };

  componentDidMount() {
    this.updateCartItemsProducts();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.cart.items &&
      this.props.cart.items &&
      prevProps.cart.items.length !== this.props.cart.items.length
    ) {
      this.updateCartItemsProducts();
    }
  }

  onPressAddToCheckout = () => {
    NavigationService.navigate(NAVIGATION_CHECKOUT_PATH, {
      title: translate('cart.title'),
    });
  };

  onRefresh = () => {
    this.props.refreshCart();
  };

  updateCartItemsProducts = () => {
    const { items } = this.props.cart;

    if (!items) {
      return;
    }

    const { products } = this.props;

    items.forEach(item => {
      if (!item.thumbnail) {
        if (!products[item.sku]) {
          this.props.cartItemProduct(item.sku);
        }
      }
    });
  };

  renderTotals() {
    const { items } = this.props.cart;

    let sum = 0;
    if (items) {
      items.forEach(item => {
        sum += item.price * item.qty;
      });
    }

    if (sum > 0) {
      return (
        <View style={sh.totalPriceContainer}>
          <Text type="heading">{`${translate('common.total')} `}</Text>
          <Price
            currencyRate={this.props.currencyRate}
            currencySymbol={this.props.currencySymbol}
            basePrice={sum}
          />
        </View>
      );
    }
  }

  renderEmptyCart = () => {
    const theme = this.context;
    const { navigate } = this.props.navigation;
    const { containerStyle, totals, buttonTextStyle } = styles;

    return (
      <View style={containerStyle(theme)}>
        <Text type="heading" style={totals(theme)}>
          {translate('cart.emptyMessage')}
        </Text>
        <TouchableOpacity onPress={() => navigate(NAVIGATION_HOME_SCREEN_PATH)}>
          <Text type="heading" bold style={buttonTextStyle(theme)}>
            {translate('common.continueShopping')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderItem = (items: ListRenderItemInfo<QuoteItemType>) => (
    <CartListItem
      item={items.item}
      currencyRate={this.props.currencyRate}
      currencySymbol={this.props.currencySymbol}
    />
  );

  renderCart = () => {
    const theme = this.context;
    const { items } = this.props.cart;
    const { container, footer, buttonStyle } = styles;

    const data = !!items ? [...items] : [];

    return (
      <View style={container(theme)}>
        <View style={sh.content}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            data={data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={footer(theme)}>
          {this.renderTotals()}
          <Button
            onPress={this.onPressAddToCheckout}
            style={buttonStyle(theme)}>
            {translate('cart.checkoutButton')}
          </Button>
        </View>
      </View>
    );
  };

  render() {
    const { items } = this.props.cart;

    if (items && items.length) {
      return this.renderCart();
    }
    return this.renderEmptyCart();
  }
}

const sh = StyleSheet.create({
  content: {
    flex: 1,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const styles = {
  container: (theme: ThemeType) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  containerStyle: (theme: ThemeType): ViewStyle => ({
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  totals: (theme: ThemeType) => ({
    paddingTop: theme.spacing.small,
  }),
  buttonTextStyle: (theme: ThemeType) => ({
    padding: theme.spacing.large,
    top: 0,
    color: theme.colors.secondary,
  }),
  footer: (theme: ThemeType): ViewStyle => ({
    padding: theme.spacing.large,
    flexDirection: 'row',
    justifyContent: 'space-around',
  }),
  buttonStyle: (theme: ThemeType) => ({
    width: theme.dimens.WINDOW_WIDTH * 0.5,
  }),
};

export default connector(Cart);
