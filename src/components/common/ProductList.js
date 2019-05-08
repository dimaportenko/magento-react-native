import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  FlatList,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { ProductListItem, Spinner } from './';
import Sizes from '../../constants/Sizes';
import ModalSelector from 'react-native-modal-selector';
import { NAVIGATION_DRAWER_SCREEN, NAVIGATION_FILTER_DRAWER_SCREEN } from '../../navigation/routes';

const sortData = [
  {
    label: 'Name: A to Z',
    key: 0
  },
  {
    label: 'Name: Z to A',
    key: 1
  },
  {
    label: 'Price: high to low',
    key: 2
  },
  {
    label: 'Price: low to high',
    key: 3
  },
];

class ProductList extends Component {
  renderItemRow = (product) => {
    return (
      <ProductListItem
      imageStyle={styles.imageStyle}
      viewContainerStyle={{ flex: 1 }}
      product={product.item}
      onRowPress={this.props.onRowPress}
      />
    );
  };

  renderItemColumn = (product) => {
    const {
      textStyle,
      infoStyle,
      priceStyle,
      columnContainerStyle
    } = styles;

    return (
      <ProductListItem
        viewContainerStyle={{ width: Sizes.WINDOW_WIDTH / 2 }}
        columnContainerStyle={columnContainerStyle}
        textStyle={textStyle}
        infoStyle={infoStyle}
        priceStyle={priceStyle}
        product={product.item}
        onRowPress={this.props.onRowPress}
      />
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.headerContainerStyle}>
        <ModalSelector
        style={styles.iconWrapper}
          data={sortData}
          ref={selector => { this.selector = selector; }}
          customSelector={
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => this.selector.open()}
            >
              <Icon name='sort' size={24} color="#95989F" />
              <Text style={styles.headerTextStyle}>Sort</Text>
            </TouchableOpacity>
          }
          onChange={(option) => console.log(`${option.label} (${option.key})`)}
        />
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => this.props.navigation.toggleFilterDrawer()}
        >
          <Icon name='filter'size={24} color="#95989F" />
          <Text style={styles.headerTextStyle}>Filter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderFooter = () => {
    if (this.props.canLoadMoreContent) {
      return <Spinner style={{ padding: 15 }} />;
    }

    return null;
  }

  renderContent = () => {
    const { products, onEndReached, refreshControl, gridColumnsValue } = this.props;

    if (!this.props.products) {
      return <Spinner />;
    }

    if (this.props.products.length) {
      return (
        <FlatList
          refreshControl={refreshControl}
          data={products}
          renderItem={gridColumnsValue ? this.renderItemRow : this.renderItemColumn}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={onEndReached}
          onEndReachedThreshold={0}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          numColumns={gridColumnsValue ? 1 : 2}
          key={(gridColumnsValue) ? 'ONE COLUMN' : 'TWO COLUMNS'}
        />
      );
    }
    if (!this.props.searchIndicator) {
      return (
        <View style={styles.notFoundTextWrap}>
          <Text style={styles.notFoundText}>No products found</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  columnContainerStyle: {
    flexDirection: 'column',
    borderBottomWidth: 0,
  },
  headerContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#D4D5D7',
  },
  iconWrapper: {
    flex: 1,
    height: 32,
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTextStyle: {
    color: '#545864',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  separator: {
    width: 1,
    backgroundColor: '#D4D5D7',
    marginTop: 8,
    marginBottom: 8
  }
});

export { ProductList };
