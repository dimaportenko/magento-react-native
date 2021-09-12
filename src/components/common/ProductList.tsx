import React, { FC, useContext, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControlProps,
  ViewStyle,
  TextStyle,
  ListRenderItemInfo,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { ProductListItem, Spinner, Text } from '.';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { ProductType } from '../../magento/types';
import { ThemeType } from '../../theme/theme';

const COLUMN_COUNT = 2;

const sortData = [
  {
    label: translate('common.sortOption.aToZ'),
    key: 0,
  },
  {
    label: translate('common.sortOption.zToA'),
    key: 1,
  },
  {
    label: translate('common.sortOption.priceLowToHigh'),
    key: 2,
  },
  {
    label: translate('common.sortOption.priceHighToLow'),
    key: 3,
  },
];

const ProductList: FC<{
  onRowPress(product: ProductType): void;
  currencySymbol: string;
  currencyRate: number;
  performSort(sortOder: number): void;
  navigation: any;
  canLoadMoreContent: boolean;
  products: ProductType[];
  onEndReached(): void;
  refreshControl?: React.ReactElement<RefreshControlProps> | undefined;
  gridColumnsValue: boolean;
  searchIndicator?: boolean;
}> = ({
  onRowPress,
  currencySymbol,
  currencyRate,
  performSort,
  navigation,
  canLoadMoreContent,
  products,
  onEndReached,
  refreshControl,
  gridColumnsValue,
  searchIndicator,
}) => {
  const theme = useContext(ThemeContext);
  const selector = useRef<ModalSelector>(null);

  const renderItemRow = ({ item }: ListRenderItemInfo<ProductType>) => (
    <ProductListItem
      imageStyle={styles.imageStyle}
      viewContainerStyle={{ flex: 1 }}
      product={item}
      onRowPress={onRowPress}
      currencySymbol={currencySymbol}
      currencyRate={currencyRate}
    />
  );

  const renderItemColumn = ({
    item,
    index,
  }: ListRenderItemInfo<ProductType>) => (
    <ProductListItem
      viewContainerStyle={{
        width: theme.dimens.WINDOW_WIDTH / COLUMN_COUNT,
        borderRightColor: theme.colors.border,
        borderRightWidth:
          index % COLUMN_COUNT !== COLUMN_COUNT - 1
            ? theme.dimens.productListItemInBetweenSpace
            : 0,
      }}
      columnContainerStyle={styles.columnContainerStyle}
      textStyle={styles.textStyle}
      infoStyle={styles.infoStyle}
      product={item}
      onRowPress={onRowPress}
      currencySymbol={currencySymbol}
      currencyRate={currencyRate}
    />
  );

  const renderHeader = () => (
    <View style={headerContainerStyle(theme)}>
      <ModalSelector
        style={iconWrapper(theme)}
        data={sortData}
        ref={selector}
        customSelector={
          <TouchableOpacity
            style={iconWrapper(theme)}
            /* @ts-ignore */
            onPress={() => selector.current?.open()}>
            <Icon name="sort" size={24} color="#95989F" />
            <Text style={headerTextStyle(theme)}>
              {translate('common.sort')}
            </Text>
          </TouchableOpacity>
        }
        /* @ts-ignore */
        onChange={option => performSort(option.key)}
      />
      <View style={separator(theme)} />
      <TouchableOpacity
        style={iconWrapper(theme)}
        onPress={() => navigation.toggleFilterDrawer()}>
        <Icon name="filter" size={24} color="#95989F" />
        <Text style={headerTextStyle(theme)}>{translate('common.filter')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (canLoadMoreContent) {
      return <Spinner style={{ padding: theme.spacing.large }} />;
    }

    return null;
  };

  const renderItemSeparator = () => <View style={itemSeparator(theme)} />;

  const renderContent = () => {
    if (!products) {
      return <Spinner />;
    }

    if (products.length) {
      return (
        <FlatList
          refreshControl={refreshControl}
          data={products}
          renderItem={gridColumnsValue ? renderItemRow : renderItemColumn}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          numColumns={gridColumnsValue ? 1 : 2}
          key={gridColumnsValue ? 'ONE COLUMN' : 'TWO COLUMNS'}
          ItemSeparatorComponent={renderItemSeparator}
        />
      );
    }
    if (!searchIndicator) {
      return (
        <View style={styles.notFoundTextWrap}>
          <Text style={styles.notFoundText}>
            {translate('errors.noProduct')}
          </Text>
        </View>
      );
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const itemSeparator = (theme: ThemeType) => ({
  height: theme.dimens.productListItemInBetweenSpace,
  backgroundColor: theme.colors.border,
  flex: 1,
});
const headerContainerStyle = (theme: ThemeType): ViewStyle => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'stretch',
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.border,
});
const iconWrapper = (theme: ThemeType): ViewStyle => ({
  flex: 1,
  height: 32,
  margin: theme.spacing.small,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});
const headerTextStyle = (theme: ThemeType): TextStyle => ({
  textTransform: 'uppercase',
  marginLeft: theme.spacing.small,
});
const separator = (theme: ThemeType) => ({
  width: 1,
  backgroundColor: theme.colors.border,
  marginVertical: theme.spacing.small,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  notFoundText: {
    textAlign: 'center',
  },
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    marginTop: 0,
    padding: 0,
  },
  imageStyle: {
    flex: 1,
  },
  columnContainerStyle: {
    flexDirection: 'column',
  },
});

export { ProductList };
