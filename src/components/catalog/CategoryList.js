import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Platform,
} from 'react-native';
import {
  getProductsForCategoryOrChild,
  setCurrentProduct,
} from '../../actions';
import { ProductList } from '../common/ProductList';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_HOME_PRODUCT_PATH } from '../../navigation/routes';


class CategoryList extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title.toUpperCase(),
		headerBackTitle: ' '
	});


	componentWillMount() {
		this.props.getProductsForCategoryOrChild(this.props.category);
	}

  onRowPress = (product) => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name
    });
  }

	onEndReached = () => {
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
	renderContent = () => {
	  return (
	    <ProductList
        products={this.props.products}
        onEndReached={this.onEndReached}
        canLoadMoreContent={this.props.canLoadMoreContent}
        onRowPress={this.onRowPress}
	    />
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
	MainContainer: {
		justifyContent: 'center',
		flex: 1,
		margin: 5,
		paddingTop: (Platform.OS) === 'ios' ? 20 : 0
	},
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
	infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    marginTop: 0,
    fontSize: 16,
		padding: 0,
    fontWeight: '200',
    color: '#555',
  },
  priceStyle: {
    fontSize: 14,
    fontWeight: '200',
    textAlign: 'center',
  },
	imageStyle: {
		flex: 1
  },
	iconStyle: {
    height: 32,
    width: 40,
    margin: 5,
    marginRight: 0
  },
	iconWrapper: {
    marginTop: 5,
    marginRight: 10
  },
};

const mapStateToProps = state => {
	const { category } = state.category.current;
	const { products, totalCount, loadingMore } = state.category;
	const canLoadMoreContent = products.length < totalCount;

	return { category, products, totalCount, canLoadMoreContent, loadingMore };
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  setCurrentProduct
})(CategoryList);
