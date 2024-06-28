import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import NotifyBeneficiary from 'review/components/notify-beneficiary';

import { ROUTES } from 'app';

const TransactionComplete = (props) => {
  const { t } = useTranslation();
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const { beneficiaryName, beneficiaryEmail } = staticSelector.select(props);

  return (
    <div className="cityscape pb-3">
      <section className="container">
        <div className="row justify-content-center my-5">
          <div className="col-lg-6">
            <div className="card p-4 text-center">
              <div data-fun="4" className="blaster my-4">
                <i
                  className="icon ion-md-checkmark-circle text-success display-2"
                  id="blast"
                />
              </div>

              <h2 className="text-danger">{t('review.Congratulations')}</h2>
              <p>{t('review.Your money transfer is on its way to')}</p>
              <h4>{beneficiaryName}</h4>
              <p>
                {t(
                  'review.Please go to your dashboard to view your receipt and other details We will send you an email with your receipt and notification after the transaction is delivered'
                )}
              </p>

              <div className="mt-4">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="btn btn-lg btn-green mb-2"
                >
                  {t('review.Go to Dashboard')}
                </Link>
                <span className="btn-gap" />
                {/* <button
                  disabled
                  title="This feature is coming soon"
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="btn btn-lg btn-outline-secondary mb-2"
                >
                  {t('review.Notify Beneficiary')}
                </button> */}
              </div>
            </div>
          </div>
        </div>
        <NotifyBeneficiary
          beneficiaryEmail={beneficiaryEmail}
          isModalOpen={isNotifyModalOpen}
          setModalClose={setIsNotifyModalOpen}
        />
      </section>
    </div>
  );
};

TransactionComplete.propTypes = {
  t: PropTypes.func,
  beneficiaryName: PropTypes.string,
  beneficiaryEmail: PropTypes.string,
};

const staticSelector = sl.object({
  beneficiaryName: sl.string(''),
  beneficiaryEmail: sl.string(''),
});

export default TransactionComplete;
