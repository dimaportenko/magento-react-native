import { ADMIN_TYPE } from '../../types';
import { getParamsFromSearchCriterias } from '../../utils/params';

const getSortFieldName = sortOrder => {
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

const getSortDirection = sortOrder => {
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

export default magento => ({
  getStoreConfig: () =>
    magento.get('/V1/store/storeConfigs', undefined, undefined, ADMIN_TYPE),

  updateCustomerData: (id, customer) =>
    magento.put(`/V1/customers/${id}`, customer, undefined, ADMIN_TYPE),

  addCouponToCart: (cartId, couponCode) =>
    magento.put(
      `/V1/carts/${cartId}/coupons/${couponCode}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  removeCouponFromCart: cartId =>
    magento.delete(`/V1/carts/${cartId}/coupons`, undefined, ADMIN_TYPE),

  getCartTotals: cartId =>
    magento.get(`/V1/carts/${cartId}/totals`, undefined, undefined, ADMIN_TYPE),

  getCategoriesTree: () =>
    magento.get('/V1/categories', undefined, undefined, ADMIN_TYPE),

  getCategory: id =>
    magento.get(`/V1/categories/${id}`, undefined, undefined, ADMIN_TYPE),

  getCategoryAttributes: attributeCode =>
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
    category,
    pageSize = 10,
    offset = 1,
    sortOrder,
    filter,
  ) => {
    const currentPage = parseInt(offset / pageSize, 10) + 1;
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
    const getForCategory = cat => {
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
    const params = getParamsFromSearchCriterias(searchCriteria);
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

  getProducts: (categoryId, pageSize = 10, offset = 0, sortOrder, filter) =>
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
    attributeCode,
    attributeValue,
    pageSize = 10,
    offset = 0,
    sortOrder,
    filter,
    conditionType = 'like',
  ) => {
    const currentPage = parseInt(offset / pageSize, 10) + 1;
    const currentAttributeValue =
      conditionType === 'eq' ? attributeValue : `%\\${attributeValue}%`;
    const params = {
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

  getProductsBy: searchCriteria => {
    const params = getParamsFromSearchCriterias(searchCriteria);
    return magento.get('/V1/products', params, undefined, ADMIN_TYPE);
  },

  getProductsWithSearchCritaria: searchCriteria =>
    magento.get('/V1/products', searchCriteria, undefined, ADMIN_TYPE),

  getProductBySku: sku =>
    magento.get(`/V1/products/${sku}`, undefined, undefined, ADMIN_TYPE),

  getProductOptions: sku =>
    magento.get(
      `/V1/products/${sku}/options`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getFeaturedChildren: ({ page, pageSize = 10, filter }) => {
    let path = '/V1/products?';
    path += magento.makeParams({ page, pageSize, filter });
    console.log('PATH:', path);
    return magento.get(path, undefined, undefined, ADMIN_TYPE);
  },

  getConfigurableChildren: sku =>
    magento.get(
      `/V1/configurable-products/${sku}/children`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getConfigurableProductOptions: sku =>
    magento.get(
      `/V1/configurable-products/${sku}/options/all`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getConfigurableProductOptionById: (sku, id) =>
    magento.get(
      `/V1/configurable-products/${sku}/options/${id}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getProductAttributesOptions: attributeId =>
    magento.get(
      `/V1/products/attributes/${attributeId}/options`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getAttributeByCode: attributeCode =>
    magento.get(
      `/V1/products/attributes/${attributeCode}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getProductMedia: sku =>
    magento.get(`/V1/products/${sku}/media`, undefined, undefined, ADMIN_TYPE),

  getCart: customerId =>
    magento.post(`/V1/customers/${customerId}/carts`, undefined, ADMIN_TYPE),

  getCmsBlock: id =>
    magento.get(`/V1/cmsBlock/${id}`, undefined, undefined, ADMIN_TYPE),

  removeItemFromCart: (cartId, itemId) =>
    magento.delete(
      `/V1/carts/${cartId}/items/${itemId}`,
      undefined,
      ADMIN_TYPE,
    ),

  getOrderList: customerId => {
    console.log('getting orders for: ', customerId);

    const path = '/V1/orders';
    const params = {
      'searchCriteria[filterGroups][0][filters][0][field]': 'customer_id',
      'searchCriteria[filterGroups][0][filters][0][value]': customerId,
    };
    return magento.get(path, params, undefined, ADMIN_TYPE);
  },

  getLinkedProducts: (sku, type) =>
    magento.get(
      `/V1/products/${sku}/links/${type}`,
      undefined,
      undefined,
      ADMIN_TYPE,
    ),

  getProductReviews: productId =>
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

  postGuestReview: review =>
    magento.post('/V1/mma/review/guest/post', review, ADMIN_TYPE),
});
