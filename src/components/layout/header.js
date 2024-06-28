import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment, useState } from 'react';
import { Trans, withTranslation, useTranslation } from 'react-i18next';

import {
  isEmpty,
  getReduxState,
  getSearchParameterCookie,
  deleteSearchParameterCookie,
} from 'utils';
import { isCurrentPath } from 'utils/routes-helper';

import isUATEnvironment from 'app/app.env';
import { ROUTES, ROLES, history } from 'app';

import sl from 'components/selector/selector';
import PopupAlert from 'components/form/popup-alert';
import useCommittedRef from 'components/hooks/use-committed-ref';

import {
  authLogin,
  verifyOTP,
  resendOTP,
  resetError,
  authLogOut,
  toggleLoginModal,
} from 'auth';
import { Authorization } from 'payment/components/authorization';
import ContactVerificationModal from 'sender/components/contact-verification-modal';

const SenderLoginSignin = (props) => {
  const { t } = useTranslation();
  const { isFetchingGuestInfo } = props;

  return (
    <React.Fragment>
      <div className="drop-down-parent">
        <button className="d-md-none btn btn-sm btn-link text-muted">
          <i className="d-md-none ion-ios-menu burger-menu text-primary" />
        </button>

        <ul className="drop-down-list">
          <li>
            <Link className="nounderline" to={ROUTES.SENDER_SIGN_UP}>
              <button
                disabled={isFetchingGuestInfo}
                className="btn w-100 btn-green"
              >
                {t('auth.Sign up')}
              </button>
            </Link>
          </li>
          <li>
            <Link className="nounderline" to={ROUTES.SENDER_SIGN_IN}>
              <button
                disabled={isFetchingGuestInfo}
                className="btn w-100 btn-normal text-muted"
              >
                {t('auth.Sign in')}
              </button>
            </Link>
          </li>
        </ul>
      </div>
      <Link className="nounderline" to={ROUTES.SENDER_SIGN_UP}>
        <button
          style={{ fontSize: '1rem' }}
          disabled={isFetchingGuestInfo}
          className="d-none d-md-inline btn btn-sm btn-green"
        >
          {t('auth.Sign up')}
        </button>
      </Link>
      <Link to={ROUTES.SENDER_SIGN_IN}>
        <button
          disabled={isFetchingGuestInfo}
          className="d-none d-md-inline btn btn-sm btn-link text-green"
          style={{ fontSize: '1rem' }}
        >
          {t('auth.Sign in')}
        </button>
      </Link>
    </React.Fragment>
  );
};

const UserDropDownMenu = (props) => {
  const { t } = useTranslation();
  const { user, authLogOut, kycStatus, paymentDetail } = props;
  const [isMenuOpen, toggleMenu] = useState(false);
  const [isSendMenuOpen, toggleSendMenu] = useState(false);
  const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState(false);

  const sendRef = useCommittedRef();

  const cancelTransaction = () => {
    history.push(ROUTES.DASHBOARD);

    return setIsConfirmBoxOpen(false);
  };

  const toggleConfirmationBox = () => {
    return setIsConfirmBoxOpen(!isConfirmBoxOpen);
  };

  const showMoveMoney = (path) => {
    const location = useLocation();
    const { state } = location;

    switch (path) {
      case ROUTES.DASHBOARD:
      case ROUTES.SENDER_PROFILE:
      case ROUTES.BENEFICIARY_LIST:
      case ROUTES.SENDER_BANK_ACCOUNT:
      case ROUTES.UPGRADE_TIER:
      case ROUTES.SENDER_SETTINGS:
      case ROUTES.HOME:
      case ROUTES.ABOUT_US:
      case ROUTES.CONTACT:
      case ROUTES.PRIVACY_POLICY:
      case ROUTES.TERMS_OF_SERVICE:
      case ROUTES.SENDER_ACCOUNT_SETUP:
      case ROUTES.NEW_BENEFICIARY:
      case ROUTES.TRANSACTIONS:
      case ROUTES.SENDER_CARD_ACCOUNT:
        return true;

      case ROUTES.SENDER_CONTACT_VERIFICATION:
        return state.redirectedFrom === ROUTES.DASHBOARD;

      case ROUTES.REVIEW_DETAILS:
        if (isEmpty(paymentDetail.country)) {
          return true;
        }
        break;

      default:
        return false;
    }
  };

  return (
    <React.Fragment>
      <Authorization allowedRoles={ROLES.getUserGroup()}>
        <div
          className="drop-down-parent"
          onClick={() => toggleMenu(!isMenuOpen)}
        >
          <button className="btn btn-sm btn-link text-muted">
            <span style={{ fontSize: '16px' }} className="d-none d-md-inline">
              {user.fullName}{' '}
            </span>
            <i className="d-none d-md-inline icon ion-ios-arrow-down" />
            <i className="d-md-none ion-ios-menu burger-menu text-primary" />
          </button>

          {isMenuOpen && (
            <ul className="drop-down-list">
              <li>
                <Link className="nounderline" to={ROUTES.PAYMENT_DETAILS}>
                  <button className="d-md-none btn btn-sm btn-outline-green rounded-0">
                    {t('button.Send Money')}
                  </button>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD}>{t('auth.Dashboard')}</Link>
              </li>
              <li>
                <Link to={ROUTES.SENDER_PROFILE}>{t('auth.My Account')}</Link>
              </li>
              <li>
                <Link to={ROUTES.UPGRADE_TIER}>
                  {t('sender.Upgrade Limit')}
                </Link>
              </li>
              <li onClick={authLogOut}>{t('auth.Logout')}</li>
            </ul>
          )}
        </div>

        {showMoveMoney(window.location.pathname) ? (
          <div
            className="drop-down-parent"
            onClick={() => toggleSendMenu(!isSendMenuOpen)}
          >
            <button className="d-none d-md-inline btn btn-sm btn-green">
              {t('button.Move Money')}
              <i
                className={`icon ion-ios-${
                  isSendMenuOpen ? 'arrow-up' : 'arrow-down'
                } bold ml-3`}
              />
            </button>
            {isSendMenuOpen && (
              <ul ref={sendRef} className="drop-down-list move-money">
                <li>
                  <Link to={ROUTES.PAYMENT_DETAILS}>
                    <i className="icon ion-md-send pr-2 text-muted" />
                    {t('button.Send')}
                  </Link>
                </li>
                <li className="disabled">
                  <i className="icon ion-md-download pr-2 text-muted" />
                  {t('button.Request')}
                </li>
                <li className="disabled">
                  <i className="icon ion-md-code-working pr-2 text-muted" />
                  {t('button.Transfer')}
                </li>
                <li className="disabled">
                  <i className="icon ion-md-add pr-2 text-muted" />
                  {t('button.Deposit')}
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button
            className="d-none d-md-inline btn btn-sm btn-green"
            onClick={() => setIsConfirmBoxOpen(true)}
          >
            {t('button.Cancel')}
          </button>
        )}
        <PopupAlert
          title={t('dashboard.Discard Transaction?')}
          message={t('dashboard.Are you sure you want to leave this screen?')}
          className="outline-danger"
          alert={isConfirmBoxOpen}
          asyncAction={cancelTransaction}
          actionName={t('button.Leave')}
          cancelName={t('button.Stay')}
          toggleConfirmationBox={toggleConfirmationBox}
        />
      </Authorization>
      <Authorization allowedRoles={ROLES.getAdminGroup()}>
        <button className="btn btn-sm btn-link text-muted">
          <span className="btn btn-sm m-0 p-0 pr-1">
            <i className="icon ion-ios-contact h4" />
          </span>
          <span>{user.fullName} </span>
        </button>
        <div className="pt-1">
          <button onClick={authLogOut} className="btn btn-sm btn-outline-green">
            {t('auth.Logout')}
          </button>
        </div>
      </Authorization>
    </React.Fragment>
  );
};

const Logo = () => {
  return (
    <Fragment>
      <h2 className=" logo-color">XYPAY</h2>
    </Fragment>
  );
};

class HeaderComponent extends Component {
  state = {
    isContactVerificationModalOpen: false,
  };

  componentDidMount = () => {
    const { toggleLoginModal } = staticSelector.select(this.props);

    if (this.isLoginRequired()) {
      toggleLoginModal();
    }
  };

  signIn = async (signInCredentials) => {
    const { authLogin, toggleLoginModal } = staticSelector.select(this.props);
    const res = await authLogin(signInCredentials);

    if (this.props.isAuthenticated) {
      toggleLoginModal();
    }

    return {
      res,
      error: this.props.error,
    };
  };

  isLoginRequired = () => {
    const { isAuthenticated } = staticSelector.select(this.props);

    return (
      !isAuthenticated &&
      getSearchParameterCookie() &&
      !isCurrentPath(ROUTES.RESET_PASSWORD)
    );
  };

  handleCloseModal = () => {
    const { toggleLoginModal } = staticSelector.select(this.props);

    if (getSearchParameterCookie()) {
      deleteSearchParameterCookie();
    }
    toggleLoginModal();
  };

  verifyOTP = async (credentials) => {
    const { verifyOTP, toggleLoginModal } = staticSelector.select(this.props);
    const res = await verifyOTP(credentials);

    if (this.props.isAuthenticated) {
      toggleLoginModal();
    }

    return {
      res,
      error: this.props.error,
    };
  };

  resendOTPCode = async (deviceId) => {
    const { resendOTP } = staticSelector.select(this.props);

    const res = await resendOTP(deviceId);

    return { res, error: this.props.error };
  };

  openModal = () => this.setState({ isContactVerificationModalOpen: true });

  closeModal = () => this.setState({ isContactVerificationModalOpen: false });

  render() {
    const {
      t,
      user,
      kycStatus,
      authLogOut,
      paymentDetail,
      isPhoneVerified,
      isEmailVerified,
      isAuthenticated,
      isFetchingGuestInfo,
      isAccountDeleteRequested,
    } = staticSelector.select(this.props);

    const { isContactVerificationModalOpen } = this.state;

    return (
      <React.Fragment>
        {!isCurrentPath(ROUTES.SENDER_CONTACT_VERIFICATION) &&
          (!isPhoneVerified || !isEmailVerified) &&
          isAuthenticated &&
          user.roles[0] !== ROLES.ADMIN && (
            <>
              <div className="text-center alert alert-warning rounded-0 m-0 px-5">
                <i className="icon ion-md-warning mr-2" />
                <Trans i18nKey="sender.We require you to verify your contact before making any more transactions">
                  We require you to verify your contact before making any more
                  transactions. Please click
                  <span
                    className="btn-link cursor-pointer bold text-primary"
                    onClick={this.openModal}
                  >
                    here
                  </span>
                  to verify your contact.
                </Trans>
              </div>
              <ContactVerificationModal
                closeModal={this.closeModal}
                isContactVerificationModalOpen={isContactVerificationModalOpen}
              />
            </>
          )}

        {isAccountDeleteRequested && isAuthenticated && (
          <div className="text-center alert alert-warning rounded-0 m-0 px-5">
            <i className="icon ion-md-warning mr-2" />
            <Trans i18nKey="sender.Account Deletion Process Message">
              Your account is under the deletion process as per your request.
              You won’t be able to perform any activity until deletion. If the
              account deletion request was not initiated by you, please contact
              customer support at <a href="tel:+23231091576">+23231091576</a> /
              <a
                href="mailto:hello@XYPAY.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                hello@XYPAY.com
              </a>
              .
            </Trans>
          </div>
        )}

        {isUATEnvironment() && (
          <div className="text-center alert alert-warning rounded-0 m-0">
            <i className="icon ion-md-warning mr-2" />
            {t(
              'navbar.This is a test site Please do not enter your personal or financial information'
            )}
          </div>
        )}

        <header className="py-4">
          <div className="container d-flex justify-content-between align-items-center">
            <Link to={ROUTES.DASHBOARD}>
              <Logo />
            </Link>

            <div className="row m-0 mt-1 right">
              <ul className="d-none d-md-block left home-menu">
                <li className="">
                  <Link to={ROUTES.HOME}>Home</Link>
                </li>
                <li className="">
                  <Link to={ROUTES.ABOUT_US}>About Us</Link>
                </li>
                <li className="">
                  <Link to={ROUTES.CONTACT}>Contact Us</Link>
                </li>
              </ul>

              {isAuthenticated ? (
                <UserDropDownMenu
                  user={user}
                  kycStatus={kycStatus}
                  authLogOut={authLogOut}
                  paymentDetail={paymentDetail}
                />
              ) : (
                <SenderLoginSignin isFetchingGuestInfo={isFetchingGuestInfo} />
              )}
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

SenderLoginSignin.propTypes = {
  isFetchingGuestInfo: PropTypes.bool,
};

UserDropDownMenu.propTypes = {
  user: PropTypes.object,
  authLogOut: PropTypes.func,
  kycStatus: PropTypes.string,
  paymentDetail: PropTypes.object,
};

HeaderComponent.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
  error: PropTypes.string,
  kycStatus: PropTypes.string,
  authLogin: PropTypes.func,
  verifyOTP: PropTypes.func,
  resendOTP: PropTypes.func,
  resetError: PropTypes.func,
  authLogOut: PropTypes.func,
  isLoggingIn: PropTypes.bool,
  isOTPResent: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  isResendingOTP: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,
  isEmailVerified: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  paymentDetail: PropTypes.object,
  toggleLoginModal: PropTypes.func,
  isFetchingGuestInfo: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  user: sl.object({
    fullName: sl.string(null),
    roles: sl.list(sl.string('')),
  }),
  error: sl.string(),
  authLogin: sl.func(),
  verifyOTP: sl.func(),
  resendOTP: sl.func(),
  resetError: sl.func(),
  authLogOut: sl.func(),
  kycStatus: sl.string(''),
  toggleLoginModal: sl.func(),
  paymentDetail: sl.object({
    country: sl.string(''),
  }),
  isLoggingIn: sl.boolean(false),
  isModalOpen: sl.boolean(false),
  isOTPResent: sl.boolean(false),
  isResendingOTP: sl.boolean(false),
  isPhoneVerified: sl.boolean(false),
  isEmailVerified: sl.boolean(false),
  isAuthenticated: sl.boolean(false),
  isFetchingGuestInfo: sl.boolean(false),
  isAccountDeleteRequested: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    // data states
    isAccountDeleteRequested: getReduxState(
      ['auth', 'isAccountDeleteRequested'],
      state
    ),
    user: getReduxState(['auth', 'user'], state),
    error: getReduxState(['auth', 'error'], state),
    isLoggingIn: getReduxState(['auth', 'isLoggingIn'], state),
    isOTPResent: getReduxState(['auth', 'isOTPResent'], state),
    isResendingOTP: getReduxState(['auth', 'isResendingOTP'], state),
    isAuthenticated: getReduxState(['auth', 'isAuthenticated'], state),
    isEmailVerified: getReduxState(['auth', 'isEmailVerified'], state),
    isPhoneVerified: getReduxState(['auth', 'isPhoneVerified'], state),
    kycStatus: getReduxState(['auth', 'kycStatus'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),

    // UI states
    isModalOpen: getReduxState(['auth', 'isModalOpen'], state),
    isFetchingGuestInfo: getReduxState(['auth', 'isFetchingGuestInfo'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      authLogin,
      resendOTP,
      verifyOTP,
      authLogOut,
      resetError,
      toggleLoginModal,
    },
    dispatch
  );

const Header = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
);

export default Header;
