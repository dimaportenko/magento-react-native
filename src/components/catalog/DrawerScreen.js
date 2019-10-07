import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  getProductsForCategoryOrChild, addFilterData, getSearchProducts,
} from '../../actions';
import { Button, Text, Input } from '../common';
import { ThemeContext } from '../../theme';

class DrawerScreen extends Component {
  static contextType = ThemeContext;

  static propTypes = {};

  static defaultProps = {};

  state = {
    maxValue: '',
    minValue: '',
  };

  onApplyPressed = () => {
    const priceFilter = {
      price: {
        condition: 'from,to',
        value: `${this.state.minValue},${this.state.maxValue}`,
      },
    };
    this.props.addFilterData(priceFilter);
    if (this.props.filters.categoryScreen) {
      this.props.getProductsForCategoryOrChild(this.props.category, null, this.props.filters.sortOrder, priceFilter);
      this.props.addFilterData({ categoryScreen: false });
    } else {
      this.props.getSearchProducts(this.props.searchInput, null, this.props.filters.sortOrder, priceFilter);
    }
    this.props.navigation.closeDrawer();
  };

  render() {
    const theme = this.context;
    const {
      buttonStyle,
      container,
      InputContainer,
      textStyle,
      minInputStyle,
      maxInputStyle,
      dashTextStyle,
    } = styles;

    return (
      <View style={container(theme)}>
        <View style={InputContainer(theme)}>
          <Text type="heading" style={textStyle(theme)}>Price:</Text>
          <Input
            containerStyle={minInputStyle}
            placeholder="Min."
            value={this.state.minValue}
            keyboardType="numeric"
            onChangeText={minValue => this.setState({ minValue })}
          />
          <Text style={dashTextStyle(theme)}>-</Text>
          <Input
            containerStyle={maxInputStyle}
            value={this.state.maxValue}
            placeholder="Max."
            keyboardType="numeric"
            onChangeText={maxValue => this.setState({ maxValue })}
          />
        </View>
        <View style={buttonStyle}>
          <Button onPress={this.onApplyPressed}>
            Apply
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: theme.colors.background,
  }),
  InputContainer: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.large,
  }),
  minInputStyle: {
    width: 50,
  },
  maxInputStyle: {
    width: 50,
  },
  textStyle: theme => ({
    paddingLeft: 50,
    paddingRight: theme.spacing.large,
  }),
  dashTextStyle: theme => ({
    paddingHorizontal: theme.spacing.large,
  }),
  buttonStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

const mapStateToProps = ({ category, filters, search }) => {
  const currentCategory = category.current.category;
  const { searchInput } = search;
  return { category: currentCategory, filters, searchInput };
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild, addFilterData, getSearchProducts,
})(DrawerScreen);
