import React, { Component } from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import Sizes from '../../constants/Sizes';

class SearchScreen extends Component {
    static navigationOptions = {
        title: 'Search',
        headerBackTitle: ' '
    };

    state = {
        input: '',
    };

    updateSearch = input => {
        this.setState({ input });
    };

    render() {
        const { input } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SearchBar
                    placeholder="Type here..."
                    onChangeText={this.updateSearch}
                    value={input}
                    containerStyle={styles.searchStyle}
                    inputStyle={{ backgroundColor: '#DAE2EA' }}
                    inputContainerStyle={{ backgroundColor: '#DAE2EA' }}
                />
            </View>
        );
    }
}

const styles = {
  searchStyle: {
      marginTop: 5,
      backgroundColor: '#DAE2EA',
      borderRadius: 25,
      alignSelf: 'center',
      borderBottomWidth: 0,
      borderTopWidth: 0,
      height: 55,
      width: Sizes.WINDOW_WIDTH * 0.9,
  }
};


export default connect(null)(SearchScreen);
