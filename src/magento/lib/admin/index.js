import { ADMIN_TYPE } from '../../types';

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

    getSearchCreteriaForCategoryAndChild: (category, pageSize = 10, offset = 1) => {
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

      return magento.admin.getProductsWithSearchCritaria(result);
    },

    getProducts: (categoryId, pageSize = 10, offset = 0) => {
      const currentPage = parseInt(offset / pageSize, 10) + 1;
      const params = {
        'searchCriteria[filterGroups][0][filters][0][field]': 'category_id',
        'searchCriteria[filterGroups][0][filters][0][value]': categoryId,
        'searchCriteria[filterGroups][0][filters][0][conditionType]': 'eq',
        'searchCriteria[filterGroups][1][filters][0][field]': 'visibility',
        'searchCriteria[filterGroups][1][filters][0][value]': '4',
        'searchCriteria[filterGroups][1][filters][0][conditionType]': 'eq',
        'searchCriteria[pageSize]': pageSize,
        'searchCriteria[currentPage]': currentPage
      };

      return magento.admin.getProductsWithSearchCritaria(params);
    },

    getProductsWithAttribute: (attributeCode, attributeValue, pageSize = 10, offset = 0) => {
      const currentPage = parseInt(offset / pageSize, 10) + 1;
      const params = {
        'searchCriteria[filterGroups][0][filters][0][field]': attributeCode,
        'searchCriteria[filterGroups][0][filters][0][value]': attributeValue,
        'searchCriteria[filterGroups][0][filters][0][conditionType]': 'eq',
        'searchCriteria[filterGroups][1][filters][0][field]': 'visibility',
        'searchCriteria[filterGroups][1][filters][0][value]': '4',
        'searchCriteria[filterGroups][1][filters][0][conditionType]': 'eq',
        'searchCriteria[pageSize]': pageSize,
        'searchCriteria[currentPage]': currentPage
      };

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

  };
};
