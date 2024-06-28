import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';

import ResendTimer from 'sender/components/resend-timer';
import { VCODE_RESEND_TIME_INTERVAL } from 'sender/sender.constant';

import { LS_KEY } from 'auth';
import sl from 'components/selector/selector';
import { sendEmailVerificationCode, verifyEmailOTP } from 'api';
import { securedLS, validateNumber, validateEmail } from 'utils';

class EVerification extends Component {
  state = {
    isTimerStarted: false,
    emailAddress: '',
    addEmailError: '',
    isEmailAdded: false,
    isAddingEmail: false,
    verificationCode: '',
    isVerifyingEmail: false,
    isVCodeResending: false,
    emailValidationError: '',
    timer: VCODE_RESEND_TIME_INTERVAL,
    contactVerificationCode: Array(6).fill(''),
  };

  constructor(props) {
    super(props);
    this.inputRefs = Array(6).fill(React.createRef());
  }

  componentDidMount = () => {
    const { setIsEmailVerified } = staticSelector.select(this.props);

    const verifiedEmailAddress = securedLS.get(
      LS_KEY.VERIFIED_EMAIL_ADDRESS
    ).data;

    if (verifiedEmailAddress) {
      return setIsEmailVerified(true);
    }
  };

  toggleTimerStarted = () => {
    this.setState({
      isTimerStarted: !this.state.isTimerStarted,
      timer: VCODE_RESEND_TIME_INTERVAL,
    });
  };

  handleTimerChange = (timer) => {
    this.setState({ timer });
  };

  resendVerificationLink = async () => {
    this.setState({ isVCodeResending: true, emailValidationError: '' });

    const { error } = await sendEmailVerificationCode(this.state.emailAddress);

    if (error) {
      return this.setState({
        addEmailError: error.message,
        isVCodeResending: false,
      });
    }

    this.setState({ isVCodeResending: false });

    toast.info('The default OTP is 123456.');

    return this.toggleTimerStarted();
  };

  handleValidation = (input) => {
    const inputName = input.name;
    const inputValue = input.value;

    if (inputName === 'emailAddress' && !inputValue) {
      return this.setState({
        addEmailError: i18n.t('validation.This field cannot be empty'),
        isAddingEmail: false,
      });
    }

    if (inputName === 'emailAddress' && !validateEmail(inputValue)) {
      return this.setState({
        addEmailError: i18n.t('validation.Please enter a valid email address'),
        isAddingEmail: false,
      });
    }

    this.setState({
      addEmailError: '',
    });

    return true;
  };

  addEmailAddress = async (e) => {
    e.preventDefault();
    const input = e.target;

    this.setState({ isAddingEmail: true, emailValidationError: '' });

    if (input.length) {
      if (this.handleValidation(input[0])) {
        const email = input[0].value;
        const { error } = await sendEmailVerificationCode(email);

        toast.info('The default OTP is 123456.');

        if (error) {
          return this.setState({
            addEmailError: error.message,
            isAddingEmail: false,
          });
        }

        securedLS.clear(LS_KEY.VERIFIED_EMAIL_ADDRESS);

        this.setState({
          isEmailAdded: true,
          isAddingEmail: false,
          addEmailError: '',
        });

        this.toggleTimerStarted();
      }
    }
  };

  verifyEmailAddress = async (e, newCode) => {
    e.preventDefault();

    const { setIsEmailVerified } = staticSelector.select(this.props);

    this.setState({ isVerifyingEmail: true, addEmailError: '' });

    const { emailAddress } = this.state;
    const otp = newCode.join('');
    const { error } = await verifyEmailOTP(emailAddress, otp);

    if (error) {
      this.inputRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.removeAttribute('disabled');
        }
      });

      return this.setState({
        emailValidationError: error.message,
        isVerifyingEmail: false,
      });
    }

    securedLS.set(LS_KEY.VERIFIED_EMAIL_ADDRESS, this.state.emailAddress);

    setIsEmailVerified(true);

    this.setState({
      isVerifyingEmail: false,
    });
  };

  setVerificationCode = (e) => {
    const verificationCode = e.target.value;

    this.setState(() => {
      return { verificationCode };
    });

    if (verificationCode.length === 6) {
      this.verifyEmailAddress(e);
    }
  };

  setEmailAddress = (e) => {
    const emailAddress = e.target.value;

    this.setState(() => {
      return { emailAddress };
    });
  };

  resetEmail = () => {
    const { setIsEmailVerified } = staticSelector.select(this.props);

    setIsEmailVerified(false);

    this.setState(() => {
      return {
        isEmailAdded: false,
        verificationCode: '',
        addEmailError: '',
        emailValidationError: '',
      };
    });
  };

  handleInputChange = (index, value, event) => {
    const newCode = [...this.state.contactVerificationCode];

    newCode[index] = value;

    if (value !== '' && index < 6) {
      const nextInput = event.target.nextElementSibling;

      if (nextInput) {
        nextInput.removeAttribute('disabled');
        nextInput.focus();
      }

      event.target.setAttribute('disabled', 'true');
    }

    this.setState({
      contactVerificationCode: newCode,
    });

    if (index === 5) {
      this.verifyEmailAddress(event, newCode);
    }
  };

  handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && index > 0) {
      const newCode = [...this.state.contactVerificationCode];

      if (index === 5) {
        newCode[index] = '';
      }
      newCode[index - 1] = '';

      this.setState({
        contactVerificationCode: newCode,
      });

      const prevInput = event.target.previousElementSibling;

      if (prevInput) {
        prevInput.removeAttribute('disabled');
        prevInput.focus();
      }
    }
  };

  addEmailField = () => {
    const { t } = staticSelector.select(this.props);

    const { emailAddress, addEmailError, isAddingEmail } = this.state;

    return (
      <div className="box">
        <form
          onSubmit={this.addEmailAddress}
          onBlur={(e) => this.handleValidation(e.target)}
          className="mt-2"
        >
          <div className="col-md-12 p-0 clearfix my-4">
            <div className="alert alert-blue m-0 p-2 small-text d-flex align-items-center">
              <i className="icon ion-md-information-circle pr-2 " />
              <p className="mb-0 medium">
                {t(
                  'verification.A verification code will be sent to your email'
                )}
              </p>
            </div>
          </div>
          <div className="contact-verification">
            <input
              type="email"
              autoComplete="off"
              name="emailAddress"
              placeholder={t('verification.Your E-Mail Address*')}
              value={emailAddress}
              onChange={this.setEmailAddress}
              className={`form-control mr-3 ${
                addEmailError ? 'is-invalid ' : ''
              }`}
            />
            <div className="invalid-feedback">
              <div className="d-flex">
                <i className="icon ion-md-remove-circle text-danger mr-1" />
                {addEmailError}
              </div>
            </div>
            <button
              disabled={isAddingEmail}
              className="col-md-12 btn btn-md btn-success text-white mt-4"
            >
              {isAddingEmail
                ? t('verification.Verifying')
                : t('verification.Verify')}
            </button>
          </div>
        </form>
      </div>
    );
  };

  validateEmailField = () => {
    const {
      emailAddress,
      isEmailAdded,
      addEmailError,
      isVerifyingEmail,
      isVCodeResending,
      emailValidationError,
      contactVerificationCode,
    } = this.state;

    const { t, isEmailVerified } = staticSelector.select(this.props);

    const handlePaste = (e) => {
      e.preventDefault();
    };

    return (
      <div className="box">
        <form onSubmit={this.verifyEmailAddress} className="mt-2">
          <div className="col-md-12 p-0 clearfix my-4">
            <div className="alert alert-blue m-0 p-2 small-text d-flex align-items-center">
              <i className="icon ion-md-information-circle pr-2 " />
              <p className="mb-0 medium">
                {t(
                  'verification.A verification code has been sent to your email'
                )}
              </p>
            </div>
          </div>
          <div className="contact-verification">
            <div className="col-md-12 position-relative p-0 mb-2">
              <input readOnly value={emailAddress} className={`form-control`} />
              <div
                onClick={this.resetEmail}
                className="btn-edit-contact bold text-primary pt-0"
              >
                {t('button.EDIT')}
              </div>
            </div>

            <div className="row position-relative m-0 p-0 justify-content-center">
              {/* <input
                required
                type="text"
                maxLength="6"
                autoComplete="off"
                name="verificationCode"
                onKeyPress={validateNumber}
                placeholder={t('verification.Enter code')}
                value={verificationCode}
                onChange={this.setVerificationCode}
                className={`form-control contact-verification-input bold ${
                  emailValidationError || addEmailError ? 'is-invalid ' : ''
                }`}
              /> */}

              <div className="d-flex justify-content-center mt-3">
                {contactVerificationCode.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    inputMode="numeric"
                    className={`form-control verification-code bold ${
                      index !== contactVerificationCode.length - 1
                        ? 'input-field'
                        : ''
                    }`}
                    onKeyPress={validateNumber}
                    onKeyDown={(e) => this.handleKeyDown(e, index)}
                    onChange={(e) =>
                      this.handleInputChange(index, e.target.value, e)
                    }
                    onPaste={(e) => handlePaste(e)}
                    ref={this.inputRefs[index]}
                    autoFocus={index === 0}
                    readOnly={
                      index !== 0 && contactVerificationCode[index - 1] === ''
                    }
                  />
                ))}
              </div>

              {(emailValidationError || addEmailError) && (
                <div className="d-flex w-100 text-danger mt-2 small">
                  <i className="icon ion-md-remove-circle text-danger mr-1" />
                  {emailValidationError || addEmailError}
                </div>
              )}

              <div className="w-100 pl-2 mt-2">
                {isEmailAdded && !isEmailVerified && (
                  <div className="m-0 text-left">
                    {isVCodeResending || isVerifyingEmail ? (
                      <span className="d-flex justify-content-end">
                        {isVerifyingEmail
                          ? t('verification.Verifying')
                          : t('verification.Sending')}
                      </span>
                    ) : (
                      <span className="contact-verification-info m-0 d-flex justify-content-end w-100">
                        {!this.state.isTimerStarted ? (
                          <span
                            onClick={this.resendVerificationLink}
                            className="cursor-pointer text-primary"
                          >
                            {t('verification.Send Again?')}
                          </span>
                        ) : (
                          <ResendTimer
                            isTimerStarted={this.state.isTimerStarted}
                            toggleTimerStarted={this.toggleTimerStarted}
                            totalTimeInterval={this.state.timer}
                            handleTimerChange={this.handleTimerChange}
                          />
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };

  render() {
    const { t, isEmailVerified } = staticSelector.select(this.props);

    const { isEmailAdded } = this.state;

    const verifiedEmailAddress = securedLS.get(
      LS_KEY.VERIFIED_EMAIL_ADDRESS
    ).data;

    return (
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="row p-4 mt-2">
            <div className="col-md-12 verification-icon d-flex justify-content-center">
              <img src={require('../../assets/img/email.png')} alt="sms" />
            </div>
            <div className="col-md-12 p-0">
              <div className="col-md-7 mx-auto">
                {isEmailVerified ? (
                  <div className="m-0 mt-4">
                    <div className="col-md-12 p-0 clearfix my-2">
                      <div className="alert alert-success-dark m-0 p-2 small-text d-flex align-items-center">
                        <i className="icon ion-md-checkmark-circle pr-2 " />
                        <p className="mb-0 medium">
                          {t(
                            'verification.Your email address has been successfully verified'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-12 position-relative p-0 mb-3">
                      <input
                        readOnly
                        value={verifiedEmailAddress}
                        className={`form-control`}
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <span>{t('verification.Loading')}</span>
                    </div>
                  </div>
                ) : !isEmailAdded ? (
                  this.addEmailField()
                ) : (
                  this.validateEmailField()
                )}
                {/* 
                {!isEmailAdded && !isEmailVerified && (
                  <div className="m-0 mt-3">
                    <span className="col-lg-8 col-md-12 m-0 p-0">
                      {t(
                        'verification.The Message with verification CODE will be sent to your E-Mail'
                      )}
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EVerification.propTypes = {
  t: PropTypes.func,
  isEmailVerified: PropTypes.bool,
  setIsEmailVerified: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  setIsEmailVerified: sl.func(),
  isEmailVerified: sl.boolean(false),
});

const EmailVerification = withTranslation()(EVerification);

export default EmailVerification;
