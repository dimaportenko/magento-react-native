import React, { Component } from 'react';
import { ListView } from 'react-native';
import CartListItem from './CartListItem';

class CartList extends Component {
	componentWillMount() {
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	createDataSource({ items }) {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});

		this.dataSource = ds.cloneWithRows(items);
	}

	renderRow(item) {
		return <CartListItem item={item} expanded={false} />;
	}

	render() {
		return (
				<ListView
						enableEmptySections
						dataSource={this.dataSource}
						renderRow={this.renderRow}
				/>
		);
	}
}

export default CartList;
