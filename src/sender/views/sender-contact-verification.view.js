import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { hasOwnProperties } from 'utils';
import { PAGE, ROUTES, history } from 'app';
import { PageHead } from 'components/layout/page-head';
import ContactVerification from 'sender/components/contact-verification';

const SenderContactVerification = (props) => {
  const { auth } = useSelector((state) => state);

  const { t } = props;
  const { paymentDetail } = useSelector((state) => state.payment);

  const { isEmailVerified, isPhoneVerified } = auth;

  useEffect(() => {
    if (isEmailVerified && isPhoneVerified) {
      return getNextPath();
    }
  }, [isEmailVerified, isPhoneVerified]);

  const keys = [
    'country',
    'totalAmount',
    'exchangeRate',
    'sendingAmount',
    'transactionFee',
    'paymentCurrency',
    'receivingAmount',
  ];
  const hasAllPaymentDetailProperties = hasOwnProperties(keys, paymentDetail);

  const getNextPath = () => {
    const nextPath = props.location.state
      ? props.location.state.nextPath
        ? props.location.state.nextPath
        : ROUTES.PAYMENT_DETAILS
      : ROUTES.PAYMENT_DETAILS;

    if (hasAllPaymentDetailProperties) {
      return history.push(ROUTES.SENDER_DETAILS);
    }

    return history.push(nextPath);
  };

  return (
    <section className="container">
      <PageHead title={PAGE.SENDER_VERIFICATION} />
      <div className="row justify-content-center my-3 mt-5">
        <div className="col-lg-8 text-center">
          <h1 className="h2 bold text-primary">
            {t('verification.Youre almost set')}
          </h1>
          <p className="lead text-primary">
            {t('verification.Now lets verify your contacts and thats it')}
          </p>
        </div>

        <div className="col-md-9">
          <ContactVerification />
        </div>
      </div>
    </section>
  );
};

SenderContactVerification.propTypes = {
  t: PropTypes.func,
  location: PropTypes.object,
};

export const SenderContactVerificationView = withTranslation()(
  SenderContactVerification
);
