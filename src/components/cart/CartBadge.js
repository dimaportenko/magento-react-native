import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import IconBadge from 'react-native-icon-badge';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_CART_PATH } from '../../navigation/routes';

class CartBadge extends Component {
  onPress() {
    NavigationService.navigate(NAVIGATION_CART_PATH, {
      title: 'Cart'
    });
  }

  render() {
    return (
      <IconBadge
        MainElement={
          <View style={styles.iconWrapper}>
            <Icon name="md-cart" type="ionicon" color={this.props.color} />
          </View>
        }
        BadgeElement={
          <Text style={styles.textStyle}>{this.props.itemsCount}</Text>
        }
        IconBadgeStyle={styles.iconBadgeStyle}
        Hidden={this.props.itemsCount === 0}
      />
    );
  }
}

const styles = {
  textBackground: {
    backgroundColor: '#999',
    height: 15,
    width: 15,
    borderRadius: 15,
    marginLeft: 23
  },
  textStyle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  iconWrapper: {
    marginTop: 5,
    marginRight: 10
  },
  iconBadgeStyle: {
    minWidth: 15,
    height: 15,
    backgroundColor: 'red'
  }
};

const mapStateToProps = ({ cart }) => {
  const itemsCount = cart.quote && cart.quote.items_qty ? cart.quote.items_qty : 0;
  return { itemsCount };
};

export default connect(mapStateToProps)(CartBadge);
