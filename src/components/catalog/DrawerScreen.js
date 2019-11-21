import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  getProductsForCategoryOrChild, addFilterData, getSearchProducts,
} from '../../actions';
import { Button, Text, Input } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

class DrawerScreen extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    currencyRate: PropTypes.number,
  };

  static defaultProps = {
    currencyRate: 1,
  };

  state = {
    maxValue: '',
    minValue: '',
  };

  onApplyPressed = () => {
    const { currencyRate } = this.props;
    const priceFilter = {
      price: {
        condition: 'from,to',
        value: `${(this.state.minValue / currencyRate).toFixed(2)},${(this.state.maxValue / currencyRate).toFixed(2)}`,
      },
    };
    this.props.addFilterData(priceFilter);
    if (this.props.filters.categoryScreen) {
      this.props.getProductsForCategoryOrChild(this.props.category, null, this.props.filters.sortOrder, priceFilter);
      this.props.addFilterData({ categoryScreen: false });
    } else {
      this.props.getSearchProducts(this.props.searchInput, null, this.props.filters.sortOrder, priceFilter);
    }
    this.props.navigation.closeDrawer();
  };

  render() {
    const theme = this.context;
    const {
      buttonStyle,
      container,
      InputContainer,
      textStyle,
      minInputStyle,
      maxInputStyle,
      dashTextStyle,
    } = styles;

    return (
      <View style={container(theme)}>
        <View style={InputContainer(theme)}>
          <Text type="heading" style={textStyle(theme)}>Price:</Text>
          <Input
            containerStyle={minInputStyle}
            placeholder={translate('common.min')}
            value={this.state.minValue}
            keyboardType="numeric"
            onChangeText={minValue => this.setState({ minValue })}
          />
          <Text style={dashTextStyle(theme)}>-</Text>
          <Input
            containerStyle={maxInputStyle}
            value={this.state.maxValue}
            placeholder={translate('common.max')}
            keyboardType="numeric"
            onChangeText={maxValue => this.setState({ maxValue })}
          />
        </View>
        <View style={styles.buttonStyleWrap}>
          <Button onPress={this.onApplyPressed} style={styles.buttonStyle}>
            {translate('common.apply')}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: theme.colors.background,
  }),
  InputContainer: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.large,
  }),
  minInputStyle: {
    width: 50,
  },
  maxInputStyle: {
    width: 50,
  },
  textStyle: theme => ({
    paddingLeft: 50,
    paddingRight: theme.spacing.large,
  }),
  dashTextStyle: theme => ({
    paddingHorizontal: theme.spacing.large,
  }),
  buttonStyle: {
    width: '100%',
  },
  buttonStyleWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

const mapStateToProps = ({ category, filters, search, magento }) => {
  const currentCategory = category.current.category;
  const { searchInput } = search;
  const { currency: { displayCurrencyExchangeRate: currencyRate } } = magento;
  return {
    filters,
    searchInput,
    currencyRate,
    category: currentCategory,
  };
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild, addFilterData, getSearchProducts,
})(DrawerScreen);
