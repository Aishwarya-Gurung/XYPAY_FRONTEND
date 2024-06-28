import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

import { PAGE } from 'app';
import { PageHead } from 'components/layout/page-head';
import SenderSignIn from 'sender/components/sender-signin';
import { withPublicAuthorization } from 'payment/components/authorization';

const SignIn = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <PageHead title={PAGE.SIGN_IN} />
      <div className="container">
        <div className="row justify-content-center my-5">
          <div className="col-lg-8 text-center mb-4">
            <h2 className="bold text-primary">{t('auth.Sign in')}</h2>
          </div>
          <div className="col-lg-6">
            <div className="card p-4">
              <SenderSignIn />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const SenderSignInView = withPublicAuthorization(
  withTranslation()(SignIn)
);
