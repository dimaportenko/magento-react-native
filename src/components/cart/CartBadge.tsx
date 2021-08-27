import React, { useContext } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import IconBadge from 'react-native-icon-badge';
import { Text } from '../common';
import { ThemeContext } from '../../theme';

const CartBadge = ({ color, itemsCount }) => {
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
  textStyle: theme => ({
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

CartBadge.propTypes = {
  color: PropTypes.string.isRequired,
  itemsCount: PropTypes.number,
};

CartBadge.defaultProps = {
  itemsCount: 0,
};

const mapStateToProps = ({ cart }) => {
  const itemsCount =
    cart.quote && cart.quote.items_qty ? cart.quote.items_qty : 0;
  return { itemsCount };
};

export default connect(mapStateToProps)(CartBadge);
