import React, { Component } from 'react';
import { Button } from 'react-native';
import { connect } from 'react-redux';

class HeaderCartButton extends Component {

	onPress() {

	}

	render() {
		return (
				<Button
						title={`Cart ${this.props.itemsCount}`}
						onPress={this.onPress.bind(this)}
				/>
		);
	}
}

const mapStateToProps = ({ cart }) => {
	const itemsCount = cart.items ? cart.items.length : 0;
	// debugger;
	return { itemsCount };
};

export default connect(mapStateToProps)(HeaderCartButton);
