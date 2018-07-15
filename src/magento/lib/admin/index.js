import { ADMIN_TYPE } from '../../types';

export default magento => {
  return {
    getStoreConfig: () => {
      return new Promise((resolve, reject) => {
        const path = '/V1/store/storeConfigs';

        magento.get(path, null, null, ADMIN_TYPE)
          .then(data => {
            resolve(data);
            magento.setStoreConfig(data[0]);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    }
  };
};
