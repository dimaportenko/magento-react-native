import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

class Options extends Component {

	constructor(props) {
		super(props);

		this.state = {
			textInputValue: ''
		};
	}

	render() {
		let index = 0;
		const data = [
			{ key: index++, section: true, label: 'Fruits' },
			{ key: index++, label: 'Red Apples' },
			{ key: index++, label: 'Cherries' },
			{ key: index++, label: 'Cranberries' },
			{ key: index++, label: 'Vegetable', customKey: 'Not a fruit' }
		];

		return (
				<View style={styles.containerStyle} >
					<ModalSelector
							data={data}
							initValue={this.props.label}
							onChange={(option) => { this.setState({ textInputValue: option.label }); }}
					>
						<TextInput
								style={styles.inputStyle}
								editable={false}
								placeholder={this.props.label}
								value={this.state.textInputValue}
						/>
					</ModalSelector>
				</View>
		);
	}
}

const styles = {
	containerStyle: {
		flex: 1,
		justifyContent: 'space-around',
		padding: 20
	},
	selectorStyle: {

	},
	inputStyle: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		height: 40,
		textAlign: 'center'
	}
};

export default Options;
