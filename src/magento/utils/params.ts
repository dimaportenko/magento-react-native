export type SearchCriteriasParams = {
  field: string;
  value: string;
  conditionType: string;
};

export type SearchCriteriasType =
  | {
      groups?: SearchCriteriasParams[][];
    }
  | SearchCriteriasParams[]
  | SearchCriteriasParams;

export const getParamsFromSearchCriterias = (
  searchCriterias: SearchCriteriasType,
) => {
  if ('groups' in searchCriterias && searchCriterias.groups) {
    let params = {};
    searchCriterias.groups.forEach((item, index) => {
      params = { ...params, ...getParamsFromSearchCriteriaGroup(item, index) };
    });
    return params;
  } else if ('length' in searchCriterias && searchCriterias.length) {
    return getParamsFromSearchCriteriaGroup(searchCriterias, 0);
  } else if ('field' in searchCriterias) {
    return getParamsFromSearchCriteriaItem(searchCriterias);
  }
  return {};
};

const getParamsFromSearchCriteriaGroup = (
  group: SearchCriteriasParams[],
  groupNumber: number,
) => {
  let params = {};
  group.forEach((item, index) => {
    params = {
      ...params,
      ...getParamsFromSearchCriteriaItem(item, groupNumber, index),
    };
  });
  return params;
};

const getParamsFromSearchCriteriaItem = (
  searchCriteria: SearchCriteriasParams,
  filterGroups = 0,
  filters = 0,
) => ({
  [`searchCriteria[filterGroups][${filterGroups}][filters][${filters}][field]`]:
    searchCriteria.field,
  [`searchCriteria[filterGroups][${filterGroups}][filters][${filters}][value]`]:
    searchCriteria.value,
  [`searchCriteria[filterGroups][${filterGroups}][filters][${filters}][condition_type]`]:
    searchCriteria.conditionType,
});
