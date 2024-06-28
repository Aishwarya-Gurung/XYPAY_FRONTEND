import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import { history, ROUTES, PAYOUT_METHOD } from 'app';

import sl from 'components/selector/selector';

const getCurrentPathLocation = () => {
  return history.location.pathname;
};

const CashPickup = (props) => {
  const { t } = useTranslation();
  const {
    beneficiaryCountry,
    updatePayoutMethod,
    isCurrentPayoutMethod,
    closeAddPayoutMethodModal,
  } = staticSelector.select(props);

  return (
    <React.Fragment>
      <div className="card mb-3">
        <label
          className={
            isCurrentPayoutMethod
              ? 'card-top media p-3 active '
              : 'card-top media p-3'
          }
        >
          <i className="icon ion-md-cash h3 mr-3 text-muted" />
          <div className="media-body">
            <h4 className="m-0">{t('beneficiary.Pickup Cash')}</h4>
            <small className="text-muted">
              <Trans i18nKey="beneficiary.You can collect your money at any Ismail FX location in">
                You can collect your money at any Ismail FX location in{' '}
                {beneficiaryCountry.name}
              </Trans>
            </small>
          </div>
          <div className="media-right">
            <div className="checkbox-wrapper">
              <input
                type="radio"
                name="payoutMethod"
                checked={isCurrentPayoutMethod}
                value={PAYOUT_METHOD.CASH_PICKUP}
                onChange={(e) => updatePayoutMethod(e.target.value)}
              />
              <span />
            </div>
          </div>
        </label>
        <div
          className={isCurrentPayoutMethod ? 'card-body border-top' : 'hide'}
        >
          <div className="alert alert-info d-flex small p-2">
            <i className="icon ion-md-information-circle mr-1" />
            <span>
              {t('beneficiary.Cash pickup is already enabled Please continue')}
            </span>
          </div>
          {getCurrentPathLocation() === ROUTES.BENEFICIARY_LIST ? (
            <button
              className="btn btn-md btn-green"
              onClick={closeAddPayoutMethodModal}
            >
              {t('button.Continue')}
            </button>
          ) : (
            <Link
              to={ROUTES.BENEFICIARY_DETAILS}
              className="btn btn-md btn-green"
            >
              {t('button.Continue')}
            </Link>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

CashPickup.propTypes = {
  t: PropTypes.func,
  error: PropTypes.string,
  updatePayoutMethod: PropTypes.func,
  isCurrentPayoutMethod: PropTypes.bool,
  closeAddPayoutMethodModal: PropTypes.func,
};

const staticSelector = sl.object({
  error: sl.string(null),
  beneficiaryCountry: sl.object({
    name: sl.string(''),
  }),
  closeAddPayoutMethodModal: sl.func(),
  isCurrentPayoutMethod: sl.boolean(false),
  updatePayoutMethod: sl.func(function () {
    return;
  }),
});

export default CashPickup;
