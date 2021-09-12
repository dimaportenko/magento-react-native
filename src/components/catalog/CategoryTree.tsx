import React, { FC, useContext, useEffect } from 'react';
import { RefreshControl, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { Spinner } from '../common/index';
import { initMagento, getCategoryTree } from '../../actions/index';
import CategoryTreeList from './CategoryTreeList';
import { ThemeContext } from '../../theme';
import { StoreStateType } from '../../reducers';
import { ThemeType } from '../../theme/theme';

const mapStateToProps = ({ categoryTree }: StoreStateType) => ({
  categoryTree,
  refreshing: categoryTree.refreshing,
});

const connector = connect(mapStateToProps, { initMagento, getCategoryTree });

type PropsFromRedux = ConnectedProps<typeof connector>;

const CategoryTree: FC<PropsFromRedux> = ({
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
          categories={categoryTree.children_data ?? []}
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

// @ts-ignore
CategoryTree.navigationOptions = {
  title: 'Categories'.toUpperCase(),
  headerBackTitle: ' ',
};

const styles = {
  container: (theme: ThemeType) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
};

export default connector(CategoryTree);
