import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { MaterialHeaderButtons, Item } from './Header';
import { uiProductListTypeGrid } from '../../actions';

const HeaderGridToggleIcon = () => {
  const dispatch = useDispatch();
  const isGrid = useSelector(({ ui }) => ui.listTypeGrid);

  const onPress = () => {
    dispatch(uiProductListTypeGrid(!isGrid));
  };

  return (
    <MaterialHeaderButtons>
      <Item
        title="Change layout"
        iconName={isGrid ? 'list' : 'grid-on'}
        onPress={onPress}
      />
    </MaterialHeaderButtons>
  );
};

HeaderGridToggleIcon.propTypes = {
  changeGridValueFunction: PropTypes.func,
};

export { HeaderGridToggleIcon };
