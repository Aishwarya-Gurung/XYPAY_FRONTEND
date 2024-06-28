import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { toggleWidgetModal } from 'sender';
import sl from 'components/selector/selector';
import { ROUTES, PAYOUT_METHOD } from 'app';
import { isPayoutCurrencyAvailable } from 'beneficiary/beneficiary.helper.js';

const CashPickupSelector = (props) => {
  const { t } = useTranslation();
  const { selectedCountry, updatePayoutMethod } = staticSelector.select(props);

  return (
    <div className="card mb-3">
      <label className="card-top media p-3">
        <i className="icon ion-md-cash h3 mr-3 text-muted" />
        <div className="media-body">
          <h4 className="m-0">{t('beneficiary.Pickup Cash')}</h4>
          <small className="text-muted">
            <Trans i18nKey="beneficiary.You can collect your money at any Ismail FX location in">
              You can collect your money at any Ismail FX location in{' '}
              {selectedCountry.name}.
            </Trans>
          </small>
        </div>
        <div className="media-right">
          <div className="checkbox-wrapper">
            <input
              type="radio"
              name="payoutMethod"
              value={PAYOUT_METHOD.CASH_PICKUP}
              onChange={(e) => updatePayoutMethod(e.target.value)}
            />
            <span />
          </div>
        </div>
      </label>
    </div>
  );
};

const MobileWalletSelector = (props) => {
  const { t } = useTranslation();
  const { updatePayoutMethod } = staticSelector.select(props);

  return (
    <div className="card mb-3">
      <label className="card-top media p-3">
        <i className="icon ion-md-business h3 mr-3 text-muted" />
        <div className="media-body">
          <h4 className="m-0">{t('beneficiary.Mobile Money')}</h4>
          <small className="text-muted">
            {t(
              'beneficiary.Transfer money directly to an Orange Money or Afri Money account'
            )}
          </small>
        </div>
        <div className="media-right">
          <div className="checkbox-wrapper">
            <input
              type="radio"
              name="payoutMethod"
              value={PAYOUT_METHOD.WALLET}
              onChange={(e) => updatePayoutMethod(e.target.value)}
            />
            <span />
          </div>
        </div>
      </label>
    </div>
  );
};

const HomeDeliverySelector = (props) => {
  const { t } = useTranslation();
  const { updatePayoutMethod } = staticSelector.select(props);

  return (
    <div title="This feature is coming soon" className="card mb-3 text-muted">
      <label className="card-top media p-3">
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
              type="radio"
              name="payoutMethod"
              value={PAYOUT_METHOD.HOME_DELIVERY}
              onChange={(e) => updatePayoutMethod(e.target.value)}
              disabled
            />
            <span />
          </div>
        </div>
      </label>
    </div>
  );
};

const BankDepositSelector = (props) => {
  const { t } = useTranslation();
  const { updatePayoutMethod } = staticSelector.select(props);

  return (
    <div className="card mb-3">
      <label className="card-top media p-3">
        <i className="icon ion-md-business h3 mr-3 text-muted" />
        <div className="media-body">
          <h4 className="m-0">{t('beneficiary.Send to Bank Account')}</h4>
          <small className="text-muted">
            {t('beneficiary.Transfer money directly to a bank account')}
          </small>
        </div>
        <div className="media-right">
          <div className="checkbox-wrapper">
            <input
              type="radio"
              name="payoutMethod"
              value={PAYOUT_METHOD.BANK_DEPOSIT}
              onChange={(e) => updatePayoutMethod(e.target.value)}
            />
            <span />
          </div>
        </div>
      </label>
    </div>
  );
};

const PayoutMethodSelector = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    handleCancel,
    payoutMethod,
    updatePayoutMethod,
    handleAddBeneficiaryDetails,
  } = props;
  const { isBeneficiaryAvailable } = staticSelector.select(props);

  const { selectedCountry } = useSelector((state) =>
    staticSelector.select(state.home)
  );

  const { kycStatus } = useSelector((state) =>
    staticSelector.select(state.auth)
  );

  const { isBankDepositEnabled, isMobileWalletEnabled, isCashPickupEnabled } =
    selectedCountry.payoutMethod;

  const handleWidgetToggle = (dispatch) => {
    if (window.location.pathname === ROUTES.SENDER_PROFILE) {
      return dispatch(toggleWidgetModal(true));
    }
  };

  return (
    <React.Fragment>
      <p className="bold">{t('beneficiary.Select the Payout Method')}</p>
      {isMobileWalletEnabled &&
        isPayoutCurrencyAvailable(selectedCountry.currency[0]?.code) && (
          <MobileWalletSelector updatePayoutMethod={updatePayoutMethod} />
        )}
      {isCashPickupEnabled && (
        <CashPickupSelector
          selectedCountry={selectedCountry}
          updatePayoutMethod={updatePayoutMethod}
        />
      )}
      {isBankDepositEnabled && (
        <BankDepositSelector updatePayoutMethod={updatePayoutMethod} />
      )}
      {isBeneficiaryAvailable && (
        <Link
          title={t('button.Previous Step')}
          to={handleCancel}
          className="btn btn-lg btn-default text-primary my-4 mr-2"
        >
          <i className="icon ion-md-arrow-round-back"></i>
        </Link>
      )}
      <button
        onClick={handleAddBeneficiaryDetails}
        className="btn btn-lg btn-green"
        disabled={!payoutMethod}
      >
        {t('button.Click to Continue')}
      </button>
    </React.Fragment>
  );
};

BankDepositSelector.propTypes = {
  t: PropTypes.func,
  updatePayoutMethod: PropTypes.func,
};

MobileWalletSelector.propTypes = {
  t: PropTypes.func,
  updatePayoutMethod: PropTypes.func,
};

HomeDeliverySelector.propTypes = {
  t: PropTypes.func,
  updatePayoutMethod: PropTypes.func,
};

CashPickupSelector.propTypes = {
  t: PropTypes.func,
  selectedCountry: PropTypes.object,
  updatePayoutMethod: PropTypes.func,
};

PayoutMethodSelector.propTypes = {
  handleCancel: PropTypes.string,
  payoutMethod: PropTypes.string,
  updatePayoutMethod: PropTypes.func,
  isBeneficiaryAvailable: PropTypes.bool,
  handleAddBeneficiaryDetails: PropTypes.func,
  paymentDetail: PropTypes.object,
};

const staticSelector = sl.object({
  isBeneficiaryAvailable: sl.boolean(true),
  updatePayoutMethod: sl.func(function () {
    return;
  }),
  selectedCountry: sl.object({
    flagUrl: sl.string(''),
    name: sl.string(''),
    phoneCode: sl.string(''),
    twoCharCode: sl.string(''),
    threeCharCode: sl.string(''),
    currency: sl.list(
      sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      })
    ),
    payoutMethod: sl.object({
      isCashPickupEnabled: sl.boolean(false),
      isBankDepositEnabled: sl.boolean(false),
      isMobileWalletEnabled: sl.boolean(false),
      isHomeDeliveryEnabled: sl.boolean(false),
    }),
  }),
  kycStatus: sl.string(''),
  paymentDetail: sl.object({
    country: sl.string(''),
    sendingAmount: sl.number(''),
    paymentCurrency: sl.string(''),
    receivingAmount: sl.number(''),
    receivingCurrency: sl.string(''),
    totalAmount: sl.number(''),
    exchangeRate: sl.number(''),
    destinationCountry: sl.string(''),
    transactionFee: sl.number(''),
  }),
});

export default PayoutMethodSelector;
