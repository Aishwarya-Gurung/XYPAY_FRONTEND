import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import EmailVerification from 'sender/components/email-verification';
import PhoneVerification from 'sender/components/phone-verification';

import sl from 'components/selector/selector';
import { PageHead } from 'components/layout/page-head';

import { LS_KEY } from 'auth';
import { signupSender } from 'sender';
import { PAGE, ROUTES, history } from 'app';
import { getReduxState, securedLS } from 'utils';

class SenderVerification extends Component {
  state = {
    isPhoneVerified: false,
    isEmailVerified: false,
    isSubmitting: false,
    showPhoneVerification: false,
  };

  componentDidMount = () => {
    const senderData = securedLS.get(LS_KEY.SIGN_UP_DATA).data;

    const email = securedLS.get(LS_KEY.VERIFIED_EMAIL_ADDRESS).data;

    if (email) {
      this.setState({
        showPhoneVerification: true,
      });
    }

    this.setState({ isEmailVerified: false, isPhoneVerified: false });

    if (!senderData) {
      return history.push(ROUTES.HOME);
    }
  };

  setIsPhoneVerified = (isPhoneVerified) => {
    this.setState(() => {
      return { isPhoneVerified };
    });
  };

  setIsEmailVerified = (isEmailVerified) => {
    if (isEmailVerified) {
      this.setState(() => {
        return { isEmailVerified };
      });
      setTimeout(() => {
        this.setState({ showPhoneVerification: true });
      }, 3000);
    } else {
      this.setState(() => {
        return { isEmailVerified };
      });
    }
  };

  createUser = async () => {
    const { signupSender } = staticSelector.select(this.props);

    this.setState({
      isSubmitting: true,
    });

    const countryCode = '+1';
    const senderData = securedLS.get(LS_KEY.SIGN_UP_DATA).data;
    const phoneNumber = securedLS.get(LS_KEY.VERIFIED_PHONE_NUMBER).data;
    const email = securedLS.get(LS_KEY.VERIFIED_EMAIL_ADDRESS).data;

    const senderDetails = { ...senderData, email, phoneNumber, countryCode };

    // if (features.isRecaptchaEnabled) {
    //   const token = await this.generateReCAPTCHAToken();

    //   senderDetails.reCAPTCHAToken = token;
    // }

    await signupSender(senderDetails);

    this.setState({
      isSubmitting: false,
    });
  };

  // generateReCAPTCHAToken = () => {
  //   return new Promise((response) => {
  //     window.grecaptcha.ready(function () {
  //       window.grecaptcha
  //         .execute(`${process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}`, {
  //           action: 'submit',
  //         })
  //         .then(function (token) {
  //           return response(token);
  //         });
  //     });
  //   });
  // };

  render() {
    const { t, error, signupSender } = staticSelector.select(this.props);
    const { isPhoneVerified, isEmailVerified, showPhoneVerification } =
      this.state;

    return (
      <section className="container mt-4">
        <PageHead title={PAGE.SENDER_VERIFICATION} />
        <div className="row justify-content-center mt-5 mb-2">
          <div className="col-lg-8 text-center">
            <h1 className="h2 bold text-primary">
              {t('verification.Youre almost set')}
            </h1>
            <p className="lead text-primary">
              {t('verification.Now lets verify your contacts and thats it')}
            </p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {error && (
              <div className="d-flex text-danger small alert-danger">
                <i className="icon ion-md-remove-circle text-danger mr-1" />{' '}
                {error}
              </div>
            )}
          </div>
        </div>

        {showPhoneVerification && (
          <PhoneVerification
            isPhoneVerified={isPhoneVerified}
            setIsPhoneVerified={this.setIsPhoneVerified}
            signupSender={signupSender}
          />
        )}

        {!showPhoneVerification && (
          <EmailVerification
            isEmailVerified={isEmailVerified}
            setIsEmailVerified={this.setIsEmailVerified}
          />
        )}

        <div className="w-75 m-auto mt-3">
          <div className="mb-5 text-center mt-5">
            <Link
              to={{
                pathname: ROUTES.SENDER_SIGN_UP,
                from: this.props.location.pathname,
              }}
              className="btn btn-link p-0"
            >
              <u> {t('form.Back to form')}</u>
            </Link>
          </div>
        </div>
        {/* 
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="row p-4">
              <div className="col-md-4"></div>
              <div className="col-md-8 w-100 p-0">
                {isPhoneVerified && isEmailVerified && (
                  <div className="w-75 mt-3">
                    <button
                      onClick={this.createUser}
                      className="btn btn-lg btn-success btn-block btn-dashed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <WhiteSpinner />}
                      {t('button.Continue')}
                    </button>
                  </div>
                )}

                <div className="w-75 mt-3">
                  <div className="mb-5 pb-5 text-center">
                    <p>
                      {t(
                        'form.If you noticed some incorrections you can still make changes to your registration form'
                      )}
                    </p>
                    <Link
                      to={{
                        pathname: ROUTES.SENDER_SIGN_UP,
                        from: this.props.location.pathname,
                      }}
                      className="btn btn-link p-0"
                    >
                      <u> {t('form.Back to form')}</u>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </section>
    );
  }
}

SenderVerification.propTypes = {
  t: PropTypes.func,
  error: PropTypes.string,
  location: PropTypes.object,
  features: PropTypes.object,
  getSenderInfo: PropTypes.func,
  isEmailVerified: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,
  hasAllPaymentDetailProperties: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  error: sl.string(null),
  signupSender: sl.func(),
  getSenderInfo: sl.func(),
  features: sl.object({
    isRecaptchaEnabled: sl.boolean(false),
  }),
  isEmailVerified: sl.boolean(false),
  isPhoneVerified: sl.boolean(false),
  hasAllPaymentDetailProperties: sl.boolean(false),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      signupSender,
    },
    dispatch
  );

const mapStateToProps = (state) => {
  return {
    error: getReduxState(['sender', 'error', 'signUp'], state),
    features: getReduxState(['home', 'features'], state),
  };
};

export const SenderVerificationView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(SenderVerification));
