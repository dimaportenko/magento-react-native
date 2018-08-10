import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ListView, Text } from 'react-native';
import { getProductsForCategoryOrChild } from '../../actions/index';
import ProductListItem from './ProductListItem';
import { Spinner } from '../common';

class ProductList extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title.toUpperCase(),
		headerBackTitle: ' '
	});

	componentWillMount() {
		if (this.props.products) {
			this.createDataSource(this.props);
		}
		this.props.getProductsForCategoryOrChild(this.props.category);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	onEndReached() {
		const {
			canLoadMoreContent,
			loadingMore,
			products,
			category
		} = this.props;

		if (!loadingMore && canLoadMoreContent) {
			this.props.getProductsForCategoryOrChild(category, products.length);
		}
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

	renderFooter() {
		if (this.props.canLoadMoreContent) {
			return <Spinner style={{ padding: 15 }} />;
		}
	}

	renderContent() {
		if (!this.props.products) {
      return <Spinner />;
    }

		if (this.props.products.length) {
			return (
					<ListView
							enableEmptySections
							dataSource={this.dataSource}
							renderRow={this.renderRow}
							onEndReached={this.onEndReached.bind(this)}
							onEndReachedThreshold={10}
							renderFooter={this.renderFooter.bind(this)}
					/>
			);
		}

		return (
			<View style={styles.notFoundTextWrap}>
				<Text style={styles.notFoundText}>No products found</Text>
			</View>
		);
	}

	render() {
		return (
				<View style={styles.containerStyle}>
					{this.renderContent()}
				</View>
		);
	}
}

const styles = {
	containerStyle: {
		flex: 1,
		backgroundColor: '#fff',
	},
	notFoundTextWrap: {
		flex: 1,
		justifyContent: 'center',
	},
	notFoundText: {
		textAlign: 'center'
	},
};

const mapStateToProps = state => {
	const { category } = state.category.current;
	const { products, totalCount, loadingMore } = state.category;
	const canLoadMoreContent = products.length < totalCount;

	return { category, products, totalCount, canLoadMoreContent, loadingMore };
};

export default connect(mapStateToProps, { getProductsForCategoryOrChild })(ProductList);
