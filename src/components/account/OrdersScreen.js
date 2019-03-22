import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  getOrderProductList,
  setCurrentProduct,
} from '../../actions';
import { ProductList } from '../common/ProductList';
import NavigationService from '../../navigation/NavigationService';
import {
  NAVIGATION_HOME_SCREEN_PATH,
  NAVIGATION_ORDER_PRODUCT_PATH
} from '../../navigation/routes';


class CategoryList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Orders', /*navigation.state.params.title.toUpperCase(),*/
    headerBackTitle: ' '
  });


  componentDidMount() {
    this.props.getOrderProductList(this.props);
  }

  onItemPress = (product) => {
    this.props.setCurrentProduct({ product });
    NavigationService.navigate(NAVIGATION_ORDER_PRODUCT_PATH, {
      title: product.name
    });
  };

  renderOrderList = () => {
    return (
      <ProductList
        products={this.props.items}
        onRowPress={this.onItemPress}
      />
    );
  };

  renderEmptyOrderList = () => {
    const { navigate } = this.props.navigation;
    const {
      emptyListContainerStyle,
      textStyle,
      buttonTextStyle
    } = styles;


    return (
      <View style={emptyListContainerStyle}>
        <Text style={textStyle}>
          Oops, there is no orders yet
        </Text>
        <TouchableOpacity
          onPress={() => navigate(NAVIGATION_HOME_SCREEN_PATH)}
        >
          <Text style={buttonTextStyle}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { items } = this.props;

    if (items && items.length) {
      return (
        <View style={styles.containerStyle}>
          {this.renderOrderList()}
        </View>
      );
    }
    return this.renderEmptyOrderList();
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyListContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 20,
    paddingTop: 7,
  },
  buttonTextStyle: {
    padding: 14,
    fontSize: 20,
    top: 0,
    color: '#3478f6',
  },
};

const mapStateToProps = ({ customerId }) => {
  return { customerId };
};

export default connect(mapStateToProps, {
  getOrderProductList,
  setCurrentProduct
})(CategoryList);
