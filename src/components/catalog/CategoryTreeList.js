import React, { Component } from 'react';
import { ListView } from 'react-native';
import CategoryTreeListItem from './CategoryTreeListItem';

class CategoryTreeList extends Component {

	componentWillMount() {
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	createDataSource({ categories }) {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});

		this.dataSource = ds.cloneWithRows(categories);
	}

	renderRow(category) {
		return <CategoryTreeListItem category={category} expanded={false} />;
	}

	render() {
		return (
				<ListView
					enableEmptySections
					dataSource={this.dataSource}
					renderRow={this.renderRow}
				/>
		);
	}
}

export default CategoryTreeList;
