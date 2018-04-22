import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import { initMagento, getCategoryTree } from '../actions';
import CategoryTreeList from './CategoryTreeList';

class CategoryTree extends Component {
	static navigationOptions = {
		title: 'Categories'.toUpperCase(),
		headerBackTitle: ' '
	};

  componentWillMount() {
    if (!this.props.magento) {
      this.props.initMagento();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.magento && nextProps.magento) {
      this.props.getCategoryTree(nextProps.magento);
    }
  }

  renderContent() {
    const { categoryTree } = this.props;
    if (this.props.categoryTree) {
      return <CategoryTreeList categories={categoryTree.children_data} />;
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
  return { magento, categoryTree };
};

export default connect(mapStateToProps, { initMagento, getCategoryTree })(CategoryTree);
