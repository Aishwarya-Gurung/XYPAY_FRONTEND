import React from 'react';
import PropTypes from 'prop-types';

const AccountLayout = (props) => {
  const { children } = props;

  return (
    <React.Fragment>
      <div className="col-md-12 shadow-line"></div>
      <div className="page">
        <section className="container">
          <div className="row justify-content-between my-3">
            <div className="col-12 mb-4"></div>
            {children}
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

AccountLayout.propTypes = {
  children: PropTypes.array,
};

export default AccountLayout;
