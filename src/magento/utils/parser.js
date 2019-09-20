export const parseNumber = (strg) => {
  strg = strg || '';
  let decimal = '.';
  strg = strg.replace(/[^0-9$.,]/g, '');
  if (strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
  if ((strg.match(new RegExp(`\\${decimal}`, 'g')) || []).length > 1) decimal = '';
  if (decimal != '' && (strg.length - strg.indexOf(decimal) - 1 == 3) && strg.indexOf(`0${decimal}`) !== 0) decimal = '';
  strg = strg.replace(new RegExp(`[^0-9$${decimal}]`, 'g'), '');
  strg = strg.replace(',', '.');
  return parseFloat(strg);
};
