import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import { PAGE, ROUTES } from 'app';
import { LS_KEY } from 'auth';
import { securedLS } from 'utils';
import { PageHead } from 'components/layout/page-head';
import SenderSignUp from 'sender/components/sender-signup';
import { withPublicAuthorization } from 'payment/components/authorization';

class SignUp extends Component {
  componentDidMount = () => {
    const { from } = this.props.location;

    // Note: Remove data if user is not returning back from verification page
    if (ROUTES.SENDER_VERIFICATION !== from) {
      return securedLS.clear(LS_KEY.SIGN_UP_DATA);
    }
  };

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <PageHead title={PAGE.SIGN_UP} />
        <div className="cityscape">
          <section className="container mt-5 p-0">
            <div className="row justify-content-center pt-2-5">
              <div className="col-lg-6 text-center mb-4">
                <div className="px-md-2">
                  <h3 className="text-primary">
                    {t('auth.Sign up for Free!')}
                  </h3>
                  <p className="pl-4 pr-4 pt-1 text-primary">
                    {t(
                      'auth.Follow instructions to sign up and set up your account and you will be ready to send money within 5 minutes'
                    )}
                  </p>
                </div>
              </div>
              <div className="col-lg-7 p-md-0 ">
                <div className=" home-calculator">
                  <SenderSignUp />
                </div>
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>
    );
  }
}

SignUp.propTypes = {
  t: PropTypes.func,
  location: PropTypes.object,
};

export const SenderSignUpView = withPublicAuthorization(
  withTranslation()(SignUp)
);
