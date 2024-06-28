import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import toast from 'components/form/toast-message-container';
import RemittancePurposeSelector from 'components/form/remittance-purpose-selector';

import {
  isInputEmpty,
  validateNumber,
  setIsInvalidField,
  unsetIsInvalidField,
} from 'utils';
import { isCurrentPath } from 'utils/routes-helper';

import { PAYOUT_METHOD, ROUTES } from 'app';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const BankDeposit = (props) => {
  const { t } = useTranslation();
  const {
    isAddingBank,
    cancelAddBank,
    selectedCountry,
    beneficiaryBanks,
    updatePayoutMethod,
    isCurrentPayoutMethod,
  } = staticSelector.select(props);

  const [errors, setErrors] = useState({});
  const [currency, setCurrency] = useState('');

  const error = useSelector((state) => state.beneficiary.error);

  const setError = (
    input,
    message = i18n.t('validation.This field cannot be empty')
  ) => {
    setIsInvalidField(input);
    errors[input.name] = message;
    setErrors({ ...errors });

    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const bankDetails = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (!input.disabled && input.name) {
        if (handleValidation(input)) {
          if (input.value) {
            bankDetails[input.name] = input.value;
          }
        } else if (!isInputFocused) {
          input.focus();
          isFormValid = false;
          isInputFocused = true;
        }
      }
    }
    if (isFormValid) {
      handleAddBank(bankDetails);
    }
  };

  const handleAddBank = async (bankDetails) => {
    const { addBank, beneficiaryId, updateBeneficiaryDetails } =
      staticSelector.select(props);

    bankDetails.accountType = 'SAVINGS';
    bankDetails.beneficiaryId = beneficiaryId;
    bankDetails.currency = currency;

    const bankReferenceId = await addBank(bankDetails);

    if (bankReferenceId) {
      const beneficiaryDetails = {
        bankId: bankReferenceId,
        beneficiaryId,
        payoutMethod: PAYOUT_METHOD.BANK_DEPOSIT,
        remittancePurpose: bankDetails.remittancePurpose,
        currency,
      };

      toast.success(
        i18n.t('validation.Beneficiary bank has been successfully added')
      );

      return updateBeneficiaryDetails(beneficiaryDetails);
    }
  };

  const handleValidation = (input) => {
    if (isInputEmpty(input)) {
      return setError(input);
    }

    unsetIsInvalidField(input);

    return true;
  };

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
          <i className="icon ion-md-business h3 mr-3 text-muted" />
          <div className="media-body">
            <h4 className="m-0">{t('beneficiary.Bank Deposit')}</h4>
            <p className="text-muted small-text">
              {t('beneficiary.Transfer money directly to a bank account')}
            </p>
          </div>
          <div className="media-right">
            <div className="checkbox-wrapper">
              <input
                type="radio"
                name="payoutMethod"
                checked={isCurrentPayoutMethod}
                value={PAYOUT_METHOD.BANK_DEPOSIT}
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
              'beneficiary.Please enter the account number for your beneficiary'
            )}
          </h5>
          <fieldset disabled={isAddingBank}>
            {error && (
              <span className="text-danger small alert-danger d-flex">
                <i className="icon ion-md-remove-circle text-danger mr-1" />
                {error}
              </span>
            )}
            <form
              autoComplete={'off'}
              onSubmit={handleSubmit}
              onBlur={(e) => handleValidation(e.target)}
            >
              {isCurrentPath(ROUTES.BENEFICIARY_LIST) && (
                <div className="form-group">
                  <label>
                    <select
                      name="currency"
                      className="custom-select lead"
                      disabled={!isCurrentPayoutMethod}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="">
                        {t('beneficiary.Select Currency')}
                      </option>
                      {selectedCountry.currency.map((currency, key) => (
                        <option key={key} value={currency.code}>
                          {currency.name}({currency.code})
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{errors.currency}</div>
                  </label>
                </div>
              )}
              <div className="form-group">
                <label>
                  <select
                    name="bankId"
                    className="custom-select lead"
                    disabled={!isCurrentPayoutMethod}
                  >
                    <option value="">{t('beneficiary.Select the bank')}</option>
                    {beneficiaryBanks
                      ?.filter((bank) => bank.currency === currency)
                      .map((bank, key) => (
                        <option key={key} value={bank.referenceId}>
                          {bank.name}
                        </option>
                      ))}
                  </select>
                  <div className="invalid-feedback">{errors.bankId}</div>
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="number"
                    onKeyDown={validateNumber}
                    autoComplete="off"
                    name="accountNumber"
                    disabled={!isCurrentPayoutMethod}
                    className="form-control form-lead"
                    placeholder={t('beneficiary.Account Number')}
                  />
                  <div className="invalid-feedback">{errors.accountNumber}</div>
                </label>
              </div>

              {!isCurrentPath(ROUTES.BENEFICIARY_LIST) && (
                <RemittancePurposeSelector
                  varient="lead"
                  remittancePurposeError={errors.remittancePurpose}
                />
              )}

              <div
                title={t('button.Previous Step')}
                onClick={cancelAddBank}
                className="btn btn-md btn-default mr-2"
              >
                <i className="icon ion-md-arrow-round-back"></i>
              </div>
              <button className="btn btn-md btn-green">
                {isAddingBank && <WhiteSpinner />} {t('button.Save')}
              </button>
            </form>
          </fieldset>
        </div>
      </div>
    </React.Fragment>
  );
};

BankDeposit.propTypes = {
  t: PropTypes.func,
  addBank: PropTypes.func,
  isAddingBank: PropTypes.bool,
  cancelAddBank: PropTypes.func,
  beneficiaryId: PropTypes.string,
  selectedCountry: PropTypes.object,
  beneficiaryBanks: PropTypes.array,
  updatePayoutMethod: PropTypes.func,
  isCurrentPayoutMethod: PropTypes.bool,
  updateBeneficiaryDetails: PropTypes.func,
};

const staticSelector = sl.object({
  addBank: sl.func(),
  beneficiaryBanks: sl.list(
    sl.object({
      id: sl.number(null),
      name: sl.string(''),
      currency: sl.string(''),
      referenceId: sl.number(null),
    })
  ),
  cancelAddBank: sl.func(),
  selectedCountry: sl.object({
    threeCharCode: sl.string(''),
    currency: sl.list(
      sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      })
    ),
  }),
  beneficiaryId: sl.string(''),
  bankReferenceId: sl.string(''),
  isAddingBank: sl.boolean(false),
  updateBeneficiaryDetails: sl.func(),
  isCurrentPayoutMethod: sl.boolean(false),
  updatePayoutMethod: sl.func(function () {
    return;
  }),
});

export default BankDeposit;
