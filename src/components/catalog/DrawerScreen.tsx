import React, { FC, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import {
  getProductsForCategoryOrChild,
  addFilterData,
  getSearchProducts,
} from '../../actions';
import { Button, Text, Input } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { StoreStateType } from '../../reducers';
import { FilterReducerType } from '../../reducers/FilterReducer';
import { CategoryType } from '../../magento/types';

const DrawerScreen: FC<{
  currencyRate: number;
  getProductsForCategoryOrChild: typeof getProductsForCategoryOrChild;
  addFilterData: typeof addFilterData;
  getSearchProducts: typeof getSearchProducts;
  filters: FilterReducerType;
  searchInput: string;
  category: CategoryType;
  navigation: any;
}> = props => {
  const [maxValue, setMaxValue] = useState('');
  const [minValue, setMinValue] = useState('');
  const theme = useContext(ThemeContext);

  const onApplyPressed = () => {
    const { currencyRate } = props;
    const priceFilter = {
      price: {
        condition: 'from,to',
        value: `${(minValue / currencyRate).toFixed(2)},${(
          maxValue / currencyRate
        ).toFixed(2)}`,
      },
    };
    props.addFilterData(priceFilter);
    if (props.filters.categoryScreen) {
      props.getProductsForCategoryOrChild(
        props.category,
        undefined,
        props.filters.sortOrder,
        priceFilter,
      );
      props.addFilterData({ categoryScreen: false });
    } else {
      props.getSearchProducts(
        props.searchInput,
        null,
        props.filters.sortOrder,
        priceFilter,
      );
    }
    props.navigation.closeDrawer();
  };

  const {
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
        <Text type="heading" style={textStyle(theme)}>
          Price:
        </Text>
        <Input
          containerStyle={minInputStyle}
          placeholder={translate('common.min')}
          value={minValue}
          keyboardType="numeric"
          onChangeText={minValue => setMinValue(minValue)}
        />
        <Text style={dashTextStyle(theme)}>-</Text>
        <Input
          containerStyle={maxInputStyle}
          value={maxValue}
          placeholder={translate('common.max')}
          keyboardType="numeric"
          onChangeText={maxValue => setMaxValue(maxValue)}
        />
      </View>
      <View style={styles.buttonStyleWrap}>
        <Button onPress={onApplyPressed} style={styles.buttonStyle}>
          {translate('common.apply')}
        </Button>
      </View>
    </View>
  );
};

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

const mapStateToProps = ({
  category,
  filters,
  search,
  magento,
}: StoreStateType) => {
  const currentCategory = category.current?.category;
  const { searchInput } = search;
  const {
    currency: { displayCurrencyExchangeRate: currencyRate },
  } = magento;
  return {
    filters,
    searchInput,
    currencyRate,
    category: currentCategory,
  };
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  addFilterData,
  getSearchProducts,
})(DrawerScreen);
