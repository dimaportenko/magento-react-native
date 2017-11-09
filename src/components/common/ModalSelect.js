import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

class ModalSelect extends Component {

	constructor(props) {
		super(props);

		this.state = {
			textInputValue: ''
		};
	}

	onChange(option) {
		const { label, onChange, attribute } = this.props;

		this.setState({
			...this.state,
			textInputValue: `${label} : ${option.label}`
		});

		if (onChange) {
			onChange(attribute, option.key);
		}
	}

	render() {
		const { data, label, disabled } = this.props;

		return (
				<View style={styles.containerStyle} >
					<ModalSelector
							disabled={disabled}
							data={data}
							initValue={label}
							onChange={option => this.onChange(option)}
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

// TODO: add style for disabled element
const styles = {
	containerStyle: {
		flex: 1,
		justifyContent: 'space-around',
		padding: 20,
		paddingBottom: 5,
		paddingTop: 0
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

export { ModalSelect };
