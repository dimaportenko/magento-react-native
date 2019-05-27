import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  getProductsForCategoryOrChild,
  setCurrentProduct,
  updateProductsForCategoryOrChild,
} from '../../actions';
import { ProductList, HeaderIcon } from '../common';
import NavigationService from '../../navigation/NavigationService';
import {
  NAVIGATION_HOME_PRODUCT_PATH
} from '../../navigation/routes';

class Category extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title.toUpperCase(),
		headerBackTitle: ' ',
		headerRight: (<HeaderIcon changeGridValueFunction={navigation.getParam('changeGridValueFunction')} />),
	});

	constructor(props) {
		super(props);
		this.state = {
			gridColumnsValue: true,
			sortOrder: null,
		};
	}

	componentDidMount() {
		const { navigation } = this.props;
		this.props.getProductsForCategoryOrChild(this.props.category);
		navigation.setParams({ changeGridValueFunction: this.changeGridValueFunction });
	}

  onRowPress = (product) => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      title: product.name
    });
  };

  onRefresh = () => {
    this.props.updateProductsForCategoryOrChild(this.props.category, true);
  };

	onEndReached = () => {
		const {
			canLoadMoreContent,
			loadingMore,
			products,
			category,
			totalCount
		} = this.props;
		const { sortOrder } = this.state;
		console.log('On end reached called!')
		console.log(loadingMore, totalCount, canLoadMoreContent);
		if (!loadingMore && canLoadMoreContent) {
			this.props.getProductsForCategoryOrChild(category, products.length, sortOrder);
		}
	};

	performSort = (sortOrder) => {
		this.setState({ sortOrder }, () => {
			this.props.getProductsForCategoryOrChild(this.props.category, null, sortOrder);
		});
	}

	changeGridValueFunction = () => {
		this.setState({ gridColumnsValue: !this.state.gridColumnsValue });
	};

	render() {
		return (
			<View style={styles.containerStyle}>
				<ProductList
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.onRefresh}
            />
          }
					products={this.props.products}
					onEndReached={this.onEndReached}
					canLoadMoreContent={this.props.canLoadMoreContent}
					onRowPress={this.onRowPress}
					navigation={this.props.navigation}
					gridColumnsValue={this.state.gridColumnsValue}
					performSort={this.performSort}
				/>
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
	const { products, totalCount, loadingMore, refreshing } = state.category;
	const canLoadMoreContent = products.length < totalCount;

	return { category, products, totalCount, canLoadMoreContent, loadingMore, refreshing };
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  updateProductsForCategoryOrChild,
  setCurrentProduct,
})(Category);
