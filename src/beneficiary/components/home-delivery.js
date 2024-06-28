import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES, PAYOUT_METHOD } from 'app';

import sl from 'components/selector/selector';

const HomeDelivery = (props) => {
  const { t } = useTranslation();
  const {
    error,
    isCurrentPayoutMethod,
    updatePayoutMethod,
  } = staticSelector.select(props);

  return (
    <React.Fragment>
      <div title="This feature is coming soon" className="card mb-3 text-muted">
        <label
          className={
            isCurrentPayoutMethod
              ? 'card-top media p-3 active '
              : 'card-top media p-3'
          }
        >
          <i className="icon ion-md-home h3 mr-3 text-muted" />
          <div className="media-body">
            <h4 className="m-0">{t('beneficiary.Home Delivery')}</h4>
            <small className="text-muted">
              {t('beneficiary.Get the money delivered to your home')}
            </small>
          </div>
          <div className="media-right">
            <div className="checkbox-wrapper">
              <input
                disabled
                type="radio"
                name="payoutMethod"
                checked={isCurrentPayoutMethod}
                value={PAYOUT_METHOD.HOME_DELIVERY}
                onChange={(e) => updatePayoutMethod(e.target.value)}
              />
              <span />
            </div>
          </div>
        </label>

        <div
          className={isCurrentPayoutMethod ? 'card-body border-top' : 'hide'}
        >
          <h5>
            {t(
              'beneficiary.Please provide where the agent should deliver the payment to'
            )}
          </h5>

          <div className="form-group">
            <label>
              <select
                className="custom-select"
                name="homeDeliveryCity"
                disabled={isCurrentPayoutMethod ? false : true}
              >
                <option value="">
                  {t('beneficiary.Please select your City')}
                </option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
              <div className="invalid-feedback">{error}</div>
            </label>
          </div>
          <button className="btn btn-md btn-primary mr-1">
            {t('button.Save Info')}
          </button>
          <Link
            to={ROUTES.BENEFICIARY_DETAILS}
            className="btn btn-md btn-default"
          >
            {t('button.Cancel')}
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

HomeDelivery.propTypes = {
  t: PropTypes.func,
  error: PropTypes.string,
  isCurrentPayoutMethod: PropTypes.bool,
  updatePayoutMethod: PropTypes.func,
};

const staticSelector = sl.object({
  error: sl.string(null),
  isCurrentPayoutMethod: sl.boolean(false),
  updatePayoutMethod: sl.func(function () {
    return;
  }),
});

export default HomeDelivery;
