import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { getProductsForCategory } from '../actions';

class Category extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerBackTitle: ' '
	});

	componentWillMount() {
		console.log('componentWillMount');
		console.log(this.props);
		this.props.getProductsForCategory({
			id: this.props.category.id,
			magento: this.props.magento
		});
	}

	render() {
		return (
				<Text>Category {this.props.category.name} Screen</Text>
		);
	}
}

const mapStateToProps = state => {
	const { category } = state.category.current;
	const { magento } = state;
	return { category, magento };
};

export default connect(mapStateToProps, { getProductsForCategory })(Category);
