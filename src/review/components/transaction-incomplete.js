import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from 'app';

const TransactionIncomplete = () => {
  const { t } = useTranslation();

  return (
    <div className="pb-5 mb-5 ">
      <section className="container">
        <div className="row justify-content-center my-5">
          <div className="col-lg-6">
            <div className="card p-4 text-center">
              <div data-fun="4">
                <i
                  className={`icon ion-md-close-circle text-danger display-2`}
                />
              </div>

              <p>
                {t(
                  'review.Your request cannot be processed We were unable to verify your Debit Card Information Please try a different Debit Card or contact XYPAY customer service at'
                )}{' '}
                <a href="mailto:hello@XYPAY.com">hello@XYPAY.com</a>.
              </p>

              <div className="mt-4">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="btn btn-lg btn-outline-danger mb-2"
                >
                  {t('review.Go to Dashboard')}
                </Link>
                <span className="btn-gap" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransactionIncomplete;
