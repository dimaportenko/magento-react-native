import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import Sizes from '../../constants/Sizes';
import { getSearchProducts } from '../../actions';
import ProductListItem from '../catalog/ProductListItem';

class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search',
    headerBackTitle: ' '
  };

  state = {
    input: '',
  };

  updateSearch = input => {
    this.setState({ input });
    this.props.getSearchProducts(this.state.input);
  };

  renderItem = (products) => {
    return <ProductListItem imageStyle={{ flex: 1 }} product={products.item} />;
  };

  renderContent = () => {
      if (!this.props.products) {
        return;
      }

      if (this.props.products.length) {
        return (
          <FlatList
            renderItem={this.renderItem}
            data={this.props.products}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={10}
          />
        );
      }

      return (
      <View style={styles.notFoundTextWrap}>
        <Text style={styles.notFoundText}>No products found</Text>
      </View>
      );
  };

  render() {
    const { searchInputStyle, containerStyle, searchStyle } = styles;
    const { input } = this.state;

    return (
      <View style={containerStyle}>
        <View style={searchInputStyle}>
          <SearchBar
            placeholder="Type here..."
            onChangeText={this.updateSearch}
            value={input}
            containerStyle={searchStyle}
            inputStyle={{ backgroundColor: '#DAE2EA' }}
            inputContainerStyle={{ backgroundColor: '#DAE2EA' }}
          />
        </View>
        <View style={{ flex: 1 }}>
          {this.renderContent()}
        </View>
      </View>
    );
  }
}

const styles = {
  searchInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    paddingBottom: 5
  },
  containerStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchStyle: {
    marginTop: 5,
    backgroundColor: '#DAE2EA',
    borderRadius: 25,
    alignSelf: 'center',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    height: 55,
    width: Sizes.WINDOW_WIDTH * 0.9,
  },
};

const mapStateToProps = ({ search }) => {
  const { products, totalCount, loadingMore } = search;
  const canLoadMoreContent = products.length < totalCount;

  return { products, totalCount, canLoadMoreContent, loadingMore };
  return { products: search.products };
};


export default connect(mapStateToProps, { getSearchProducts })(SearchScreen);
