import {ADMIN_TYPE} from '../../types';


const getSortFieldName = (sortOrder) => {
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

const getSortDirection = (sortOrder) => {
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

export default magento => {
  return {
    getStoreConfig: () => {
      return new Promise((resolve, reject) => {
        const path = '/V1/store/storeConfigs';

        magento
          .get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
            magento.setStoreConfig(data[0]);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    updateCustomerData: (id, customer) => {
      // POST /V1/carts/mine/billing-address
      return new Promise((resolve, reject) => {
        const path = `/V1/customers/${id}`;

        magento
            .put(path, customer, undefined, ADMIN_TYPE)
            .then(data => {
              resolve(data);
            })
            .catch(e => {
              console.log(e);
              reject(e);
            });
      });
    },

    getCategoriesTree: () => {
      return new Promise((resolve, reject) => {
        const path = '/V1/categories';
        magento
          .get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCategory: id => {
      return new Promise((resolve, reject) => {
        const path = `/V1/categories/${id}`;
        magento
          .get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCategoryAttributes: attributeCode => {
      // GET /V1/categories/attributes/:attributeCode
      return new Promise((resolve, reject) => {
        const path = `/V1/categories/attributes/${attributeCode}`;
        magento
          .get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCategoriesList: () => {
      // GET /V1/categories/list
      return new Promise((resolve, reject) => {
        const path = '/V1/categories/list';
        const params = {
          'searchCriteria[filterGroups][0][filters][0][field]': 'name',
          'searchCriteria[filterGroups][0][filters][0][value]': 'Woman',
          'searchCriteria[filterGroups][0][filters][0][conditionType]': 'eq',
          'searchCriteria[pageSize]': 20,
          'searchCriteria[currentPage]': 1
        };

        magento
          .get(path, params, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    /**
     * SortOrder can be
     * 0 = Arrange products in ascending order based on their names
     * 1 = Arrange products in descending order based on their names
     * 2 = Arrange products in ascending order based on their prices
     * 3 = Arrange products in descending order based on their prices
     */
    getSearchCreteriaForCategoryAndChild: (category, pageSize = 10, offset = 1, sortOrder, filter) => {
      let level = 0;
      const currentPage = parseInt(offset / pageSize, 10) + 1;
      let result = {
        'searchCriteria[filterGroups][1][filters][0][field]': 'visibility',
        'searchCriteria[filterGroups][1][filters][0][value]': '4',
        'searchCriteria[filterGroups][1][filters][0][conditionType]': 'eq',
        'searchCriteria[pageSize]': pageSize,
        'searchCriteria[currentPage]': currentPage,
      };

      const getForCategory = (cat) => {
        result[`searchCriteria[filterGroups][0][filters][${level}][field]`] = 'category_id';
        result[`searchCriteria[filterGroups][0][filters][${level}][value]`] = cat.id;
        result[`searchCriteria[filterGroups][0][filters][${level}][conditionType]`] = 'eq';
        level++;
        cat.children_data.forEach(childCategory => {
          getForCategory(childCategory);
        });
      };

      getForCategory(category);

      if (typeof sortOrder === 'number') {
        result['searchCriteria[sortOrders][0][field]'] = getSortFieldName(sortOrder);
        result['searchCriteria[sortOrders][0][direction]'] = getSortDirection(sortOrder);
      }

      if (typeof filter !== 'undefined') {
        Object.keys(filter)
          .forEach((key) => {
            let value = filter[key];
            let condition = null;
            // let subQuery = '';
            if (typeof value === 'object') {
              condition = value.condition;
              value = value.value;
              if (condition.includes('from')) {
                const conditions = condition.split(',');
                const values = value.split(',');
                result[`searchCriteria[filterGroups][${level}][filters][${level}][field]`]= key;
                result[`searchCriteria[filterGroups][${level}][filters][${level}][value]`] = values[0];
                result[`searchCriteria[filterGroups][${level}][filters][${level}][condition_type]`] = conditions[0];
                level++;
                result[`searchCriteria[filterGroups][${level}][filters][${level}][field]`] = key;
                result[`searchCriteria[filterGroups][${level}][filters][${level}][value]`] = values[1];
                result[`searchCriteria[filterGroups][${level}][filters][${level}][condition_type]`] = conditions[1];
                level++;
              }
            }
          });
      }

      return magento.admin.getProductsWithSearchCritaria(result);
    },

    getProducts: (categoryId, pageSize = 10, offset = 0, sortOrder, filter) => {
      return magento.admin.getProductsWithAttribute(
        'category_id',
        categoryId,
        pageSize,
        offset,
        sortOrder,
        filter,
        'eq');
    },

    getProductsWithAttribute: (
    attributeCode,
    attributeValue,
    pageSize = 10,
    offset = 0,
    sortOrder,
    filter,
    conditionType = 'like'
    ) => {
      const currentPage = parseInt(offset / pageSize, 10) + 1;
      const currentAttributeValue = conditionType === 'eq' ? attributeValue : `%${attributeValue}%`;
      const params = {
        'searchCriteria[filterGroups][0][filters][0][field]': attributeCode,
        'searchCriteria[filterGroups][0][filters][0][value]': currentAttributeValue,
        'searchCriteria[filterGroups][0][filters][0][conditionType]': conditionType,
        'searchCriteria[filterGroups][1][filters][0][field]': 'visibility',
        'searchCriteria[filterGroups][1][filters][0][value]': '4',
        'searchCriteria[filterGroups][1][filters][0][conditionType]': 'eq',
        'searchCriteria[pageSize]': pageSize,
        'searchCriteria[currentPage]': currentPage
      };
      if (typeof sortOrder === 'number') {
        params['searchCriteria[sortOrders][0][field]'] = getSortFieldName(sortOrder);
        params['searchCriteria[sortOrders][0][direction]'] = getSortDirection(sortOrder);
      }
      if (typeof filter !== 'undefined') {
        Object.keys(filter)
          .forEach((key) => {
            let value = filter[key];
            let condition = null;
            // let subQuery = '';
            if (typeof value === 'object') {
              condition = value.condition;
              value = value.value;
              if (condition.includes('from')) {
                const conditions = condition.split(',');
                const values = value.split(',');
                params[`searchCriteria[filterGroups][2][filters][0][field]`]= key;
                params[`searchCriteria[filterGroups][2][filters][0][value]`] = values[0];
                params[`searchCriteria[filterGroups][2][filters][0][condition_type]`] = conditions[0];
                params[`searchCriteria[filterGroups][3][filters][0][field]`] = key;
                params[`searchCriteria[filterGroups][3][filters][0][value]`] = values[1];
                params[`searchCriteria[filterGroups][3][filters][0][condition_type]`] = conditions[1];
              }
            }
          });
      }

      return magento.admin.getProductsWithSearchCritaria(params);
    },

    getProductsWithSearchCritaria: (searchCriteria) => {
      return new Promise((resolve, reject) => {
        const path = '/V1/products';

        magento.get(path, searchCriteria, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getProductBySku: (sku) => {
      return new Promise((resolve, reject) => {
        const path = `/V1/products/${sku}`;

        magento.get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getFeaturedChildren: ({ page, pageSize = 10, filter }) => {
      return new Promise((resolve, reject) => {
        let path = '/V1/products?';
        path += magento.makeParams({ page, pageSize, filter });
        console.log('PATH:', path);
        magento
          .get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getConfigurableChildren: (sku) => {
      return new Promise((resolve, reject) => {
        const path = `/V1/configurable-products/${sku}/children`;

        magento.get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getConfigurableProductOptions: (sku) => {
      return new Promise((resolve, reject) => {
        const path = `/V1/configurable-products/${sku}/options/all`;

        magento.get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getConfigurableProductOptionById: (sku, id) => {
      return new Promise((resolve, reject) => {
        const path = `/V1/configurable-products/${sku}/options/${id}`;

        magento.get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getProductAttributesOptions: (attributeId) => {
      return new Promise((resolve, reject) => {
        const path = `/V1/products/attributes/${attributeId}/options`;

        magento.get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getAttributeByCode: (attributeCode) => {
      return new Promise((resolve, reject) => {
        const path = `/V1/products/attributes/${attributeCode}`;

        magento.get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getProductMedia: (sku) => {
      return new Promise((resolve, reject) => {
        const path = `/V1/products/${sku}/media`;

        magento.get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCart: customerId => {
      return new Promise((resolve, reject) => {
        const path = `/V1/customers/${customerId}/carts`;

        magento
          .post(path, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getCmsBlock: id => {
      return new Promise((resolve, reject) => {
        // GET /V1/cmsBlock/:blockId
        const path = `/V1/cmsBlock/${id}`;

        magento
          .get(path, undefined, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    removeItemFromCart: (cartId, itemId) => {
      // DELETE /V1/carts/mine/items
      return new Promise((resolve, reject) => {
        const path = `/V1/carts/${cartId}/items/${itemId}`;

        magento
          .delete(path, undefined, ADMIN_TYPE)
          .then(data => {
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    getOrderList: (customerId) => {
      console.log('getting orders for: ', customerId);
      return new Promise((resolve, reject) => {
        const path = '/V1/orders';
        const params = {
          'searchCriteria[filterGroups][0][filters][0][field]': 'customer_id',
          'searchCriteria[filterGroups][0][filters][0][value]': customerId
        };

        magento
          .get(path, params, undefined, ADMIN_TYPE)
          .then(data => {
            console.log('getOrderList response:', data);
            resolve(data);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

  };
};
