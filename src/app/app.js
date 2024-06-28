import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';
import React, { PureComponent, Suspense } from 'react';

import { initializeGA } from './app.analytics';
import ServerSentEvent from './app.server-sent-event';

import sl from 'components/selector/selector';
import PopupAlert from 'components/form/popup-alert';
import ToSDisclaimer from 'components/common/tos-disclaimer';
import IdleTimeAction from 'components/common/idle-time-action';

import { Routes, PROVIDER, ROLES } from 'app';
import { authLogOut, getSenderInfo } from 'auth';
import { securedLS, getReduxState } from 'utils';

const GettingThingsReady = () => {
  return (
    <div className="container-loader w-100">
      <h5 className="mt-5 pt-5 text-blink text-center text-muted">
        Getting things ready. Please wait...
      </h5>
    </div>
  );
};

class App extends PureComponent {
  state = {
    isSessionExpired: securedLS.get('se').data || false,
  };

  componentDidMount = () => {
    const { isAuthenticated, getSenderInfo } = staticSelector.select(
      this.props
    );

    isAuthenticated && getSenderInfo();
    initializeGA();

    // Note: Sardine is disabled currently
    /* sardine.init();

    if (isAuthenticated) {
      const { user } = staticSelector.select(this.props);

      sardine.updateUserId(user.referenceId);
    } */
  };

  // Note: Sardine is disabled currently
  /* componentDidUpdate = () => {
    const { isAuthenticated } = staticSelector.select(this.props);

    const id = cookie.get(COOKIE_KEY.SESSION_ID).data;

    if (!id) {
      // Note: sardine.init is invoked here again to generate new session if previous session is expired.
      // Each session will be of 30mins.
      sardine.init();

      if (isAuthenticated) {
        const { user } = staticSelector.select(this.props);

        sardine.updateUserId(user.referenceId);
      }
    }
  }; */

  idleTimeAction = async () => {
    const { authLogOut } = staticSelector.select(this.props);

    await authLogOut();
    securedLS.set('se', true);
    this.setState({ isSessionExpired: true });
  };

  clearExpiredSession = () => {
    securedLS.clear('se');
  };

  render() {
    const { user, isAuthenticated, provider, isPrivacyPolicyAccepted } =
      staticSelector.select(this.props);

    return (
      <Suspense fallback={<GettingThingsReady />}>
        {isAuthenticated &&
          !ROLES.isAdmin(user.roles) &&
          (provider === PROVIDER.MIGRATED || !isPrivacyPolicyAccepted) && (
            <ToSDisclaimer />
          )}
        <ServerSentEvent />
        <IdleTimeAction
          time={30}
          action={this.idleTimeAction}
          isAuthenticated={isAuthenticated}
        />
        {this.state.isSessionExpired && (
          <PopupAlert
            alert={true}
            className={'danger'}
            message={'Your session has expired due to inactivity'}
            syncAction={this.clearExpiredSession}
          />
        )}
        <ToastContainer autoClose={5000} />
        <Routes />
      </Suspense>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  authLogOut: PropTypes.func,
  provider: PropTypes.string,
  isAuthenticated: PropTypes.bool,
};

const staticSelector = sl.object({
  user: sl.object({
    referenceId: sl.string(''),
    roles: sl.list(sl.string('')),
  }),
  authLogOut: sl.func(),
  provider: sl.string(''),
  getSenderInfo: sl.func(),
  isAuthenticated: sl.boolean(false),
  isPrivacyPolicyAccepted: sl.boolean(true),
});

/**
 * Maps state to props.
 *
 * @param {Object} state
 */
const mapStateToProps = (state) => {
  return {
    user: getReduxState(['auth', 'user'], state),
    provider: getReduxState(['auth', 'provider'], state),
    isAuthenticated: getReduxState(['auth', 'isAuthenticated'], state),
    isPrivacyPolicyAccepted: getReduxState(
      ['auth', 'isPrivacyPolicyAccepted'],
      state
    ),
  };
};

/**
 * Maps dispatch to props.
 *
 * @param {Function} dispatch
 */
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      authLogOut,
      getSenderInfo,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);
