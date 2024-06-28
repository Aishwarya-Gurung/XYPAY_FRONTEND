import React from 'react';
import PropsTypes from 'prop-types';

const ReloadRoute = (props) => {
  return <React.Fragment>{window.location.replace(props.to)}</React.Fragment>;
};

ReloadRoute.propTypes = {
  to: PropsTypes.string,
};

export default ReloadRoute;
