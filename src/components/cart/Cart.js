import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import CartList from './CartList';
import { cartItemProduct } from '../../actions';

class Cart extends Component {
	static navigationOptions = {
		title: 'Cart',
		headerBackTitle: ' '
	};

	componentWillMount() {
		const { items } = this.props.cart;
		const { products } = this.props;

		items.forEach(item => {
			if (!item.thumbnail) {
				if (!products[item.sku]) {
					this.props.cartItemProduct(item.sku);
				}
			}
		});
	}

	onPressAddToCheckout() {

	}

	renderTotals() {
		const { items } = this.props.cart;

		let sum = 0;
		items.forEach(item => {
				sum += item.price * item.qty;
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
	const { cart, products } = state.cart;

	console.log('cart');
	console.log(cart);

	return { cart, products };
};

export default connect(mapStateToProps, { cartItemProduct })(Cart);
