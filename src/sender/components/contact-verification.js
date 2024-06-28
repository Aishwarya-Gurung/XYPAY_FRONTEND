import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  verifySenderEmailOTP,
  verifySenderPhoneOTP,
  sendEmailVerificationCode,
  sendPhoneVerificationCode,
} from 'api';
import { getSenderInfo } from 'auth';
import ResendTimer from 'sender/components/resend-timer';
import { maskEmail, maskPhoneNumber, validateNumber } from 'utils';
import { VCODE_RESEND_TIME_INTERVAL } from 'sender/sender.constant';
import { ReactComponent as BlueSpinner } from 'assets/img/blue-spinner.svg';

const ContactVerification = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const { user, isEmailVerified, isPhoneVerified } = auth;

  useEffect(() => {
    dispatch(getSenderInfo());
  }, []);

  return (
    <div className="text-center p-3">
      <PhoneVerification user={user} isPhoneVerified={isPhoneVerified} />

      <EmailVerification user={user} isEmailVerified={isEmailVerified} />
    </div>
  );
};

export default ContactVerification;

export const PhoneVerification = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isVCodeResending, setIsVCodeResending] = useState(false);
  const [timer, setTimer] = useState(VCODE_RESEND_TIME_INTERVAL);

  const { user, isPhoneVerified } = props;

  const handleVerification = async () => {
    setIsVerifyingPhone(true);
    setError('');

    const { error } = await verifySenderPhoneOTP(
      user.phoneNumber,
      verificationCode
    );

    if (error) {
      setError(error.message);

      return setIsVerifyingPhone(false);
    }

    await dispatch(getSenderInfo());
    setIsVerifyingPhone(false);

    return;
  };

  useEffect(() => {
    if (verificationCode.length === 6) {
      handleVerification();
    }
  }, [verificationCode]);

  const toggleTimerStarted = () => {
    setIsTimerStarted(!isTimerStarted);
    setTimer(VCODE_RESEND_TIME_INTERVAL);
  };

  const handleTimerChange = (time) => {
    setTimer(time);
  };

  const resendVerificationCode = async () => {
    setError('');
    setIsVCodeResending(true);
    const { error } = await sendPhoneVerificationCode(user.phoneNumber);

    if (error) {
      setError(error.message);

      return setIsVCodeResending(false);
    }

    setIsVCodeResending(false);

    toast.info('The default OTP is 123456.');

    return toggleTimerStarted();
  };

  return (
    <div className="col-md-12 my-4">
      <div className="row">
        <div className="col-md-4">
          <div className="verification-icon">
            <img src={require('../../assets/img/phone.png')} alt="sms" />
          </div>
        </div>
        <div className="col-md-7 p-0">
          {isPhoneVerified ? (
            <div className="m-0 mt-4 ">
              <span className="p d-flex align-items-center m-0">
                <i className="icon ion-md-checkmark icon-verified mr-2" />
                <span className="bold">
                  {t('verification.Your phone number has been verified')}
                </span>
              </span>
            </div>
          ) : (
            <div className="contact-verification">
              <div className="col-md-12 position-relative p-0 mb-2">
                <p className="text-left">
                  {t(
                    'verification.Text Message with verification CODE will be sent to your Phone'
                  )}{' '}
                  {maskPhoneNumber(user.phoneNumber)}.
                </p>
              </div>

              <div className="row position-relative m-0 p-0">
                {isVerifyingPhone && (
                  <div className="contact-verification-spinner">
                    <BlueSpinner />
                  </div>
                )}
                <input
                  required
                  type="text"
                  maxLength="6"
                  minLength="6"
                  autoComplete="off"
                  value={verificationCode}
                  name="verificationCode"
                  onKeyPress={validateNumber}
                  disabled={isVerifyingPhone}
                  placeholder={t('verification.Enter Code')}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`form-control contact-verification-input bold ${
                    error ? 'is-invalid ' : ''
                  }`}
                />

                <div className="w-50 pl-2">
                  {!isPhoneVerified && (
                    <div className="m-0 text-left">
                      {isVCodeResending ? (
                        t('verification.Sending')
                      ) : (
                        <span className="contact-verification-info m-0">
                          <p className="contact-verification-info m-0 p-0 bold text-dark mb-1">
                            {t(
                              'verification.Check your phone and enter 6 digit code'
                            )}{' '}
                          </p>
                          {!isTimerStarted ? (
                            <span
                              onClick={resendVerificationCode}
                              className="cursor-pointer text-primary"
                            >
                              {t('verification.Send Again?')}
                            </span>
                          ) : (
                            <ResendTimer
                              isTimerStarted={isTimerStarted}
                              toggleTimerStarted={toggleTimerStarted}
                              totalTimeInterval={timer}
                              handleTimerChange={handleTimerChange}
                            />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {error && (
                  <div className="invalid-feedback text-left p-1 d-flex">
                    <i className="icon ion-md-remove-circle text-danger mr-1" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PhoneVerification.propTypes = {
  user: PropTypes.object,
  closeModal: PropTypes.func,
  isPhoneVerified: PropTypes.bool,
};

export const EmailVerification = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVCodeResending, setIsVCodeResending] = useState(false);
  const [timer, setTimer] = useState(VCODE_RESEND_TIME_INTERVAL);

  const { user, isEmailVerified } = props;

  const handleVerification = async () => {
    setIsVerifyingEmail(true);
    setError('');

    const { error } = await verifySenderEmailOTP(user.email, verificationCode);

    if (error) {
      setError(error.message);

      return setIsVerifyingEmail(false);
    }

    await dispatch(getSenderInfo());
    setIsVerifyingEmail(false);

    return;
  };

  useEffect(() => {
    if (verificationCode.length === 6) {
      handleVerification();
    }
  }, [verificationCode]);

  const toggleTimerStarted = () => {
    setIsTimerStarted(!isTimerStarted);
    setTimer(VCODE_RESEND_TIME_INTERVAL);
  };

  const handleTimerChange = (time) => {
    setTimer(time);
  };

  const resendVerificationCode = async () => {
    setError('');
    setIsVCodeResending(true);
    const { error } = await sendEmailVerificationCode(user.email);

    if (error) {
      setError(error.message);

      return setIsVCodeResending(false);
    }

    setIsVCodeResending(false);

    toast.info('The default OTP is 123456.');

    return toggleTimerStarted();
  };

  return (
    <div className="col-md-12 my-5 pt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="verification-icon">
            <img src={require('../../assets/img/email.png')} alt="sms" />
          </div>
        </div>
        <div className="col-md-7 p-0">
          {isEmailVerified ? (
            <div className="m-0 mt-4 ">
              <span className="p d-flex align-items-center m-0">
                <i className="icon ion-md-checkmark icon-verified mr-2" />
                <span className="bold">
                  {t(
                    'verification.Your email address has been successfully verified'
                  )}
                </span>
              </span>
            </div>
          ) : (
            <div className="contact-verification">
              <div className="col-md-12 position-relative p-0 mb-2">
                <p className="text-left">
                  {t(
                    'verification.The Message with verification CODE will be sent to your E-Mail'
                  )}{' '}
                  {maskEmail(user.email)}.
                </p>
              </div>

              <div className="row position-relative m-0 p-0">
                {isVerifyingEmail && (
                  <div className="contact-verification-spinner">
                    <BlueSpinner />
                  </div>
                )}
                <input
                  required
                  type="text"
                  maxLength="6"
                  minLength="6"
                  autoComplete="off"
                  value={verificationCode}
                  name="verificationCode"
                  onKeyPress={validateNumber}
                  disabled={isVerifyingEmail}
                  placeholder={t('verification.Enter Code')}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`form-control contact-verification-input bold ${
                    error ? 'is-invalid ' : ''
                  }`}
                />

                <div className="w-50 pl-2">
                  {!isEmailVerified && (
                    <div className="m-0 text-left">
                      {isVCodeResending ? (
                        t('verification.Sending')
                      ) : (
                        <span className="contact-verification-info m-0">
                          <p className="contact-verification-info m-0 p-0 bold text-dark mb-1">
                            {t(
                              'verification.Check your email and enter 6 digit code'
                            )}{' '}
                          </p>
                          {!isTimerStarted ? (
                            <span
                              onClick={resendVerificationCode}
                              className="cursor-pointer text-primary"
                            >
                              {t('verification.Send Again?')}
                            </span>
                          ) : (
                            <ResendTimer
                              isTimerStarted={isTimerStarted}
                              toggleTimerStarted={toggleTimerStarted}
                              totalTimeInterval={timer}
                              handleTimerChange={handleTimerChange}
                            />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {error && (
                  <div className="invalid-feedback text-left p-1 d-flex">
                    <i className="icon ion-md-remove-circle text-danger mr-1" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EmailVerification.propTypes = {
  user: PropTypes.object,
  isEmailVerified: PropTypes.bool,
};
