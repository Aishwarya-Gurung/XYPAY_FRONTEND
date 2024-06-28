import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { ROLES, ROUTES } from 'app';
import { getReduxState } from 'utils';
import sl from 'components/selector/selector';

const isAllowed = (allowedRoles, userRoles) => {
  if (userRoles.length === 0) {
    userRoles.push(ROLES.PUBLIC);
  }

  return userRoles.some((role) => {
    if (allowedRoles.includes(role)) {
      return true;
    }

    return false;
  });
};

class AuthorizeUser extends Component {
  render() {
    const {
      user: { roles },
    } = staticSelector.select(this.props);
    const { children, allowedRoles } = this.props;

    if (isAllowed(allowedRoles, roles)) {
      return children;
    }

    return null;
  }
}

AuthorizeUser.propTypes = {
  children: PropTypes.any,
  allowedRoles: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    user: getReduxState(['auth', 'user'], state),
  };
};

export const Authorization = withTranslation()(
  connect(mapStateToProps)(AuthorizeUser)
);

export const withAuthorization = (
  wrappedComponent,
  allowedRoles,
  redirect = null
) => {
  class Wrapper extends Component {
    render() {
      const {
        user: { roles },
      } = staticSelector.select(this.props);
      const WrappedComponent = wrappedComponent;

      if (isAllowed(allowedRoles, roles)) {
        return <WrappedComponent {...this.props} />;
      }

      if (redirect) {
        return <Redirect to={redirect} />;
      }

      return null;
    }
  }

  return Wrapper;
};

export const withPublicAuthorization = (wrappedComponent) => {
  class Wrapper extends Component {
    render() {
      const {
        isSignedIn,
        user: { roles },
      } = staticSelector.select(this.props);
      const WrappedComponent = wrappedComponent;

      if (isSignedIn && isAllowed(ROLES.getAdminGroup(), roles)) {
        return <Redirect to={ROUTES.ADMIN_DASHBOARD} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  return Wrapper;
};

const staticSelector = sl.object({
  isSignedIn: sl.boolean(false),
  allowedRoles: sl.list(sl.string('')),
  user: sl.object({
    roles: sl.list(sl.string('')),
  }),
});
