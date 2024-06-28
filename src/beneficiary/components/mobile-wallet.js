import i18n from 'i18next';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import sl from 'components/selector/selector';
import toast from 'components/form/toast-message-container';
import RemittancePurposeSelector from 'components/form/remittance-purpose-selector';

import {
  isInputEmpty,
  phoneValidator,
  validateNumber,
  setIsInvalidField,
  unsetIsInvalidField,
} from 'utils';
import { isCurrentPath } from 'utils/routes-helper';

import { resetError } from 'beneficiary';
import { PAYOUT_METHOD, ROUTES } from 'app';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const INPUT = {
  ID_VALUE: 'identificationValue',
};

const MobileWallet = (props) => {
  const { t } = useTranslation();
  const {
    isAddingWallet,
    cancelAddWallet,
    selectedCountry,
    updatePayoutMethod,
    isCurrentPayoutMethod,
  } = staticSelector.select(props);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
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
    const wallet = {};
    const { selectedCountry } = staticSelector.select(props);

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (!input.disabled && input.name) {
        if (handleValidation(input, selectedCountry)) {
          if (input.value) {
            wallet[input.name] = input.value.trim();
          }
        } else if (!isInputFocused) {
          input.focus();
          isFormValid = false;
          isInputFocused = true;
        }
      }
    }
    if (isFormValid) {
      handleAddWallet(wallet);
    }
  };

  const handleAddWallet = async (wallet) => {
    const { addWallet, beneficiaryId, updateBeneficiaryDetails } =
      staticSelector.select(props);

    const walletReferenceId = await addWallet({
      beneficiaryId,
      identificationValue: wallet.identificationValue,
    });

    if (walletReferenceId) {
      const beneficiaryDetails = {
        beneficiaryId,
        walletId: walletReferenceId,
        payoutMethod: PAYOUT_METHOD.WALLET,
        remittancePurpose: wallet.remittancePurpose,
      };

      toast.success(
        i18n.t('validation.Beneficiary wallet has been successfully added')
      );

      return updateBeneficiaryDetails(beneficiaryDetails);
    }
  };

  const handleValidation = (input, selectedCountry) => {
    if (isInputEmpty(input)) {
      return setError(input);
    }

    if (
      input.name === INPUT.ID_VALUE &&
      !phoneValidator().validate(input.value, selectedCountry.threeCharCode)
    ) {
      return setError(
        input,
        i18n.t('validation.Please enter valid identification number')
      );
    }

    unsetIsInvalidField(input);

    return true;
  };

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="card mb-3 ">
        <label
          className={
            isCurrentPayoutMethod
              ? 'card-top media p-3 active '
              : 'card-top media p-3'
          }
        >
          <i className="icon ion-md-business h3 mr-3 text-muted" />
          <div className="media-body">
            <h4 className="m-0">{t('beneficiary.Mobile Money')}</h4>
            <p className="text-muted small-text">
              {t(
                'beneficiary.Transfer money directly to an Orange Money or Afri Money account'
              )}
            </p>
          </div>
          <div className="media-right">
            <div className="checkbox-wrapper">
              <input
                type="radio"
                name="payoutMethod"
                value={PAYOUT_METHOD.WALLET}
                checked={isCurrentPayoutMethod}
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
            {t('beneficiary.Please enter the id value for your beneficiary')}
          </h5>
          <fieldset disabled={isAddingWallet}>
            {error && (
              <span className="text-danger small alert-danger d-flex">
                <i className="icon ion-md-remove-circle text-danger mr-1" />
                {error}
              </span>
            )}
            <form
              autoComplete={'off'}
              onSubmit={handleSubmit}
              onBlur={(e) => handleValidation(e.target, selectedCountry)}
            >
              <div className="row">
                <div className="col-md-3 form-group">
                  <select name="countryCode" className="custom-select lead">
                    <option value={selectedCountry.phoneCode}>
                      {selectedCountry.phoneCode}
                    </option>
                  </select>
                </div>

                <div className="col-md-9 form-group">
                  <label>
                    <input
                      type="text"
                      name="identificationValue"
                      onKeyDown={validateNumber}
                      className="form-control form-lead"
                      disabled={!isCurrentPayoutMethod}
                      placeholder={t('beneficiary.Identification Value')}
                      maxLength={phoneValidator().getMaxLength(
                        selectedCountry.threeCharCode
                      )}
                    />
                    <div className="invalid-feedback">
                      {errors.identificationValue}
                    </div>
                  </label>
                </div>
              </div>

              {!isCurrentPath(ROUTES.BENEFICIARY_LIST) && (
                <RemittancePurposeSelector
                  remittancePurposeError={errors.remittancePurpose}
                />
              )}

              <div
                title={t('button.Previous Step')}
                onClick={cancelAddWallet}
                className="btn btn-md btn-default mr-2"
              >
                <i className="icon ion-md-arrow-round-back"></i>
              </div>
              <button className="btn btn-md btn-green">
                {isAddingWallet && <WhiteSpinner />} {t('button.Save')}
              </button>
            </form>
          </fieldset>
        </div>
      </div>
    </React.Fragment>
  );
};

MobileWallet.propTypes = {
  t: PropTypes.func,
  addWallet: PropTypes.func,
  isAddingWallet: PropTypes.bool,
  cancelAddWallet: PropTypes.func,
  beneficiaryId: PropTypes.string,
  selectedCountry: PropTypes.object,
  updatePayoutMethod: PropTypes.func,
  isCurrentPayoutMethod: PropTypes.bool,
  updateBeneficiaryDetails: PropTypes.func,
};

const staticSelector = sl.object({
  addWallet: sl.func(),
  cancelAddWallet: sl.func(),
  beneficiaryId: sl.string(''),

  selectedCountry: sl.object({
    phoneCode: sl.string(''),
    threeCharCode: sl.string(''),
  }),

  bankReferenceId: sl.string(''),
  isAddingWallet: sl.boolean(false),
  updateBeneficiaryDetails: sl.func(),
  isCurrentPayoutMethod: sl.boolean(false),
  updatePayoutMethod: sl.func(function () {
    return;
  }),
});

export default MobileWallet;
