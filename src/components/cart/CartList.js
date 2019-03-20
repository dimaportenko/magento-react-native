import React, { Component } from 'react';
import { FlatList } from 'react-native';
import CartListItem from './CartListItem';

class CartList extends Component {

	renderItem(items) {
		return <CartListItem item={items.item} expanded={false} />;
	}

	render() {
		return (
				<FlatList
            data={this.props.items}
						renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
				/>
		);
	}
}

export default CartList;
