import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import React, { useState, useEffect } from 'react';
import { useTranslation, Trans, withTranslation } from 'react-i18next';

import { getDeviceFingerPrint } from 'sender';
import ResendTimer from 'sender/components/resend-timer';
import { VCODE_RESEND_TIME_INTERVAL } from 'sender/sender.constant';

import {
  securedLS,
  isInputEmpty,
  getReduxState,
  validateNumber,
  getSearchParameterCookie,
  deleteSearchParameterCookie,
} from 'utils';
import { redirectBasedOnCookieParameter } from 'utils/routes-helper';

import {
  LOGIN,
  LS_KEY,
  authLogin,
  verifyOTP,
  resendOTP,
  resetError,
  RESEND_OTP_CODE,
  OTP_VERIFICATION,
  INITIALIZE_OTP_VERIFICATION,
} from 'auth';
import { ROUTES, history } from 'app';
import sl from 'components/selector/selector';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const checkSpaceInPassword = (password) => {
  return /\s/g.test(password);
};

const SenderSignIn = (props) => {
  const {
    resendOTP,
    verifyOTP,
    resetError,
    isLoggingIn,
    isOTPResent,
    isResendingOTP,
  } = staticSelector.select(props);

  const { t } = useTranslation();

  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState(null);
  const [fingerPrint, setFingerPrint] = useState(null);
  const [isOTPRequired, setOTPRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [timer, setTimer] = useState(VCODE_RESEND_TIME_INTERVAL);

  useEffect(() => {
    (async function fetchFingerPrint() {
      const fingerPrint = await getDeviceFingerPrint();

      setFingerPrint(fingerPrint);
      securedLS.set(LS_KEY.DEVICE_FINGER_PRINT, fingerPrint);
    })();
  }, [fingerPrint]);

  const handleResendOTP = async (input) => {
    setError(null);
    input.classList.add('disabled');
    const { type, payload } = await resendOTP(deviceId);

    input.classList.remove('disabled');

    if (type === RESEND_OTP_CODE.ERROR) {
      return setError(payload);
    }

    return setIsTimerStarted(true);
  };

  const signIn = async (signInCredentials) => {
    const { authLogin } = staticSelector.select(props);
    const response = await authLogin(signInCredentials);

    return {
      response,
      error: response.type === LOGIN.ERROR && response.payload,
    };
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    let input = null;
    const signInCredentials = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];
      if (
        (input.name === 'email' || input.name === 'password') &&
        isInputEmpty(input)
      ) {
        return setError(i18n.t('validation.Email or password cannot be empty'));
      }

      if (input.name) {
        signInCredentials[input.name] = input.value;
      }
    }

    signInCredentials.device = fingerPrint;

    const signInResponse = await signIn(signInCredentials);
    const { response, error } = signInResponse;

    if (error) {
      return setError(error);
    }

    if (response.type === INITIALIZE_OTP_VERIFICATION) {
      setOTPRequired(true);

      return setDeviceId(response.deviceId);
    }

    history.push(ROUTES.DASHBOARD);

    if (getSearchParameterCookie()) {
      redirectBasedOnCookieParameter();

      return deleteSearchParameterCookie();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    let input = null;
    const credentials = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (input.name === 'OTPCode' && isInputEmpty(input)) {
        return setError(i18n.t('validation.OTP code required'));
      }

      if (input.name) {
        credentials[input.name] = input.value;
      }
    }

    const { type, payload } = await verifyOTP(credentials);

    if (type === OTP_VERIFICATION.ERROR) {
      return setError(payload);
    }

    history.push(ROUTES.DASHBOARD);

    setOTPRequired(false);
  };

  const handleTimerChange = (time) => {
    setTimer(time);
  };

  return (
    <div className="p-4">
      {!isOTPRequired ? (
        <section className="row">
          <form className="col-12 p-0" onSubmit={handleSignIn}>
            {error && (
              <div className="col-12">
                <span className="text-danger small alert-danger d-flex">
                  <i className="icon ion-md-remove-circle text-danger mr-1" />
                  {error}
                </span>
              </div>
            )}

            <div className="col-12 form-group">
              <label className="w-100">
                <span>{t('auth.Your email address')}</span>
                <input
                  type="email"
                  name="email"
                  className={`${error ? 'is-invalid ' : ''}form-control`}
                  placeholder={t('auth.Your email address')}
                  disabled={isLoggingIn}
                  required
                />
              </label>
            </div>

            <div className="col-md-12 form-group signin-password">
              <label className="w-100">
                <span>{t('auth.Your password')}</span>
                <input
                  required
                  name="password"
                  disabled={isLoggingIn}
                  placeholder={t('auth.Your password')}
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${error ? 'is-invalid ' : ''}form-control`}
                />
                <i
                  className={`show-password icon ion-md-${
                    showPassword ? 'eye-off' : 'eye'
                  }`}
                  title={
                    showPassword
                      ? t('auth.Hide Password')
                      : t('auth.Show Password')
                  }
                  onClick={() => setShowPassword(!showPassword)}
                />

                {error && checkSpaceInPassword(password) && (
                  <div className="password-warning small p-1">
                    <i className="icon ion-md-warning mr-1" />
                    {t(
                      'auth.The entered password has space(s) Please verify your password before trying to log in'
                    )}
                  </div>
                )}
              </label>
            </div>

            <div className="col-12 mb-4">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn btn-lg btn-green btn-block"
              >
                {isLoggingIn && <WhiteSpinner />}
                {t('auth.Sign in and Continue')}
              </button>
            </div>
          </form>

          <div className="col-md-6">
            <Link to={ROUTES.SENDER_SIGN_UP} className="bold">
              {t('auth.Sign up for Free!')}
            </Link>
          </div>
          <div className="col-md-6 text-md-right">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-muted"
              onClick={resetError}
            >
              {t('auth.Forgot Password?')}
            </Link>
          </div>
        </section>
      ) : (
        <section className="row">
          <form
            className="col-12 p-0"
            autoComplete="off"
            onSubmit={handleVerifyOTP}
          >
            {error && (
              <div className="col-12">
                <span className="d-flex text-danger small alert-danger">
                  <i className="icon ion-md-remove-circle text-danger mr-1" />
                  {error}
                </span>
              </div>
            )}
            <div className="col-12 form-group">
              <p className="bold text-danger text-center mb-1">
                {t('auth.A login from a new device has been detected')}
              </p>
              <p className="text-center mb-0">
                <i className="icon ion-md-desktop h1" />
                <i className="ion-md-phone-portrait h4 phone-icon" />
                <i className="ion-md-tablet-portrait h3 tablet-icon" />
              </p>
              <p className="text-left text-primary">
                <Trans i18nKey="auth.OTPMsg">
                  Please enter a code which was
                  <span className="bold text-success">
                    sent to your email address
                  </span>{' '}
                  to authorize the device.
                </Trans>
              </p>
            </div>
            <div className="col-12 form-group text-left">
              <input
                type="text"
                name="deviceId"
                className="d-none"
                defaultValue={deviceId}
                required
              />
              <input
                required
                type="text"
                maxLength="6"
                name="OTPCode"
                autoComplete="off"
                disabled={isLoggingIn}
                onKeyDown={validateNumber}
                placeholder={t('auth.Enter the Code')}
                className={`${error ? 'is-invalid ' : ''}form-control`}
              />
            </div>
            <div className="col-12 form-group mb-4">
              {isResendingOTP && <span>{t('auth.Resending Code')}</span>}
              {isOTPResent && !isResendingOTP && (
                <span>
                  <i className="icon ion-md-checkmark-circle text-success p-1" />{' '}
                  {t('auth.Successfully sent the code')}
                </span>
              )}
              {isTimerStarted ? (
                <div className="d-inline-block float-right">
                  <ResendTimer
                    isTimerStarted={isTimerStarted}
                    toggleTimerStarted={() => {
                      setIsTimerStarted(!isTimerStarted);
                      setTimer(VCODE_RESEND_TIME_INTERVAL);
                    }}
                    totalTimeInterval={timer}
                    handleTimerChange={handleTimerChange}
                  />
                </div>
              ) : (
                <div
                  className="btn btn-sm btn-link pl-2 float-right mb-5 resend-btn"
                  onClick={(e) => handleResendOTP(e.target)}
                >
                  {isResendingOTP
                    ? t('auth.Resending Code')
                    : t('auth.Click to Resend')}
                </div>
              )}
            </div>
            <div className="col-12 mb-4">
              <button
                className="btn btn-lg btn-green btn-block"
                disabled={isLoggingIn}
                type="submit"
              >
                {isLoggingIn && <WhiteSpinner />}
                {t('button.Authorize the Device')}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

SenderSignIn.propTypes = {
  signIn: PropTypes.func,
  error: PropTypes.string,
  resendOTP: PropTypes.func,
  verifyOTP: PropTypes.func,
  resetError: PropTypes.func,
  closeModal: PropTypes.func,
  isOTPResent: PropTypes.bool,
  isLoggingIn: PropTypes.bool,
  isResendingOTP: PropTypes.bool,
};

const staticSelector = sl.object({
  signIn: sl.func(),
  resendOTP: sl.func(),
  verifyOTP: sl.func(),
  authLogin: sl.func(),
  resetError: sl.func(),
  closeModal: sl.func(),
  isLoggingIn: sl.boolean(false),
  isOTPResent: sl.boolean(false),
  isResendingOTP: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    user: getReduxState(['auth', 'user'], state),
    error: getReduxState(['auth', 'error'], state),
    isLoggingIn: getReduxState(['auth', 'isLoggingIn'], state),
    isOTPResent: getReduxState(['auth', 'isOTPResent'], state),
    isResendingOTP: getReduxState(['auth', 'isResendingOTP'], state),
    isAuthenticated: getReduxState(['auth', 'isAuthenticated'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      authLogin,
      resendOTP,
      verifyOTP,
      resetError,
    },
    dispatch
  );

const SenderSignInForm = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SenderSignIn)
);

export default SenderSignInForm;
