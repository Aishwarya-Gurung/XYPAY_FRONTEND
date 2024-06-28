import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { withTranslation, useTranslation } from 'react-i18next';

import { ROUTES, PAGE } from 'app';
import { resendVerificationLink } from 'sender';
import { verifyEmailID, toggleLoginModal } from 'auth';
import { getReduxState, getValueOfParam } from 'utils';

import sl from 'components/selector/selector';
import { PageHead } from 'components/layout/page-head';
import { DashboardLoadingSpinner } from 'components/form/loading-container';

import { ReactComponent as InfoIcon } from 'assets/img/info-icon.svg';

/**
 * Handles verify email link.
 *
 */
class VerifyEmail extends Component {
  state = {
    verify: false,
  };

  componentDidMount = () => {
    const { isAuthenticated, toggleLoginModal } = staticSelector.select(
      this.props
    );

    if (isAuthenticated) {
      return this.verifyEmail();
    }

    toggleLoginModal();
  };

  /**
   * @param {Object} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { isAuthenticated } = staticSelector.select(this.props);

    if (prevProps.isAuthenticated !== isAuthenticated) {
      this.verifyEmail();
    }
  };

  /**
   * Verifies email.
   *
   */
  verifyEmail = () => {
    const { verifyEmailID, isAuthenticated } = staticSelector.select(
      this.props
    );

    if (isAuthenticated) {
      const verificationToken = getValueOfParam(this.props, 'token');

      return verifyEmailID(verificationToken);
    }
  };

  /**
   * Renders view.
   *
   */
  render() {
    const {
      t,
      error,
      isAuthenticated,
      isEmailVerified,
      isVLinkResending,
      toggleLoginModal,
      isVerifyingEmail,
      resendVerificationLink,
    } = staticSelector.select(this.props);

    if (!isAuthenticated) {
      return <Authenticate toggleLoginModal={toggleLoginModal} />;
    }

    if (isEmailVerified) {
      return (
        <Redirect
          to={{
            pathname: ROUTES.SENDER_VERIFICATION,
            state: {
              from: this.props.location,
            },
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <PageHead title={PAGE.VERIFY_EMAIL} />
        {isVerifyingEmail ? (
          <Loader />
        ) : (
          <section className="container">
            <div className="row justify-content-between my-5">
              <div className="col-2 m-auto mb-2">
                <InfoIcon />
              </div>
              <div className="col-12">
                <div className="col-sm-6 m-auto text-center">
                  {error ? (
                    <ErrorInVerification
                      error={error}
                      isVLinkResending={isVLinkResending}
                      resendVerificationLink={resendVerificationLink}
                    />
                  ) : (
                    <span className="h5 text-danger">
                      {t('auth.Email verification link is invalid')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </React.Fragment>
    );
  }
}

/**
 * Shows signin model to authenticate user.
 *
 * @param {Object} props
 */
const Authenticate = (props) => {
  const { toggleLoginModal } = props;

  return (
    <section className="container">
      <div className="justify-content-between cityscape position-relative">
        <div className="mt-5 pt-5 col-2 m-auto">
          <InfoIcon />
        </div>
        <div className="col-12">
          <div className="col-sm-6 m-auto text-center text-danger">
            <i className="icon ion-md-warning"></i> Please{' '}
            <span
              onClick={toggleLoginModal}
              className="btn-link cursor-pointer text-danger"
            >
              <strong>Sign in</strong>
            </span>{' '}
            to verify your email.
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Loader component.
 */
const Loader = () => (
  <section className="container">
    <div className="row justify-content-between cityscape position-relative">
      <DashboardLoadingSpinner />
    </div>
  </section>
);

/**
 * Shows error if occured during verifying email.
 *
 * @param {Object} props
 */
const ErrorInVerification = (props) => {
  const { t } = useTranslation();
  const { error, isVLinkResending, resendVerificationLink } = props;

  return (
    <div>
      <span className="h5 text-danger d-block">{error}</span>
      <span>
        {isVLinkResending ? (
          t('verification.Sending')
        ) : (
          <button
            onClick={resendVerificationLink}
            className="btn btn-sm btn-link d-block m-auto"
          >
            <i className="icon ion-md-paper-plane"></i>{' '}
            {t('verification.Resend Verification Link')}
          </button>
        )}
      </span>
    </div>
  );
};

Authenticate.propTypes = {
  toggleLoginModal: PropsTypes.func,
};

ErrorInVerification.propTypes = {
  t: PropsTypes.func,
  error: PropsTypes.string,
  isVLinkResending: PropsTypes.bool,
  resendVerificationLink: PropsTypes.func,
};

VerifyEmail.propTypes = {
  t: PropsTypes.func,
  error: PropsTypes.string,
  location: PropsTypes.object,
  isLoggingIn: PropsTypes.bool,
  isModalOpen: PropsTypes.bool,
  isVLinkResent: PropsTypes.bool,
  verifyEmailID: PropsTypes.func,
  isAuthenticated: PropsTypes.bool,
  isEmailVerified: PropsTypes.bool,
  toggleLoginModal: PropsTypes.func,
  isVLinkResending: PropsTypes.bool,
  isVerifyingEmail: PropsTypes.bool,

  resendVerificationLink: PropsTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  error: sl.string(''),
  verifyEmailID: sl.func(),
  toggleLoginModal: sl.func(),
  isModalOpen: sl.boolean(false),
  isLoggingIn: sl.boolean(false),
  isVLinkResent: sl.boolean(false),
  resendVerificationLink: sl.func(),
  isAuthenticated: sl.boolean(false),
  isEmailVerified: sl.boolean(false),
  isVerifyingEmail: sl.boolean(false),
  isVLinkResending: sl.boolean(false),
});

/**
 * Maps states to props.
 *
 * @param {Object} state
 */
const mapStateToProps = (state) => {
  return {
    error: getReduxState(['auth', 'error'], state),
    isModalOpen: getReduxState(['auth', 'isModalOpen'], state),
    isLoggingIn: getReduxState(['auth', 'isLoggingIn'], state),
    isVLinkResent: getReduxState(['sender', 'isVLinkResent'], state),
    isAuthenticated: getReduxState(['auth', 'isAuthenticated'], state),
    isEmailVerified: getReduxState(['auth', 'isEmailVerified'], state),
    isVerifyingEmail: getReduxState(['auth', 'isVerifyingEmail'], state),
    isVLinkResending: getReduxState(['sender', 'isVLinkResending'], state),
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
      verifyEmailID,
      toggleLoginModal,
      resendVerificationLink,
    },
    dispatch
  );

export const VerifyEmailView = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
);
