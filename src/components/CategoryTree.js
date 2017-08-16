import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import { initMagento, getCategoryTree } from '../actions';

class CategoryTree extends Component {
  componentWillMount() {
    if (!this.props.magento) {
      this.props.initMagento();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.magento && nextProps.magento) {
      this.props.getCategoryTree(nextProps.magento);
    }
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Spinner />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
};

const mapStateToProps = state => {
  const magento = state.magento;

  return { magento };
};

export default connect(mapStateToProps, { initMagento, getCategoryTree })(CategoryTree);
