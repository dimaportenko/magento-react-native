import { ADMIN_TYPE, CategoryType } from '../../types';
import {
  getParamsFromSearchCriterias,
  SearchCriteriasType,
} from '../../utils/params';
import { Magento } from '../../index';
import { CustomerDataType, PostReviewDataApiParamType } from '../types';

const getSortFieldName = (sortOrder: number) => {
  switch (sortOrder) {
    case 0:
    case 1:
      return 'name';
    case 2:
    case 3:
      return 'price';
    default:
      return '';
  }
};

const getSortDirection = (sortOrder: number) => {
  switch (sortOrder) {
    case 0:
    case 2:
      return 'ASC';
    case 1:
    case 3:
      return 'DESC';
    default:
      return '';
  }
};

export default (magento: Magento) => ({
  getStoreConfig: () =>
    magento.get('/V1/store/storeConfigs', undefined, undefined, ADMIN_TYPE),

  updateCustomerData: (id: number, customer: CustomerDataType) =>
    magento.put(`/V1/customers/${id}`, customer, ADMIN_TYPE),

  addCouponToCart: (cartId: string | number, couponCode: string) =>
    magento.put(
      `/V1/carts/${cartId}/coupons/${couponCode}`,
      undefined,
      ADMIN_TYPE,
    ),

  removeCouponFromCart: (cartId: string | number) =>
    magento.delete(`/V1/carts/${cartId}/coupons`, undefined, ADMIN_TYPE),

  getCartTotals: (cartId: string | number) =>
    magento.get(`/V1/carts/${cartId}/totals`, undefined, undefined, ADMIN_TYPE),

  getCategoriesTree: () =>
    magento.get('/V1/categories', undefined, undefined, ADMIN_TYPE),

  getCategory: (id: number) =>
    magento.get(`/V1/categories/${id}`, undefined, undefined, ADMIN_TYPE),

  getCategoryAttributes: (attributeCode: string) =>
    magento.get(
      `/V1/categories/attributes/${attributeCode}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getCategoriesList: () => {
    // GET /V1/categories/list
    const path = '/V1/categories/list';
    const params = {
      'searchCriteria[filterGroups][0][filters][0][field]': 'name',
      'searchCriteria[filterGroups][0][filters][0][value]': 'Woman',
      'searchCriteria[filterGroups][0][filters][0][conditionType]': 'eq',
      'searchCriteria[pageSize]': 20,
      'searchCriteria[currentPage]': 1,
    };

    return magento.get(path, params, undefined, ADMIN_TYPE);
  },

  /**
   * SortOrder can be
   * 0 = Arrange products in ascending order based on their names
   * 1 = Arrange products in descending order based on their names
   * 2 = Arrange products in ascending order based on their prices
   * 3 = Arrange products in descending order based on their prices
   */
  getSearchCreteriaForCategoryAndChild: (
    category: CategoryType,
    pageSize = 10,
    offset = 1,
    sortOrder?: number,
    filter?: Record<string, string | Record<string, string>>,
  ) => {
    const currentPage = parseInt(`${offset / pageSize}`, 10) + 1;
    const searchCriteria = {
      groups: [
        [
          {
            field: 'visibility',
            value: '4',
            conditionType: 'eq',
          },
        ],
        [
          {
            field: 'status',
            value: '1',
            conditionType: 'eq',
          },
        ],
      ],
    };

    let categoryIds = '';
    const getForCategory = (cat: CategoryType) => {
      categoryIds = `${categoryIds},${cat.id}`;
      cat.children_data.forEach(childCategory => {
        getForCategory(childCategory);
      });
    };
    getForCategory(category);
    categoryIds = categoryIds.substr(1);

    searchCriteria.groups.push([
      {
        field: 'category_id',
        value: categoryIds,
        conditionType: 'in',
      },
    ]);

    if (typeof filter !== 'undefined') {
      Object.keys(filter).forEach(key => {
        let value = filter[key];
        let condition = null;
        if (typeof value === 'object') {
          condition = value.condition;
          value = value.value;
          if (condition.includes('from')) {
            const conditions = condition.split(',');
            const values = value.split(',');
            searchCriteria.groups.push([
              {
                field: key,
                value: values[0],
                conditionType: conditions[0],
              },
            ]);
            searchCriteria.groups.push([
              {
                field: key,
                value: values[1],
                conditionType: conditions[1],
              },
            ]);
          }
        }
      });
    }
    const params: Record<string, string | number> =
      getParamsFromSearchCriterias(searchCriteria);
    if (typeof sortOrder === 'number') {
      params['searchCriteria[sortOrders][0][field]'] =
        getSortFieldName(sortOrder);
      params['searchCriteria[sortOrders][0][direction]'] =
        getSortDirection(sortOrder);
    }

    params['searchCriteria[pageSize]'] = pageSize;
    params['searchCriteria[currentPage]'] = currentPage;

    return magento.admin.getProductsWithSearchCritaria(params);
  },

  getProducts: (
    categoryId: number,
    pageSize = 10,
    offset = 0,
    sortOrder: number,
    filter: Record<string, string | Record<string, string>>,
  ) =>
    magento.admin.getProductsWithAttribute(
      'category_id',
      categoryId,
      pageSize,
      offset,
      sortOrder,
      filter,
      'eq',
    ),

  getProductsWithAttribute: (
    attributeCode: string,
    attributeValue: string | number,
    pageSize = 10,
    offset = 0,
    sortOrder?: number,
    filter?: Record<string, string | Record<string, string>>,
    conditionType = 'like',
  ) => {
    const currentPage = parseInt(`${offset / pageSize}`, 10) + 1;
    const currentAttributeValue =
      conditionType === 'eq' ? attributeValue : `%\\${attributeValue}%`;
    const params: Record<string, string | number> = {
      'searchCriteria[filterGroups][0][filters][0][field]': attributeCode,
      'searchCriteria[filterGroups][0][filters][0][value]':
        currentAttributeValue,
      'searchCriteria[filterGroups][0][filters][0][conditionType]':
        conditionType,
      'searchCriteria[filterGroups][1][filters][0][field]': 'visibility',
      'searchCriteria[filterGroups][1][filters][0][value]': '4',
      'searchCriteria[filterGroups][1][filters][0][conditionType]': 'eq',
      'searchCriteria[filterGroups][2][filters][0][field]': 'status',
      'searchCriteria[filterGroups][2][filters][0][value]': '1',
      'searchCriteria[filterGroups][2][filters][0][conditionType]': 'eq',
      'searchCriteria[pageSize]': pageSize,
      'searchCriteria[currentPage]': currentPage,
    };
    if (typeof sortOrder === 'number') {
      params['searchCriteria[sortOrders][0][field]'] =
        getSortFieldName(sortOrder);
      params['searchCriteria[sortOrders][0][direction]'] =
        getSortDirection(sortOrder);
    }
    if (typeof filter !== 'undefined') {
      Object.keys(filter).forEach(key => {
        let value = filter[key];
        let condition = null;
        // let subQuery = '';
        if (typeof value === 'object') {
          condition = value.condition;
          value = value.value;
          if (condition.includes('from')) {
            const conditions = condition.split(',');
            const values = value.split(',');
            params['searchCriteria[filterGroups][3][filters][0][field]'] = key;
            params['searchCriteria[filterGroups][3][filters][0][value]'] =
              values[0];
            params[
              'searchCriteria[filterGroups][3][filters][0][condition_type]'
            ] = conditions[0];
            params['searchCriteria[filterGroups][4][filters][0][field]'] = key;
            params['searchCriteria[filterGroups][4][filters][0][value]'] =
              values[1];
            params[
              'searchCriteria[filterGroups][4][filters][0][condition_type]'
            ] = conditions[1];
          }
        }
      });
    }

    return magento.admin.getProductsWithSearchCritaria(params);
  },

  getProductsBy: (searchCriteria: SearchCriteriasType) => {
    const params = getParamsFromSearchCriterias(searchCriteria);
    return magento.get('/V1/products', params, undefined, ADMIN_TYPE);
  },

  getProductsWithSearchCritaria: (searchCriteria: Record<string, unknown>) =>
    magento.get('/V1/products', searchCriteria, undefined, ADMIN_TYPE),

  getProductBySku: (sku: string) =>
    magento.get(`/V1/products/${sku}`, undefined, undefined, ADMIN_TYPE),

  getProductOptions: (sku: string) =>
    magento.get(
      `/V1/products/${sku}/options`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getFeaturedChildren: ({
    page,
    pageSize = 10,
    filter,
  }: {
    page: number;
    pageSize: number;
    filter?: Record<
      string,
      | {
          condition: string;
          value: string;
        }
      | string
    >;
  }) => {
    let path = '/V1/products?';
    path += magento.makeParams({ page, pageSize, filter });
    console.log('PATH:', path);
    return magento.get(path, undefined, undefined, ADMIN_TYPE);
  },

  getConfigurableChildren: (sku: string) =>
    magento.get(
      `/V1/configurable-products/${sku}/children`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getConfigurableProductOptions: (sku: string) =>
    magento.get(
      `/V1/configurable-products/${sku}/options/all`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getConfigurableProductOptionById: (sku: string, id: number) =>
    magento.get(
      `/V1/configurable-products/${sku}/options/${id}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getProductAttributesOptions: (attributeId: string | number) =>
    magento.get(
      `/V1/products/attributes/${attributeId}/options`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getAttributeByCode: (attributeCode: string) =>
    magento.get(
      `/V1/products/attributes/${attributeCode}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getProductMedia: (sku: string) =>
    magento.get(`/V1/products/${sku}/media`, undefined, undefined, ADMIN_TYPE),

  getCart: (customerId: number) =>
    magento.post(`/V1/customers/${customerId}/carts`, undefined, ADMIN_TYPE),

  getCmsBlock: (id: number | string) =>
    magento.get(`/V1/cmsBlock/${id}`, undefined, undefined, ADMIN_TYPE),

  removeItemFromCart: (cartId: string | number, itemId: string | number) =>
    magento.delete(
      `/V1/carts/${cartId}/items/${itemId}`,
      undefined,
      ADMIN_TYPE,
    ),

  getOrderList: (customerId: number) => {
    console.log('getting orders for: ', customerId);

    const path = '/V1/orders';
    const params = {
      'searchCriteria[filterGroups][0][filters][0][field]': 'customer_id',
      'searchCriteria[filterGroups][0][filters][0][value]': customerId,
    };
    return magento.get(path, params, undefined, ADMIN_TYPE);
  },

  getLinkedProducts: (sku: string, type: string) =>
    magento.get(
      `/V1/products/${sku}/links/${type}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getProductReviews: (productId: number) =>
    magento.get(
      `/V1/mma/review/reviews/${productId}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getRatingOptions: () =>
    magento.get(
      `/V1/mma/rating/ratings/${magento.storeConfig?.id}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  postGuestReview: (review: PostReviewDataApiParamType) =>
    magento.post('/V1/mma/review/guest/post', review, ADMIN_TYPE),
});
