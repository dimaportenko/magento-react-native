import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import CartList from './CartList';

class Cart extends Component {
	static navigationOptions = {
		title: 'Cart',
		headerBackTitle: ' '
	};

	onPressAddToCheckout() {

	}

	renderTotals() {
		const { items } = this.props.cart;

		let sum = 0;
		items.forEach(item => {
				sum += item.price;
		});

		return sum.toFixed(2);
	}

	render() {
		return (
				<View style={styles.container}>
					<View style={styles.content}>
						<CartList items={this.props.cart.items} />
						<Text>Totals {this.renderTotals()}</Text>
					</View>
					<View style={styles.footer}>
						<Button
								onPress={this.onPressAddToCheckout.bind(this)}
								title="Go to Checkout"
						/>
					</View>
				</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	content: {
		flex: 1
	},
	footer: {
		height: 50
	}
};

const mapStateToProps = (state) => {
	const { cart } = state.cart;

	console.log('cart');
	console.log(cart);

	return { cart };
};

export default connect(mapStateToProps)(Cart);
