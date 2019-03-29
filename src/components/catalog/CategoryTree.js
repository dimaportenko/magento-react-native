import React, { Component } from 'react';
import { RefreshControl, View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from '../common/index';
import { initMagento, getCategoryTree } from '../../actions/index';
import CategoryTreeList from './CategoryTreeList';

class CategoryTree extends Component {
	static navigationOptions = {
		title: 'Categories'.toUpperCase(),
		headerBackTitle: ' '
	};

  componentDidMount() {
    this.props.getCategoryTree();
  }

  onRefresh = () => {
    this.props.getCategoryTree(true);
  };

  renderContent() {
    const { categoryTree } = this.props;
    if (this.props.categoryTree) {
      return (
      <CategoryTreeList
        categories={categoryTree.children_data}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      />
    );
    }

    return <Spinner />;
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
    backgroundColor: '#fff'
  }
};

const mapStateToProps = ({ magento, categoryTree }) => {
  return { magento, categoryTree, refreshing: categoryTree.refreshing };
};

export default connect(mapStateToProps, { initMagento, getCategoryTree })(CategoryTree);
