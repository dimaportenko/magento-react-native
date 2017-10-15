import React, { Component } from 'react';
import { View, Text } from 'react-native';

class CheckoutSection extends Component {


	render() {
		return (
				<View style={styles.containerStyles}>
					<Text style={styles.leftText}>{this.props.title}</Text>
					<View style={styles.textBackground}>
						<Text style={styles.textStyle}>{this.props.number}</Text>
					</View>
				</View>
		);
	}
}

const styles = {
	containerStyles: {
		borderBottomWidth: 1,
		height: 50,
		borderColor: '#ddd',
		position: 'relative',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
	},
	textBackground: {
		backgroundColor: '#999',
		height: 40,
		width: 40,
		borderRadius: 40,
		right: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	textStyle: {
		color: '#fff',
		fontSize: 12,
		textAlign: 'center',
		backgroundColor: 'transparent'
	}
};

export default CheckoutSection;
