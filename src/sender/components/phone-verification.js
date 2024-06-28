import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';

import ResendTimer from 'sender/components/resend-timer';
import { VCODE_RESEND_TIME_INTERVAL } from 'sender/sender.constant';

import {
  validateNumber,
  securedLS,
  phoneValidator,
  getReduxState,
} from 'utils';
import { LS_KEY } from 'auth';
import { COUNTRY } from 'app';
import sl from 'components/selector/selector';
import { sendPhoneVerificationCode, verifyPhoneOTP } from 'api';

class PVerification extends Component {
  state = {
    isTimerStarted: false,
    phoneNumber: '',
    addPhoneError: '',
    isPhoneAdded: false,
    verificationCode: '',
    isAddingPhone: false,
    isVCodeResending: false,
    isVerifyingPhone: false,
    phoneValidationError: '',
    isSubmitting: false,
    timer: VCODE_RESEND_TIME_INTERVAL,
    contactVerificationCode: Array(6).fill(''),
  };

  constructor(props) {
    super(props);
    this.inputRefs = Array(6).fill(React.createRef());
  }

  componentDidMount = () => {
    const { setIsPhoneVerified } = staticSelector.select(this.props);

    const verifiedPhoneNumber = securedLS.get(
      LS_KEY.VERIFIED_PHONE_NUMBER
    ).data;

    if (verifiedPhoneNumber) {
      return setIsPhoneVerified(true);
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

  resendVerificationCode = async () => {
    this.setState({ isVCodeResending: true, phoneValidationError: '' });

    const { error } = await sendPhoneVerificationCode(this.state.phoneNumber);

    if (error) {
      return this.setState({
        addPhoneError: error.message,
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

    const country = COUNTRY['USA'];

    if (inputName === 'phoneNumber' && !inputValue) {
      return this.setState({
        addPhoneError: i18n.t('validation.This field cannot be empty'),
        isAddingPhone: false,
      });
    }

    if (
      inputName === 'phoneNumber' &&
      !phoneValidator().validate(inputValue, country)
    ) {
      return this.setState({
        addPhoneError: i18n.t('validation.Please enter valid phone number'),
        isAddingPhone: false,
      });
    }

    this.setState({
      addPhoneError: '',
    });

    return true;
  };

  addPhoneNumber = async (e) => {
    e.preventDefault();
    const input = e.target;

    this.setState({ isAddingPhone: true, phoneValidationError: '' });

    if (input.length) {
      if (this.handleValidation(input[0])) {
        const phoneNumber = input[0].value;
        const { error } = await sendPhoneVerificationCode(phoneNumber);

        toast.info('The default OTP is 123456.');

        if (error) {
          return this.setState({
            addPhoneError: error.message,
            isAddingPhone: false,
          });
        }

        securedLS.clear(LS_KEY.VERIFIED_PHONE_NUMBER);

        this.setState({
          isPhoneAdded: true,
          isAddingPhone: false,
          addPhoneError: '',
        });

        this.toggleTimerStarted();
      }
    }
  };

  verifyPhoneNumber = async (e, newCode) => {
    e.preventDefault();

    const { setIsPhoneVerified } = staticSelector.select(this.props);

    this.setState({ isVerifyingPhone: true, addPhoneError: '' });

    const { phoneNumber } = this.state;
    const otp = newCode.join('');
    const { error } = await verifyPhoneOTP(phoneNumber, otp);

    if (error) {
      this.inputRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.removeAttribute('disabled');
        }
      });

      return this.setState({
        phoneValidationError: error.message,
        // contactVerificationCode: Array(6).fill(''),
        isVerifyingPhone: false,
      });
    }

    securedLS.set(LS_KEY.VERIFIED_PHONE_NUMBER, this.state.phoneNumber);

    this.createUser();

    setIsPhoneVerified(true);

    this.setState({
      isVerifyingPhone: false,
    });
  };

  generateReCAPTCHAToken = () => {
    return new Promise((response) => {
      window.grecaptcha.ready(function () {
        window.grecaptcha
          .execute(`${process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}`, {
            action: 'submit',
          })
          .then(function (token) {
            return response(token);
          });
      });
    });
  };

  createUser = async () => {
    this.setState({ isSubmitting: true });
    const { features, signupSender } = staticSelector.select(this.props);

    const countryCode = '+1';
    const senderData = securedLS.get(LS_KEY.SIGN_UP_DATA).data;
    const phoneNumber = securedLS.get(LS_KEY.VERIFIED_PHONE_NUMBER).data;
    const email = securedLS.get(LS_KEY.VERIFIED_EMAIL_ADDRESS).data;

    const senderDetails = { ...senderData, email, phoneNumber, countryCode };

    if (features.isRecaptchaEnabled) {
      const token = await this.generateReCAPTCHAToken();

      senderDetails.reCAPTCHAToken = token;
    }

    await signupSender(senderDetails);

    this.setState({ isSubmitting: false });
  };

  setVerificationCode = (e) => {
    const verificationCode = e.target.value;

    this.setState(() => {
      return { verificationCode: verificationCode };
    });

    if (verificationCode.length === 6) {
      this.verifyPhoneNumber(e);
    }
  };

  setPhoneNumber = (e) => {
    const phoneNumber = e.target.value;

    this.setState(() => {
      return { phoneNumber };
    });
  };

  resetPhoneNumber = () => {
    const { setIsPhoneVerified } = staticSelector.select(this.props);

    setIsPhoneVerified(false);

    this.setState(() => {
      return {
        isPhoneAdded: false,
        verificationCode: '',
        addPhoneError: '',
        phoneValidationError: '',
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
      this.verifyPhoneNumber(event, newCode);
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

  addPhoneField = () => {
    const { t } = staticSelector.select(this.props);

    const { phoneNumber, addPhoneError, isAddingPhone } = this.state;

    return (
      <div className="box">
        <form
          onSubmit={this.addPhoneNumber}
          onBlur={(e) => this.handleValidation(e.target)}
          className="mt-2"
        >
          <div className="col-md-12 clearfix my-4">
            <div className="alert alert-blue m-0 p-2 small-text d-flex align-items-center">
              <i className="icon ion-md-information-circle pr-2 " />
              <p className="mb-0 medium">
                {t(
                  'verification.A verification code will be sent to your phone'
                )}
              </p>
            </div>
          </div>
          <div className="col-md-12 contact-verification position-relative">
            <input
              type="text"
              minLength="10"
              maxLength="10"
              autoComplete="off"
              name="phoneNumber"
              onKeyPress={validateNumber}
              placeholder={t('verification.Your Phone Number*')}
              value={phoneNumber}
              onChange={this.setPhoneNumber}
              className={`form-control contact-verification-phone ${
                addPhoneError ? 'is-invalid ' : ''
              }`}
            />
            <div className="btn-country-flag bold text-primary">
              <img
                src={require('assets/img/usa.png')}
                alt="USA"
                className="mr-1"
              />
              <span>+1</span>
            </div>
            <div className="invalid-feedback">
              <div className="d-flex">
                <i className=" icon ion-md-remove-circle text-danger mr-1" />
                {addPhoneError}
              </div>
            </div>
            <button
              disabled={isAddingPhone}
              className="col-md-12 btn btn-md btn-success text-white mt-4"
            >
              {isAddingPhone
                ? t('verification.Verifying')
                : t('verification.Verify')}
            </button>
          </div>
        </form>
      </div>
    );
  };

  validatePhoneField = () => {
    const {
      phoneNumber,
      isPhoneAdded,
      addPhoneError,
      isVCodeResending,
      contactVerificationCode,
      isVerifyingPhone,
      phoneValidationError,
    } = this.state;

    const { t, isPhoneVerified } = staticSelector.select(this.props);

    const handlePaste = (e) => {
      e.preventDefault();
    };

    return (
      <div className="box">
        <div className="col-md-12 clearfix my-4">
          <div className="alert alert-blue m-0 p-2 small-text d-flex align-items-center">
            <i className="icon ion-md-information-circle pr-2 " />
            <p className="mb-0 medium">
              {t(
                'verification.A verification code has been sent to your phone'
              )}
            </p>
          </div>
        </div>
        <div className="contact-verification col-md-12">
          <div className="col-md-12 position-relative p-0 mb-2">
            <input
              disabled
              value={phoneNumber}
              className={`form-control contact-verification-phone`}
            />
            <div className="btn-country-flag bold text-primary">
              <img
                src={require('assets/img/usa.png')}
                alt="USA"
                className="mr-1"
              />
              <span>+1</span>
            </div>
            <div
              onClick={this.resetPhoneNumber}
              className="btn-edit-contact bold text-primary pt-0"
            >
              {t('button.EDIT')}
            </div>
          </div>

          <div className="row position-relative m-0 p-0">
            {/* <input
              required
              type="text"
              maxLength="6"
              autoComplete="off"
              name="verificationCode"
              value={verificationCode}
              onKeyPress={validateNumber}
              placeholder={t('verification.Enter code')}
              onChange={this.setVerificationCode}
              className={`form-control contact-verification-input bold ${
                phoneValidationError || addPhoneError ? 'is-invalid ' : ''
              }`}
            /> */}

            <div className="d-flex justify-content-center w-100 mt-3">
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

            {(phoneValidationError || addPhoneError) && (
              <div className="d-flex w-100 text-danger mt-2 small">
                <i className="icon ion-md-remove-circle text-danger mr-1" />
                {phoneValidationError || addPhoneError}
              </div>
            )}

            <div className="w-100 pl-2 mt-2">
              {isPhoneAdded && !isPhoneVerified && (
                <div className="m-0 text-left">
                  {isVCodeResending || isVerifyingPhone ? (
                    <span className="d-flex justify-content-end">
                      {isVerifyingPhone
                        ? t('verification.Verifying')
                        : t('verification.Sending')}
                    </span>
                  ) : (
                    <span className="contact-verification-info m-0 d-flex justify-content-end w-100">
                      {/* <p className="contact-verification-info m-0 p-0 bold text-dark mb-1">
                        {t(
                          'verification.Check your phone and enter 6 digit code'
                        )}{' '}
                      </p> */}
                      {!this.state.isTimerStarted ? (
                        <span
                          onClick={this.resendVerificationCode}
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
      </div>
    );
  };

  render() {
    const { isPhoneAdded } = this.state;
    const { t, isPhoneVerified } = staticSelector.select(this.props);

    const verifiedPhoneNumber = securedLS.get(
      LS_KEY.VERIFIED_PHONE_NUMBER
    ).data;

    return (
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="row p-4 mt-2">
            <div className="col-md-12 verification-icon d-flex justify-content-center">
              <img src={require('../../assets/img/phone.png')} alt="sms" />
            </div>
            <div className="col-md-7 p-0 mx-auto">
              {isPhoneVerified ? (
                <div className="m-0 mt-4 ">
                  <div className="col-md-12 p-0 clearfix my-2">
                    <div className="alert alert-success-dark m-0 p-2 small-text d-flex align-items-center">
                      <i className="icon ion-md-checkmark-circle pr-2 " />
                      <p className="mb-0 medium">
                        {t('verification.Your phone number has been verified')}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 position-relative p-0 mb-3">
                    <input
                      readOnly
                      value={verifiedPhoneNumber}
                      className={`form-control contact-verification-phone`}
                    />
                    <div className="btn-country-flag bold text-primary">
                      <img
                        src={require('assets/img/usa.png')}
                        alt="USA"
                        className="mr-1"
                      />
                      <span>+1</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <span>{t('verification.Loading')}</span>
                  </div>
                </div>
              ) : !isPhoneAdded ? (
                this.addPhoneField()
              ) : (
                this.validatePhoneField()
              )}
              {/* 
              {!isPhoneAdded && !isPhoneVerified && (
                <div className="m-0 mt-3">
                  <span className="col-lg-8 col-md-12 m-0 p-0">
                    {t(
                      'verification.Text Message with verification CODE will be sent to your Phone'
                    )}
                    .
                  </span>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PVerification.propTypes = {
  t: PropTypes.func,
  isPhoneVerified: PropTypes.bool,
  setIsPhoneVerified: PropTypes.func,
  features: PropTypes.object,
};

const staticSelector = sl.object({
  t: sl.func(),
  setIsPhoneVerified: sl.func(),
  isPhoneVerified: sl.boolean(false),
  signupSender: sl.func(),
  features: sl.object({
    isRecaptchaEnabled: sl.boolean(false),
  }),
});

const mapStateToProps = (state) => {
  return {
    features: getReduxState(['home', 'features'], state),
  };
};

const PhoneVerification = withTranslation()(PVerification);

export default connect(mapStateToProps)(PhoneVerification);
