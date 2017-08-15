import Magento from '../magento';
import { magentoOptions } from '../config/magento';
import {
  MAGENTO_INIT
} from './types';

export const initMagento = () => {
  const magento = new Magento(magentoOptions);

  return (dispatch) => {
    magento.init()
      .then(() => {
        dispatch({ type: MAGENTO_INIT, payload: magento });
      })
      .catch(error => {
        console.log(error);
      });
  };
};
