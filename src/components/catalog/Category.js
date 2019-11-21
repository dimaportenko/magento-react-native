import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  View,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  addFilterData,
  getProductsForCategoryOrChild,
  setCurrentProduct,
  updateProductsForCategoryOrChild,
} from '../../actions';
import { ProductList, HeaderIcon } from '../common';
import NavigationService from '../../navigation/NavigationService';
import {
  NAVIGATION_HOME_PRODUCT_PATH,
} from '../../navigation/routes';
import { ThemeContext } from '../../theme';

const Category = ({
  canLoadMoreContent,
  loadingMore,
  products,
  totalCount,
  sortOrder, // Add its validation in prop-types
  priceFilter, // Add its validation in prop-types
  category,
  refreshing,
  navigation,
  currencySymbol,
  currencyRate,
  addFilterData: _addFilterData,
  getProductsForCategoryOrChild: _getProductsForCategoryOrChild,
  setCurrentProduct: _setCurrentProduct,
  updateProductsForCategoryOrChild: _updateProductsForCategoryOrChild,
}) => {
  const theme = useContext(ThemeContext);
  const [gridColumnsValue, setGridColumnsValue] = useState(true);

  useEffect(() => {
    _addFilterData({ categoryScreen: true });
    _getProductsForCategoryOrChild(category);
    navigation.setParams({ changeGridValueFunction });
  }, []);

  const onRowPress = (product) => {
    _setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name,
    });
  };

  const onRefresh = () => {
    _updateProductsForCategoryOrChild(category, true);
  };

  const onEndReached = () => {
    console.log('On end reached called!');
    console.log(loadingMore, totalCount, canLoadMoreContent);
    if (!loadingMore && canLoadMoreContent) {
      _getProductsForCategoryOrChild(category, products.length, sortOrder, priceFilter);
    }
  };

  const performSort = (_sortOrder) => {
    _addFilterData(_sortOrder);
    _getProductsForCategoryOrChild(category, null, _sortOrder, priceFilter);
  };

  const changeGridValueFunction = () => setGridColumnsValue(!gridColumnsValue);

  return (
    <View style={styles.containerStyle(theme)}>
      <ProductList
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
        products={products}
        onEndReached={onEndReached}
        canLoadMoreContent={canLoadMoreContent}
        onRowPress={onRowPress}
        navigation={navigation}
        gridColumnsValue={gridColumnsValue}
        performSort={performSort}
        sortOrder={sortOrder}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
      />
    </View>
  );
};

Category.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.title.toUpperCase(),
  headerBackTitle: ' ',
  headerRight: (<HeaderIcon changeGridValueFunction={navigation.getParam('changeGridValueFunction')} />),
});

const styles = {
  containerStyle: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
};

Category.propTypes = {
  canLoadMoreContent: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  products: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.bool]),
  totalCount: PropTypes.number.isRequired,
  category: PropTypes.object,
  refreshing: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  currencyRate: PropTypes.number.isRequired,
  addFilterData: PropTypes.func.isRequired,
  getProductsForCategoryOrChild: PropTypes.func.isRequired,
  setCurrentProduct: PropTypes.func.isRequired,
  updateProductsForCategoryOrChild: PropTypes.func.isRequired,
};

Category.defaultProps = {};

const mapStateToProps = (state) => {
  const { category } = state.category.current;
  const {
    products, totalCount, loadingMore, refreshing,
  } = state.category;
  const {
    currency: {
      displayCurrencySymbol: currencySymbol,
      displayCurrencyExchangeRate: currencyRate,
    },
  } = state.magento;
  const { priceFilter, sortOrder } = state.filters;
  const canLoadMoreContent = products.length < totalCount;

  return {
    category,
    products,
    totalCount,
    canLoadMoreContent,
    loadingMore,
    refreshing,
    priceFilter,
    sortOrder,
    currencySymbol,
    currencyRate,
  };
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  updateProductsForCategoryOrChild,
  setCurrentProduct,
  addFilterData,
})(Category);
