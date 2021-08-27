export const getParamsFromSearchCriterias = searchCriterias => {
  if (searchCriterias.groups) {
    let params = {};
    searchCriterias.groups.forEach((item, index) => {
      params = { ...params, ...getParamsFromSearchCriteriaGroup(item, index) };
    });
    return params;
  } else if (searchCriterias.length) {
    return getParamsFromSearchCriteriaGroup(searchCriterias, 0);
  } else {
    return getParamsFromSearchCriteriaItem(searchCriterias);
  }
};

const getParamsFromSearchCriteriaGroup = (group, groupNumber) => {
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
  searchCriteria,
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
