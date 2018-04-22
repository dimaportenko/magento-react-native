import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import IconBadge from 'react-native-icon-badge';
import { goToScreen } from '../../actions';
import { NAVIGATION_CART_PATH } from '../../navigators/types';

class HeaderCartButton extends Component {

	onPress() {
		this.props.goToScreen({
			routeName: NAVIGATION_CART_PATH,
			params: { title: 'Cart' }
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
								<Icon name='md-cart' type='ionicon' />
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
		marginRight: 0,
	},
	textBackground: {
		backgroundColor: '#999',
		height: 15,
		width: 15,
		borderRadius: 15,
		marginLeft: 23,
	},
	textStyle: {
		color: '#fff',
		fontSize: 12,
		textAlign: 'center',
		backgroundColor: 'transparent'
	},
	iconWrapper: {
    marginTop: 5,
    marginRight: 10,
  },
	iconBadgeStyle: {
    minWidth: 15,
    height: 15,
    backgroundColor: '#999'
  }
};

const mapStateToProps = ({ cart }) => {
	const itemsCount = cart.cart ? cart.cart.items_qty : 0;
	return { itemsCount };
};

export default connect(mapStateToProps, { goToScreen })(HeaderCartButton);
