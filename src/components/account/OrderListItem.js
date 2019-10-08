import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../common';
import { NAVIGATION_ORDER_PATH } from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import { ThemeContext } from '../../theme';

const OrderListItem = ({
  item,
  currencySymbol,
}) => {
  const theme = useContext(ThemeContext);

  const openOrdersScreen = () => {
    NavigationService.navigate(NAVIGATION_ORDER_PATH, {
      item,
    });
  };

  return (
    <TouchableOpacity onPress={openOrdersScreen}>
      <View style={styles.container(theme)}>
        <Text bold>{`Order # ${item.increment_id}`}</Text>
        <Text type="label">{`Created: ${item.created_at}`}</Text>
        <Text type="label">
          {`Ship to ${item.customer_firstname} ${item.customer_lastname}`}
        </Text>
        <Text type="label">
          {`Order Total: ${currencySymbol} ${item.grand_total}`}
        </Text>
        <Text type="label">{`Status: ${item.status}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.dimens.borderRadius,
    marginTop: theme.spacing.small,
    padding: theme.spacing.small,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
  }),
});

OrderListItem.propTypes = {
  item: PropTypes.object.isRequired,
  currencySymbol: PropTypes.string.isRequired,
};

OrderListItem.defaultProps = {};

export default OrderListItem;
