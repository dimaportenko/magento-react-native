import React, { Component } from 'react';
import { Image, TouchableHighlight, View, Text } from 'react-native';
import { connect } from 'react-redux';

class HeaderCartButton extends Component {

	onPress() {

	}

	render() {
		return (
				<TouchableHighlight onPress={this.onPress.bind(this)}>
					<Image
							source={require('../../../resources/icons/shopping-cart.png')}
							style={styles.iconStyle}
					>
						<View style={styles.textBackground}>
								<Text style={styles.textStyle}>{this.props.itemsCount}</Text>
						</View>
					</Image>
				</TouchableHighlight>
		);
	}
}

const styles = {
	iconStyle: {
		height: 32,
		width: 32,
		margin: 5,
		paddingRight: 10,
		marginRight: 10,
	},
	textBackground: {
		backgroundColor: '#999',
		height: 15,
		width: 15,
		borderRadius: 15,
		marginLeft: 18,

	},
	textStyle: {
		color: '#fff',
		fontSize: 12,
		textAlign: 'center',
		backgroundColor: 'transparent'
		// flexWrap: 'wrap'
	}
};

const mapStateToProps = ({ cart }) => {
	const itemsCount = cart.items ? cart.items.length : 0;
	// debugger;
	return { itemsCount };
};

export default connect(mapStateToProps)(HeaderCartButton);
