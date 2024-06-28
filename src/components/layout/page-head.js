import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import sl from 'components/selector/selector';

export const withTitle = (Page, title) => {
  class Wrapper extends React.Component {
    render() {
      return (
        <React.Fragment>
          <PageHead title={title} />
          <Page {...this.props} />
        </React.Fragment>
      );
    }
  }

  return Wrapper;
};

export const PageHead = (props) => {
  const { title } = staticSelector.select(props);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

PageHead.propTypes = {
  title: PropTypes.string,
};

const staticSelector = sl.object({
  title: sl.string('KanaCash'),
});
