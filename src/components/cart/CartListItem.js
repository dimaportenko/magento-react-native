import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { magento } from '../../magento';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { Spinner } from '../common';
import { removeFromCartLoading, removeFromCart } from '../../actions';

class CartListItem extends Component {
	image() {
		const { products, item } = this.props;
		if (products[item.sku]) {
			return getProductThumbnailFromAttribute(products[item.sku]);
		}
	}

  onPressRemoveItem = () => {
    Alert.alert(
      'You sure?',
      `Just double-checking you wanted to remove the item: ${this.props.item.name}`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Remove it', onPress: () => this.performRemoveItem() },
      ],
      { cancelable: true }
    );
  };

  performRemoveItem() {
    this.props.removeFromCartLoading(true);

    this.props.removeFromCart({
      cart: this.props.cart,
      item: this.props.item
    });
  }

	render() {
		const {
			imageStyle,
			containerStyle,
			textStyle,
			infoStyle
		} = styles;
		return (
				<View style={containerStyle}>
					<Image style={imageStyle} resizeMode="contain" source={{ uri: this.image() }} />
					<View style={infoStyle}>
						<Text style={textStyle}>{this.props.item.name}</Text>
						<Text style={textStyle}>
							{magento.storeConfig.default_display_currency_code}
							{' '}
							{this.props.item.price}
						</Text>
						<Text style={textStyle}>Qty: {this.props.item.qty}</Text>
					</View>
          <View style={styles.removeContainer}>
            {this.props.cart.addToCartLoading ?
              <Spinner />
              :
              <TouchableOpacity
                style={styles.iconStyle}
                onPress={this.onPressRemoveItem}
              >
                <View style={styles.iconWrapper}>
                  <Icon
                    name="md-trash"
                    type="ionicon"
                  />
                </View>

              </TouchableOpacity>
            }
          </View>
				</View>
		);
	}
}

const styles = {
	containerStyle: {
		flexDirection: 'row',
		flex: 1,
		borderColor: '#ddd',
		borderBottomWidth: 1,
		backgroundColor: '#fff',
	},
	infoStyle: {
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 2
	},
	textStyle: {
		flex: 1,
		padding: 10
	},
	imageStyle: {
		height: 100,
		flex: 1,
		margin: 10,
		width: null
	},
  iconWrapper: {
    alignSelf: 'flex-end',
    marginRight: 20
  },
	removeContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
	},
};

const mapStateToProps = ({ cart }) => {
	const { products } = cart;
	return { products, cart };
};

export default connect(mapStateToProps, { removeFromCartLoading, removeFromCart })(CartListItem);
