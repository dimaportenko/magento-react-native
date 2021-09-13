import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialHeaderButtons, Item } from './Header';
import { uiProductListTypeGrid } from '../../actions';
import { StoreStateType } from '../../reducers';

const HeaderGridToggleIcon = () => {
  const dispatch = useDispatch();
  const isGrid = useSelector(({ ui }: StoreStateType) => ui.listTypeGrid);

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

export { HeaderGridToggleIcon };
