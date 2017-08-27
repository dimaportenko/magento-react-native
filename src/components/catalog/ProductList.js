import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ListView } from 'react-native';
import { getProductsForCategory } from '../../actions/index';
import ProductListItem from './ProductListItem';
import { Spinner } from '../common';

class ProductList extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerBackTitle: ' '
	});

	componentWillMount() {
		console.log('componentWillMount');
		console.log(this.props);
		this.createDataSource(this.props);
		this.props.getProductsForCategory({
			id: this.props.category.id,
			magento: this.props.magento
		});
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	createDataSource({ products }) {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});

		this.dataSource = ds.cloneWithRows(products);
	}
	renderRow(product) {
		return <ProductListItem product={product} />;
	}

	renderContent() {
		if (this.props.products) {
			return (
					<ListView
							enableEmptySections
							dataSource={this.dataSource}
							renderRow={this.renderRow}
					/>
			);
		}

		return <Spinner />;
	}

	render() {
		return (
				<View>
					{this.renderContent()}
				</View>
		);
	}
}

const mapStateToProps = state => {
	const { category } = state.category.current;
	const { products, totalCount } = state.category;
	const { magento } = state;
	return { category, magento, products, totalCount };
};

export default connect(mapStateToProps, { getProductsForCategory })(ProductList);
