import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import Navbar from 'components/layout/navbar';
import { PageHead } from 'components/layout/page-head';

import SenderSignUp from 'sender/components/sender-signup';
import SenderSignInForm from 'sender/components/sender-signin';

import { PAGE } from 'app';
import PaymentSideReceipt from 'payment/components/payment-side-receipt';

class SenderOnFLowRegistration extends Component {
  state = {
    hasAccount: false,
  };

  toggleSignUpSignIn = () => {
    return this.setState({
      hasAccount: !this.state.hasAccount,
    });
  };

  render() {
    const { hasAccount } = this.state;
    const { t } = staticSelector.select(this.props);

    return (
      <React.Fragment>
        <PageHead title={PAGE.SIGN_UP} />
        <Navbar currentStep={2} />
        <section className="container">
          <div className="row justify-content-between my-5">
            <div className="col-md-8 col-lg-6 mb-4">
              <h1 className="h2 bold text-primary text-center">
                {hasAccount ? t('auth.Sign in') : t('sender.Sign Up')}
              </h1>
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-8 col-lg-6">
              <div className="alert alert-info">
                <p className="lead m-0">
                  {hasAccount
                    ? t("sender.Don't have an account?")
                    : t('sender.Already have an account?')}
                  <span
                    onClick={this.toggleSignUpSignIn}
                    className="bold text-primary cursor-pointer btn-link ml-2"
                  >
                    {hasAccount ? t('auth.Sign up') : t('auth.Sign in')}
                  </span>
                </p>
              </div>

              <hr />

              {hasAccount ? (
                <div className="rounded border p-4">
                  <SenderSignInForm />
                </div>
              ) : (
                <SenderSignUp />
              )}
            </div>

            <div className="col-md-4">
              <PaymentSideReceipt />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

SenderOnFLowRegistration.propTypes = {
  t: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
});

export const SenderOnFLowRegistrationView = withTranslation()(
  SenderOnFLowRegistration
);
