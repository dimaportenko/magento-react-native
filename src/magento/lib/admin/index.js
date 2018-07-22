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

    getProducts: (categoryId, pageSize = 5, offset = 0) => {
      const currentPage = parseInt(offset / pageSize, 10) + 1;
      return new Promise((resolve, reject) => {
        const path = '/V1/products';
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

        magento.get(path, params, undefined, ADMIN_TYPE)
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
    }


  };
};
