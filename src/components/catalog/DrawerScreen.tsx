import React, { FC, useContext, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  getProductsForCategoryOrChild,
  addFilterData,
  getSearchProducts,
} from '../../actions';
import { Button, Text, Input } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

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

const connector = connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  addFilterData,
  getSearchProducts,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: any;
};

const DrawerScreen: FC<Props> = props => {
  const [maxValue, setMaxValue] = useState(0);
  const [minValue, setMinValue] = useState(0);
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
      if (props.category) {
        props.getProductsForCategoryOrChild(
          props.category,
          undefined,
          props.filters.sortOrder,
          priceFilter,
        );
      }
      props.addFilterData(false);
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

  const { container, InputContainer, textStyle, dashTextStyle } = styles;

  return (
    <View style={container(theme)}>
      <View style={InputContainer(theme)}>
        <Text type="heading" style={textStyle(theme)}>
          Price:
        </Text>
        <Input
          containerStyle={sh.minInputStyle}
          placeholder={translate('common.min')}
          value={minValue.toString(10)}
          keyboardType="numeric"
          onChangeText={minValue => setMinValue(Number.parseInt(minValue))}
        />
        <Text style={dashTextStyle(theme)}>-</Text>
        <Input
          containerStyle={sh.maxInputStyle}
          value={maxValue.toString(10)}
          placeholder={translate('common.max')}
          keyboardType="numeric"
          onChangeText={maxValue => setMaxValue(Number.parseInt(maxValue))}
        />
      </View>
      <View style={sh.buttonStyleWrap}>
        <Button onPress={onApplyPressed} style={sh.buttonStyle}>
          {translate('common.apply')}
        </Button>
      </View>
    </View>
  );
};

const sh = StyleSheet.create({
  minInputStyle: {
    width: 50,
  },
  maxInputStyle: {
    width: 50,
  },
  buttonStyle: {
    width: '100%',
  },
  buttonStyleWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

const styles = {
  container: (theme: ThemeType): ViewStyle => ({
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: theme.colors.background,
  }),
  InputContainer: (theme: ThemeType): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.large,
  }),
  textStyle: (theme: ThemeType) => ({
    paddingLeft: 50,
    paddingRight: theme.spacing.large,
  }),
  dashTextStyle: (theme: ThemeType) => ({
    paddingHorizontal: theme.spacing.large,
  }),
};

export default connector(DrawerScreen);
