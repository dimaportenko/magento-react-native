import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Text,
	View,
	TouchableOpacity,
	LayoutAnimation
} from 'react-native';
import CategoryTreeList from './CategoryTreeList';
import { ExpandButton } from './common';
import { goToCategory } from '../actions';


class CategoryTreeListItem extends Component {
	state = { expanded: false };

	componentWillUpdate() {
		const switchAnimation = {
			duration: 150,
			update: {
				type: LayoutAnimation.Types.linear,
				property: LayoutAnimation.Properties.opacity
			}
		};
		LayoutAnimation.configureNext(switchAnimation);
	}

	onExpandPress() {
		this.setState({ ...this.state, expanded: !this.state.expanded });
	}

	onRowPress() {
		const { category } = this.props;
		this.props.goToCategory(category.name);
	}

	renderExpandButton() {
		const { category } = this.props;
		const { expanded } = this.state;
		if (category.children_data.length) {
			const title = expanded ? '-' : '+';
			return <ExpandButton onPress={this.onExpandPress.bind(this)}>{title}</ExpandButton>;
		}
	}

	renderItem() {
		const { category } = this.props;
		const titleStyle = {
			fontSize: 18,
			alignSelf: 'flex-start',
			paddingLeft: 10 * category.level
		};

		return (
			<View>
				<TouchableOpacity onPress={this.onRowPress.bind(this)} style={styles.rowStyles}>
					<Text style={titleStyle}>{category.name}</Text>
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
	rowStyles: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderColor: '#ddd',
		paddingTop: 5,
		paddingBottom: 5
	}
};

export default connect(null, { goToCategory })(CategoryTreeListItem);
