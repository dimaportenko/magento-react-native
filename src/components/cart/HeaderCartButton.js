import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import IconBadge from 'react-native-icon-badge';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_CART_PATH } from '../../navigation/routes';

class HeaderCartButton extends Component {
  onPress() {
    NavigationService.navigate(NAVIGATION_CART_PATH, {
      title: 'Cart'
    });
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.iconStyle}
        onPress={this.onPress.bind(this)}
      >
        <IconBadge
          MainElement={
            <View style={styles.iconWrapper}>
              <Icon name="md-cart" type="ionicon" />
            </View>
          }
          BadgeElement={
            <Text style={styles.textStyle}>{this.props.itemsCount}</Text>
          }
          IconBadgeStyle={styles.iconBadgeStyle}
        />
      </TouchableOpacity>
    );
  }
}

const styles = {
  iconStyle: {
    height: 32,
    width: 40,
    margin: 5,
    paddingRight: 10,
    marginRight: 0
  },
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
    backgroundColor: '#999'
  }
};

const mapStateToProps = ({ cart }) => {
  const itemsCount = cart.quote ? cart.quote.items_qty : 0;
  return { itemsCount };
};

export default connect(mapStateToProps)(HeaderCartButton);
