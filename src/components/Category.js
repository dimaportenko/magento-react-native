import React, { Component } from 'react';
import { Text } from 'react-native';

class Category extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.title,
		headerBackTitle: ' '
	});

	render() {
		return (
				<Text>Category Screen</Text>
		);
	}
}

export default Category;
