import React, { useContext, useEffect } from 'react';
import { RefreshControl, View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from '../common/index';
import { initMagento, getCategoryTree } from '../../actions/index';
import CategoryTreeList from './CategoryTreeList';
import { ThemeContext } from '../../theme';

const CategoryTree = ({
  categoryTree,
  refreshing,
  getCategoryTree: _getCategoryTree,
}) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    _getCategoryTree();
  }, [_getCategoryTree]);

  const onRefresh = () => {
    _getCategoryTree(true);
  };

  const renderContent = () => {
    if (categoryTree) {
      return (
        <CategoryTreeList
          categories={categoryTree.children_data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      );
    }
    return <Spinner />;
  };

  return <View style={styles.container(theme)}>{renderContent()}</View>;
};

CategoryTree.navigationOptions = {
  title: 'Categories'.toUpperCase(),
  headerBackTitle: ' ',
};

const styles = {
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
};

const mapStateToProps = ({ categoryTree }) => ({
  categoryTree,
  refreshing: categoryTree.refreshing,
});

export default connect(mapStateToProps, { initMagento, getCategoryTree })(
  CategoryTree,
);
