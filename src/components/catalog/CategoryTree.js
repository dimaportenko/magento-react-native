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

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentWillMount() {
    this.props.getCategoryTree();
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.getCategoryTree();
    this.setState({ refreshing: false });
  };

  renderContent() {
    const { categoryTree } = this.props;
    if (this.props.categoryTree) {
      return (
      <CategoryTreeList
        categories={categoryTree.children_data}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
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
  return { magento, categoryTree };
};

export default connect(mapStateToProps, { initMagento, getCategoryTree })(CategoryTree);
