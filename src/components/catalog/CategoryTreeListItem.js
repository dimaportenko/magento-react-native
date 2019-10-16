import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, TouchableOpacity, LayoutAnimation,
} from 'react-native';
import { Icon } from 'react-native-elements';
import CategoryTreeList from './CategoryTreeList';
import { Text } from '../common';
import { setCurrentCategory, resetFilters } from '../../actions/index';
import { NAVIGATION_CATEGORY_PATH } from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import { ThemeContext } from '../../theme';

class CategoryTreeListItem extends Component {
  static contextType = ThemeContext;

  state = { expanded: false };

  componentDidUpdate() {
    const switchAnimation = {
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    LayoutAnimation.configureNext(switchAnimation);
  }

  onExpandPress() {
    this.setState({ ...this.state, expanded: !this.state.expanded });
  }

  onRowPress() {
    const { category } = this.props;
    this.props.resetFilters();
    this.props.setCurrentCategory({ category });
    NavigationService.navigate(NAVIGATION_CATEGORY_PATH, {
      title: category.name,
    });
  }

  renderExpandButton() {
    const theme = this.context;
    const { category } = this.props;
    const { expanded } = this.state;
    if (category.children_data.length) {
      const icon = expanded
        ? 'ios-arrow-dropdown'
        : 'ios-arrow-dropright';
      return (
        <TouchableOpacity onPress={this.onExpandPress.bind(this)}>
          <Icon
            iconStyle={styles.dropIcon(theme)}
            size={20}
            name={icon}
            type="ionicon"
            color="#999"
          />
        </TouchableOpacity>
      );
    }
  }

  renderItem() {
    const theme = this.context;
    const { category } = this.props;
    const titleStyle = {
      alignSelf: 'flex-start',
      paddingLeft: 10 * category.level,
    };

    return (
      <View>
        <TouchableOpacity
          onPress={this.onRowPress.bind(this)}
          style={styles.rowStyles(theme)}
        >
          <Text type="heading" style={titleStyle}>{category.name}</Text>
          {this.renderExpandButton()}
        </TouchableOpacity>
      </View>
    );
  }

  renderChildren() {
    if (this.state.expanded) {
      return (
        <View>
          <CategoryTreeList categories={this.props.category.children_data} />
        </View>
      );
    }
  }

  render() {
    return (
      <View>
        {this.renderItem()}
        {this.renderChildren()}
      </View>
    );
  }
}

const styles = {
  rowStyles: theme => ({
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.small,
    backgroundColor: theme.colors.surface,
  }),
  dropIcon: theme => ({
    height: 24,
    padding: 2,
    paddingRight: theme.spacing.large,
  }),
};

export default connect(null, { setCurrentCategory, resetFilters })(CategoryTreeListItem);
