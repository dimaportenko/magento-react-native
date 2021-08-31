import React, { Component } from 'react';
import { View, ViewStyle } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect, ConnectedProps } from 'react-redux';
import _, { DebouncedFunc } from 'lodash';
import {
  getSearchProducts,
  addFilterData,
  resetFilters,
  setCurrentProduct,
} from '../../actions';
import { ProductList, HeaderGridToggleIcon } from '../common';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_SEARCH_PRODUCT_PATH } from '../../navigation/routes';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { StoreStateType } from '../../reducers';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ search, filters, magento, ui }: StoreStateType) => {
  const { sortOrder, priceFilter } = filters;
  const { products, totalCount, loadingMore } = search;
  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = magento;
  const canLoadMoreContent = (products.length ?? 0) < (totalCount ?? 0);
  const { listTypeGrid } = ui;

  return {
    products,
    sortOrder,
    totalCount,
    loadingMore,
    priceFilter,
    currencyRate,
    listTypeGrid,
    currencySymbol,
    canLoadMoreContent,
  };
};

const connector = connect(mapStateToProps, {
  getSearchProducts,
  setCurrentProduct,
  resetFilters,
  addFilterData,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

type State = {
  input: string;
};

class SearchScreen extends Component<Props, State> {
  static contextType = ThemeContext;
  getSearchProducts: DebouncedFunc<PropsFromRedux['getSearchProducts']>;

  static navigationOptions = () => ({
    title: translate('search.title'),
    headerBackTitle: ' ',
    headerRight: () => <HeaderGridToggleIcon />,
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      input: '',
    };
    this.getSearchProducts = _.debounce(this.props.getSearchProducts, 1000);
  }

  onRowPress = (product: ProductType) => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_SEARCH_PRODUCT_PATH, {
      product,
      title: product.name,
    });
  };

  onEndReached = () => {
    const { canLoadMoreContent, loadingMore, products } = this.props;
    const { sortOrder, priceFilter } = this.props;

    if (!loadingMore && canLoadMoreContent) {
      this.props.getSearchProducts(
        this.state.input,
        products.length,
        sortOrder,
        priceFilter,
      );
    }
  };

  updateSearch = (input: string) => {
    this.setState({ input }, () => {
      this.props.resetFilters();
      this.getSearchProducts(
        input,
        null,
        this.props.sortOrder,
        this.props.priceFilter,
      );
    });
  };

  performSort = (sortOrder: number) => {
    this.props.addFilterData(sortOrder);
    this.props.getSearchProducts(
      this.state.input,
      null,
      sortOrder,
      this.props.priceFilter,
    );
  };

  renderContent = () => (
    <ProductList
      products={this.props.products}
      navigation={this.props.navigation}
      onEndReached={this.onEndReached}
      canLoadMoreContent={this.props.canLoadMoreContent}
      searchIndicator
      onRowPress={this.onRowPress}
      gridColumnsValue={this.props.listTypeGrid}
      performSort={this.performSort}
      currencySymbol={this.props.currencySymbol}
      currencyRate={this.props.currencyRate}
    />
  );

  render() {
    const theme = this.context;
    const { input } = this.state;

    return (
      <View style={containerStyle(theme)}>
        <SearchBar
          placeholder={translate('search.searchPlaceholderText')}
          onChangeText={this.updateSearch}
          value={input}
          containerStyle={searchStyle(theme)}
          inputStyle={inputStyle(theme)}
          inputContainerStyle={inputContainerStyle(theme)}
          showLoading={this.props.loadingMore}
        />
        <View style={{ flex: 1 }}>{this.renderContent()}</View>
      </View>
    );
  }
}

const containerStyle = (theme: ThemeType) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
});
const searchStyle = (theme: ThemeType): ViewStyle => ({
  backgroundColor: theme.colors.background,
  alignSelf: 'center',
  borderBottomWidth: 0,
  borderTopWidth: 0,
  height: theme.dimens.searchBarHeight,
  width: theme.dimens.WINDOW_WIDTH,
});
const inputContainerStyle = (theme: ThemeType) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.dimens.searchBarBorderRadius,
});
const inputStyle = (theme: ThemeType) => ({
  backgroundColor: theme.colors.surface,
  color: theme.colors.titleText,
});

export default connector(SearchScreen);
