import React, { FC, useContext } from 'react';
import { TextStyle, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { Icon } from 'react-native-elements';
import { IconBadge, Text } from '../common';
import { ThemeContext } from '../../theme';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ cart }: StoreStateType) => {
  const itemsCount =
    cart.quote && cart.quote.items_qty ? cart.quote.items_qty : 0;
  return { itemsCount };
};

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  color: string;
};

const CartBadge: FC<Props> = ({ color, itemsCount = 0 }) => {
  const theme = useContext(ThemeContext);

  return (
    <IconBadge
      MainElement={
        <View style={styles.iconWrapper}>
          <Icon name="md-cart" type="ionicon" color={color} />
        </View>
      }
      BadgeElement={<Text style={styles.textStyle(theme)}>{itemsCount}</Text>}
      IconBadgeStyle={styles.iconBadgeStyle}
      Hidden={itemsCount === 0}
    />
  );
};

const styles = {
  textStyle: (theme: ThemeType): TextStyle => ({
    color: theme.colors.white,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: theme.colors.transparent,
  }),
  iconWrapper: {
    marginTop: 5,
    marginRight: 10,
  },
  iconBadgeStyle: {
    minWidth: 15,
    height: 15,
    backgroundColor: 'red',
  },
};

export default connector(CartBadge);
