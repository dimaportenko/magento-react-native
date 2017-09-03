import { magento } from '../magento';

export const getProductImageFromAttribute = product => {
	let result = magento.getProductMediaUrl();
	product.custom_attributes.map(attribute => {
		if (attribute.attribute_code === 'thumbnail') {
			result += attribute.value;
		}
		return attribute.value;
	});
	return result;
};

export const getProductCustomAttribute = (product, key) => {
	const attributes = product.custom_attributes.filter(attribute => {
		return attribute.attribute_code === key;
	});

	if (attributes.length) {
		return attributes[0];
	}
	return false;
};
