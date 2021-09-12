import React, { FC, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { Icon } from 'react-native-elements';
import { connect, ConnectedProps } from 'react-redux';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { Spinner, Text, Price } from '../common';
import { removeFromCartLoading, removeFromCart } from '../../actions';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { QuoteItemType } from '../../magento/types';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ cart }: StoreStateType) => {
  const { products } = cart;
  return {
    cart,
    products,
  };
};

const connector = connect(mapStateToProps, {
  removeFromCartLoading,
  removeFromCart,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  item: QuoteItemType;
  currencyRate: number;
  currencySymbol: string;
};

const CartListItem: FC<Props> = ({
  item,
  cart,
  products,
  currencyRate,
  currencySymbol,
  removeFromCartLoading: _removeFromCartLoading,
  removeFromCart: _removeFromCart,
}) => {
  const theme = useContext(ThemeContext);

  const image = () => {
    if (products && products[item.sku]) {
      return getProductThumbnailFromAttribute(products[item.sku]);
    }
  };

  const onPressRemoveItem = () => {
    Alert.alert(
      translate('cartListItem.removeItemDialogTitle'),
      `${translate('cartListItem.removeItemDialogMessage')}: ${item.name}`,
      [
        {
          text: translate('common.cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: translate('common.ok'), onPress: () => performRemoveItem() },
      ],
      { cancelable: true },
    );
  };

  const performRemoveItem = () => {
    _removeFromCartLoading(item.item_id);

    _removeFromCart({
      cart,
      item,
    });
  };

  const imageUri = image();

  return (
    <View style={styles.container(theme)}>
      <FastImage
        style={styles.imageStyle(theme)}
        resizeMode="contain"
        source={{ uri: imageUri }}
      />
      <View style={sh.infoStyle}>
        <Text style={styles.textStyle(theme)}>{item.name}</Text>
        <View style={styles.textStyle(theme)}>
          <Price
            basePrice={item.price}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        <Text style={styles.textStyle(theme)}>
          {`${translate('common.quantity')}: ${item.qty}`}
        </Text>
      </View>
      <View style={sh.removeContainer}>
        {cart.removingItemId === item.item_id ? (
          <View style={styles.spinnerWrapper(theme)}>
            <Spinner />
          </View>
        ) : (
          <TouchableOpacity onPress={onPressRemoveItem}>
            <View style={styles.iconWrapper(theme)}>
              <Icon name="md-trash" type="ionicon" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const sh = StyleSheet.create({
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 2,
  },
  removeContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 50,
  },
});

const styles = {
  container: (theme: ThemeType): ViewStyle => ({
    flexDirection: 'row',
    flex: 1,
    borderColor: theme.colors.border,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.surface,
  }),
  textStyle: (theme: ThemeType) => ({
    flex: 1,
    padding: theme.spacing.small,
  }),
  imageStyle: (theme: ThemeType): ImageStyle => ({
    marginVertical: theme.spacing.small,
    height: theme.dimens.cartItemImageHeight,
    flex: 1,
    width: undefined,
  }),
  iconWrapper: (theme: ThemeType): ViewStyle => ({
    alignSelf: 'flex-end',
    marginRight: theme.spacing.large,
  }),
  spinnerWrapper: (theme: ThemeType) => ({
    marginRight: theme.spacing.small,
  }),
};

export default connector(CartListItem);
