import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Button } from 'react-native';
import { connect } from 'react-redux';
import { NAVIGATION_CATEGORY_TREE_PATH } from '../../navigation/routes';
import { getHomeData } from '../../actions';
import HomeSlider from './HomeSlider';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Magento React Native',
  };

  static defaultProps = {
    slider: [],
  };

  static propTypes = {
    slider: PropTypes.array,
  };

  state = {
    slider: [],
  };

  componentWillMount() {
    this.props.getHomeData();
  }

  allCategories = () => {
    this.props.navigation.navigate(NAVIGATION_CATEGORY_TREE_PATH);
  };

  render() {
    return (
      <View style={styles.container}>
        <HomeSlider slider={this.props.slider} />
        <Button title="All Categories" onPress={this.allCategories} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});

const mapStateToProps = state => {
  return { ...state.home };
};

export default connect(mapStateToProps, { getHomeData })(HomeScreen);
