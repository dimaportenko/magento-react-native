import React, { Component } from 'react';
import { FlatList } from 'react-native';
import CategoryTreeListItem from './CategoryTreeListItem';

class CategoryTreeList extends Component {
	renderItem(category) {
		return <CategoryTreeListItem category={category.item} expanded={false} />;
	}

	render() {
		return (
				<FlatList
					data={this.props.categories}
					renderItem={this.renderItem}
					keyExtractor={(item, index) => index.toString()}
				/>
		);
	}
}

export default CategoryTreeList;
