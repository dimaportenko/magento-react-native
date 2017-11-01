import React, { Component } from 'react';
import { View, Text } from 'react-native';

class CheckoutSection extends Component {

	renderExpanded() {
		const { expanded, children } = this.props;
		if (expanded) {
			return (
					<View style={styles.expandedStyle}>
						{children}
					</View>
			);
		}

		return <View />;
	}

	render() {
		const { expanded } = this.props;
		const container = expanded ? styles.containerStyles : {};
		return (
				<View style={container}>
					<View style={styles.headerStyles}>
						<Text style={styles.leftText}>{this.props.title}</Text>
						<View style={styles.textBackground}>
							<Text style={styles.textStyle}>{this.props.number}</Text>
						</View>
					</View>
					{this.renderExpanded()}
				</View>
		);
	}
}

const styles = {
	containerStyles: {
		flex: 1,
	},
	headerStyles: {
		borderBottomWidth: 1,
		height: 50,
		borderColor: '#ddd',
		position: 'relative',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 2,
		shadowRadius: 2,
		elevation: 1,
		marginBottom: 4
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
	leftText: {
		fontSize: 18
	},
	textStyle: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
		backgroundColor: 'transparent'
	},
	expandedStyle: {
		flex: 1
	}
};

export default CheckoutSection;
