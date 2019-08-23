import React, { Component } from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import CategoryTreeListItem from './CategoryTreeListItem';

class CategoryTreeList extends Component {
  renderItem(category) {
    return <CategoryTreeListItem category={category.item} expanded={false} />;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          refreshControl={this.props.refreshControl}
          data={this.props.categories}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
  }
}

export default CategoryTreeList;
