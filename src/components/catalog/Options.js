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
		const { data, label } = this.props;

		return (
				<View style={styles.containerStyle} >
					<ModalSelector
							data={data}
							initValue={label}
							onChange={(option) => {
								this.setState({ ...this.state, textInputValue: `${label} : ${option.label}` });
							}}
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

export default Options;
