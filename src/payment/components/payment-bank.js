import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PAYMENT_METHOD } from 'app';
import BlinkTextLoader from 'components/form/blink-loader-text';

import sl from 'components/selector/selector';

const updateSelectedBank = (bankId, banks, selectBank) => {
  let bankAccount = null;

  if (banks.length === 1) {
    bankAccount = banks[0];
  } else {
    bankAccount = banks.find((bank) => bank.id === bankId);
  }

  if (bankAccount) {
    return selectBank(bankAccount);
  }
};

const addBank = (toggleWidgetModal, bankReLoginRequired) => {
  bankReLoginRequired(null);
  toggleWidgetModal(true);
};

const PaymentBank = (props) => {
  const {
    banks,
    isFetching,
    defaultValue,
    senderBankError,
    toggleWidgetModal,
    updatePaymentMethod,
    bankReLoginRequired,
    isCurrentPaymentMethod,
  } = staticSelector.select(props);

  const { t } = useTranslation();
  const [selectedBank, selectBank] = useState(null);

  if (!selectedBank && (defaultValue || banks.length === 1)) {
    updateSelectedBank(defaultValue, banks, selectBank);
  }

  return (
    <React.Fragment>
      <div className="card mb-3 ">
        <label
          className={
            isCurrentPaymentMethod
              ? 'card-top media p-3 active '
              : 'card-top media p-3'
          }
        >
          <i className="icon ion-md-cash h3 mr-3 text-muted" />
          <div className="media-body">
            <h4 className="m-0">{t('payment.Use Bank Account')}</h4>
            <small className="text-muted mr-2">
              {t('payment.Your bank account will be charged')}
            </small>
            {/* <div className="alert alert-success m-0 mt-2 small fee-tag d-inline-block">
              <i className="icon ion-md-pricetag mr-1"></i>
              <span className="">{t('payment.Lower transfer fees')}</span>
            </div> */}
          </div>
          <div className="media-right">
            <div className="checkbox-wrapper">
              <input
                type="radio"
                name="paymentMethod"
                checked={isCurrentPaymentMethod}
                value={PAYMENT_METHOD.BANK_ACCOUNT}
                onChange={(e) => updatePaymentMethod(e.target.value)}
              />
              <span />
            </div>
          </div>
        </label>

        <div
          className={isCurrentPaymentMethod ? 'card-body border-top' : 'hide'}
        >
          <h5>{t('payment.Please select your bank')}</h5>
          {isFetching ? (
            <BlinkTextLoader
              align="left"
              message={t(
                'payment.Collecting your Bank information Please wait'
              )}
            />
          ) : Object.keys(banks).length ? (
            <div className="form-group">
              <label>
                <select
                  name="senderBank"
                  className="custom-select"
                  defaultValue={defaultValue}
                  disabled={isCurrentPaymentMethod ? false : true}
                  onChange={(e) =>
                    updateSelectedBank(e.target.value, banks, selectBank)
                  }
                >
                  {banks.length > 1 && (
                    <option value="">
                      {t('payment.Please select your bank')}
                    </option>
                  )}
                  {banks.map((bank, key) => (
                    <option value={bank.id} key={key}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{senderBankError}</div>
              </label>

              {selectedBank && (
                <div className="col-md-12 m-0 alert alert-info">
                  <div>
                    {t(`payment.Bank`)}: <b>{selectedBank.name}</b>
                  </div>
                  <div>
                    {t(`payment.Account Holder`)}:{' '}
                    <b>{selectedBank.accountHolderName}</b>
                  </div>
                  <div>
                    {t(`payment.Account Type`)}:{' '}
                    <b>{selectedBank.accountType}</b>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="alert alert-info">
              <i className="icon ion-md-information-circle" />{' '}
              {t('payment.No banks are added yet')}
            </div>
          )}

          <span>{t('form.or,')}</span>
          <span
            onClick={() => addBank(toggleWidgetModal, bankReLoginRequired)}
            className="btn btn-sm btn-link p-0"
          >
            {t('payment.Add Bank')}
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

PaymentBank.prototypes = {
  banks: PropTypes.array,
  isFetching: PropTypes.bool,
  defaultValue: PropTypes.string,
  senderBankError: PropTypes.string,
  toggleWidgetModal: PropTypes.func,
  updatePaymentMethod: PropTypes.func,
  bankReLoginRequired: PropTypes.func,
  isCurrentPaymentMethod: PropTypes.bool,
};

const staticSelector = sl.object({
  banks: sl.list(
    sl.object({
      id: sl.string(''),
      name: sl.string(''),
      currency: sl.string(''),
      accountType: sl.string(''),
      accountHolderName: sl.string(''),
    })
  ),
  defaultValue: sl.string(''),
  toggleWidgetModal: sl.func(),
  isFetching: sl.boolean(false),
  senderBankError: sl.string(''),
  updatePaymentMethod: sl.func(),
  bankReLoginRequired: sl.func(),
  isCurrentPaymentMethod: sl.boolean(false),
});

export default PaymentBank;
