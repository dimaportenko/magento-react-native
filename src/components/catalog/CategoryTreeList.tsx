import React, { FC } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControlProps,
  SafeAreaView,
} from 'react-native';
import CategoryTreeListItem from './CategoryTreeListItem';
import { CategoryType } from '../../magento/types';

const CategoryTreeList: FC<{
  categories: CategoryType[];
  refreshControl?: React.ReactElement<RefreshControlProps> | undefined;
}> = ({ categories, refreshControl }) => {
  const renderItem = (category: ListRenderItemInfo<CategoryType>) => {
    return <CategoryTreeListItem category={category.item} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        refreshControl={refreshControl}
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default CategoryTreeList;
