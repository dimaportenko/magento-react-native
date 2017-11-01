import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import {
	checkoutCustomerEmailChanged,
	checkoutCustomerPasswordChanged,
	// loginUser
} from '../../actions';
import { CardSection, Input, Spinner } from '../common';

class CheckoutCustomerAccount extends Component {

	onEmailChange(text) {
		this.props.checkoutCustomerEmailChanged(text);
	}

	onPasswordChange(text) {
		this.props.checkoutCustomerPasswordChanged(text);
	}

	onLoginPressed() {
		// const { email, password } = this.props;
		// this.props.loginUser({ email, password });
	}

	renderButton() {
		if (this.props.loading) {
			return <Spinner size="large" />;
		}
		return (
				<Button
						onPress={this.onLoginPressed.bind(this)}
						title="Next"
				/>
		);
	}

	render() {
		return (
				<View>
					<CardSection>
						<Input
								label="Email"
								value={this.props.email}
								placeholder="email@gmail.com"
								onChangeText={this.onEmailChange.bind(this)}
						/>
					</CardSection>

					<CardSection>
						<Input
								secureTextEntry
								label="Password"
								value={this.props.password}
								placeholder="password"
								onChangeText={this.onPasswordChange.bind(this)}
						/>
					</CardSection>

					<Text style={styles.errorTextStyle}>
						{this.props.error}
					</Text>

					<CardSection>
						{this.renderButton()}
					</CardSection>
				</View>
		);
	}
}

const styles = {
	errorTextStyle: {
		color: 'red',
		fontSize: 20,
		alignSelf: 'center'
	}
};

const mapStateToProps = ({ checkout }) => {
	const { email, password, error, loading } = checkout.ui;
	return { email, password, error, loading };
};

export default connect(
		mapStateToProps, {
			checkoutCustomerEmailChanged,
			checkoutCustomerPasswordChanged,
			// loginUser
		}
)(CheckoutCustomerAccount);
