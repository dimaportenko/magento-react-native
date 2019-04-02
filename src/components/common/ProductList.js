import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import {
  View,
  FlatList,
  Platform,
  TouchableOpacity, Text
} from 'react-native';
import { ProductListItem, Spinner } from './';
import Sizes from '../../constants/Sizes';
import { NAVIGATION_DRAWER_SCREEN } from '../../navigation/routes';

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gridColumnsValue: true,
      defaultButtonView: 'md-grid',
    };
  }

  changeGridValueFunction = () => {
    if (this.state.gridColumnsValue === true) {
      this.setState({
        gridColumnsValue: false,
        defaultButtonView: 'md-list'
      });
    } else {
      this.setState({
        gridColumnsValue: true,
        defaultButtonView: 'md-grid'
      });
    }
  };

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

  renderFilter = () => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.iconStyle}
          onPress={() => this.props.navigation.openDrawer(NAVIGATION_DRAWER_SCREEN)}
        >
          <View style={styles.iconWrapper}>
            <Icon name='md-cog' type="ionicon" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={{ alignItems: 'flex-end' }}>
        {this.renderFilter()}
        <TouchableOpacity
          style={styles.iconStyle}
          onPress={this.changeGridValueFunction}
        >
          <View style={styles.iconWrapper}>
            <Icon name={this.state.defaultButtonView} type="ionicon" />
          </View>
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
    const { products, onEndReached, refreshControl } = this.props;
    const { gridColumnsValue } = this.state;

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
  columnContainerStyle: {
    flexDirection: 'column',
    borderBottomWidth: 0,
  },
};

export { ProductList };
