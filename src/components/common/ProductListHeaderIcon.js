import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MaterialHeaderButtons, Item } from './Header';

const HeaderIcon = ({
  changeGridValueFunction = () => {},
}) => {
  const GRID_LAYOUT_ICON = 'grid-on';
  const LIST_LAYOUT_ICON = 'list';
  const [icon, setIcon] = useState(GRID_LAYOUT_ICON);

  const onPress = () => {
    setIcon(icon === GRID_LAYOUT_ICON ? LIST_LAYOUT_ICON : GRID_LAYOUT_ICON);
    changeGridValueFunction();
  };

  return (
    <MaterialHeaderButtons>
      <Item title="Change layout" iconName={icon} onPress={onPress} />
    </MaterialHeaderButtons>
  );
};

HeaderIcon.propTypes = {
  changeGridValueFunction: PropTypes.func,
};

export { HeaderIcon };
