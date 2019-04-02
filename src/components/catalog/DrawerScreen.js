import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Input, Text } from 'react-native-elements';
import { getFilteredProducts } from '../../actions';
import Sizes from '../../constants/Sizes';


class DrawerScreen extends Component {

  static propTypes = {};

  static defaultProps = {};

  state = {
    values: [1, 100],
  };

  onValuesChange = (values) => {
    this.setState({ values });
  };
// () => this.props.getFilteredProducts({ page: 1, pageSize: 10, filter: { category_id: 3, price: this.state.values[0]

    render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Price</Text>
        <Input
          style={styles.minInputStyle}
          placeholder='Min.'
        />
        <Text> - </Text>
        <Input
          style={styles.minInputStyle}
          placeholder='Max.'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  minInputStyle: {
    marginTop: 25,
    width: 12,
    flex: 2,
  },
  maxInputStyle: {
    marginTop: 25,
    width: 12,
    flex: 2,
  },
  textStyle: {
    marginTop: 20,
    fontSize: 18,
    lineHeight: 40,
    paddingLeft: 4,
  },
});

export default connect(null, { getFilteredProducts })(DrawerScreen);
