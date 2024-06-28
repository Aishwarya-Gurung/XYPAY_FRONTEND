import React from 'react';
import PropTypes from 'prop-types';

import sl from 'components/selector/selector';

const BlinkTextLoader = (props) => {
  const { align, margin, padding, message } = staticSelctor.select(props);

  return (
    <p
      className={`mt-${margin} pt-${padding} text-blink text-${align} text-muted`}
    >
      {message}
    </p>
  );
};

BlinkTextLoader.propTypes = {
  align: PropTypes.string,
  margin: PropTypes.number,
  padding: PropTypes.number,
  message: PropTypes.string,
};

const staticSelctor = sl.object({
  margin: sl.string(1),
  padding: sl.string(1),
  align: sl.string('center'),
  message: sl.string('Loading...'),
});

export default BlinkTextLoader;
