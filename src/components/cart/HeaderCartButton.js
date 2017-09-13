import React, { Component } from 'react';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import { connect } from 'react-redux';
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
				<TouchableOpacity onPress={this.onPress.bind(this)}>
					<Image
							source={require('../../../resources/icons/shopping-cart.png')}
							style={styles.iconStyle}
					>
						<View style={styles.textBackground}>
								<Text style={styles.textStyle}>{this.props.itemsCount}</Text>
						</View>
					</Image>
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
		marginRight: 10,
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
	}
};

const mapStateToProps = ({ cart }) => {
	const itemsCount = cart.cart ? cart.cart.items_qty : 0;
	return { itemsCount };
};

export default connect(mapStateToProps, { goToScreen })(HeaderCartButton);
