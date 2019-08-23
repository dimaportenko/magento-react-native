import React, { Component } from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import Sizes from '../../constants/Sizes';
import {
  getSearchProducts,
  addFilterData,
  resetFilters,
  setCurrentProduct,
} from '../../actions';
import { ProductList, HeaderIcon } from '../common';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_SEARCH_PRODUCT_PATH } from '../../navigation/routes';

class SearchScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Search',
    headerBackTitle: ' ',
    headerRight: (<HeaderIcon changeGridValueFunction={navigation.getParam('changeGridValueFunction')} />),
  });

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      gridColumnsValue: true,
    };
    this.getSearchProducts = _.debounce(this.props.getSearchProducts, 1000);
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ changeGridValueFunction: this.changeGridValueFunction });
  }

  onRowPress = (product) => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_SEARCH_PRODUCT_PATH, {
      title: product.name,
    });
  }

  onEndReached = () => {
    const {
      canLoadMoreContent,
      loadingMore,
      products,
    } = this.props;
    const { sortOrder, priceFilter } = this.props;

    if (!loadingMore && canLoadMoreContent) {
      this.props.getSearchProducts(this.state.input, products.length, sortOrder, priceFilter);
    }
  };

  updateSearch = (input) => {
    this.setState({ input }, () => {
      this.props.resetFilters();
      this.getSearchProducts(input, null, this.props.sortOrder, this.props.priceFilter);
    });
  };

  performSort = (sortOrder) => {
    this.props.addFilterData(sortOrder);
    this.props.getSearchProducts(this.state.input, null, sortOrder, this.props.priceFilter);
  };

  changeGridValueFunction = () => {
    this.setState({ gridColumnsValue: !this.state.gridColumnsValue });
  };

  renderContent = () => (
    <ProductList
      products={this.props.products}
      navigation={this.props.navigation}
      onEndReached={this.onEndReached}
      canLoadMoreContent={this.props.canLoadMoreContent}
      searchIndicator
      onRowPress={this.onRowPress}
      gridColumnsValue={this.state.gridColumnsValue}
      performSort={this.performSort}
      currencySymbol={this.props.currencySymbol}
    />
  );

  render() {
    const { searchInputStyle, containerStyle, searchStyle } = styles;
    const { input } = this.state;

    return (
      <View style={containerStyle}>
        <View style={searchInputStyle}>
          <SearchBar
            placeholder="Type here..."
            onChangeText={this.updateSearch}
            value={input}
            containerStyle={searchStyle}
            inputStyle={{ backgroundColor: '#DAE2EA' }}
            inputContainerStyle={{ backgroundColor: '#DAE2EA' }}
            showLoading={this.props.loadingMore}
          />
        </View>
        <View style={{ flex: 1 }}>
          {this.renderContent()}
        </View>
      </View>
    );
  }
}

const styles = {
  searchInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    paddingBottom: 5,
  },
  containerStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchStyle: {
    marginTop: 5,
    backgroundColor: '#DAE2EA',
    borderRadius: 25,
    alignSelf: 'center',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    height: 55,
    width: Sizes.WINDOW_WIDTH * 0.9,
  },
  notFoundTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  notFoundText: {
    textAlign: 'center',
  },
};

const mapStateToProps = ({ search, filters, magento }) => {
  const { sortOrder, priceFilter } = filters;
  const { products, totalCount, loadingMore } = search;
  const { default_display_currency_symbol: currencySymbol } = magento.currency;
  const canLoadMoreContent = products.length < totalCount;

  return {
    products, totalCount, canLoadMoreContent, loadingMore, sortOrder, priceFilter, currencySymbol,
  };
};


export default connect(mapStateToProps, {
  getSearchProducts,
  setCurrentProduct,
  resetFilters,
  addFilterData,
})(SearchScreen);
