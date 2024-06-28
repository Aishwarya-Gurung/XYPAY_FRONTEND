import React from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import toast from 'components/form/toast-message-container';

import {
  isInputEmpty,
  getReduxState,
  phoneValidator,
  validateNumber,
  setIsInvalidField,
} from 'utils';
import { getBeneficiaryList, addBeneficiaryWallet } from 'beneficiary';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const INPUT = {
  ID_VALUE: 'identificationValue',
};

class CreateBeneficiaryPayoutMethod extends React.Component {
  state = {
    identificationValueError: null,
  };

  setErrorState = (input, errorMessage = i18n.t('validation.This field cannot be empty')) => {
    if (errorMessage !== '') {
      setIsInvalidField(input);
    }

    this.setState(() => ({ [`${input.name}Error`]: errorMessage }));

    return false;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const wallet = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (!input.disabled && input.name) {
        if (this.handleValidation(input)) {
          if (input.value) {
            wallet[input.name] = input.value;
          }
        } else if (!isInputFocused) {
          input.focus();
          isFormValid = false;
          isInputFocused = true;
        }
      }
    }

    if (isFormValid) {
      this.handleAddBeneficiaryWallet(wallet);
    }
  };

  handleAddBeneficiaryWallet = async (wallet) => {
    const {
      t,
      getBeneficiaryList,
      addBeneficiaryWallet,
      handleAddBeneficiaryWalletSuccess,
    } = staticSelector.select(this.props);

    const walletReferenceId = await addBeneficiaryWallet(wallet);

    if (walletReferenceId) {
      toast.success(t('beneficiary.Beneficiary mobile wallet has been added'));

      await getBeneficiaryList();

      return handleAddBeneficiaryWalletSuccess(walletReferenceId);
    }
  };

  handleValidation = (input) => {
    const { selectedCountry } = staticSelector.select(this.props);

    if (isInputEmpty(input)) {
      return this.setErrorState(input);
    }

    if (
      input.name === INPUT.ID_VALUE &&
      !phoneValidator().validate(input.value, selectedCountry.threeCharCode)
    ) {
      return this.setErrorState(input, i18n.t('validation.Please enter valid identification number'));
    }

    this.setErrorState(input, '');

    return true;
  };

  render() {
    const {
      t,
      error,
      beneficiaryId,
      selectedCountry,
      isAddingPayoutMethod,
    } = staticSelector.select(this.props);

    return (
      <div className="col-md-12 col-lg-12 p-0">
        <fieldset disabled={isAddingPayoutMethod}>
          <form
            autoComplete="off"
            onSubmit={(e) => this.handleSubmit(e)}
            onBlur={(e) => this.handleValidation(e.target)}
          >
            <p className="bold">
              {t('beneficiary.Add beneficiary mobile wallet phone number')}
            </p>

            {error && (
              <span className="text-danger small alert-danger">
                <i className="icon ion-md-remove-circle text-danger" /> {error}
              </span>
            )}

            <input type="hidden" name="beneficiaryId" value={beneficiaryId} />

            <div className="row">
              <div className="col-3 form-group">
                <select
                  name="countryCode"
                  className="custom-select phonecode-field"
                >
                  <option value={selectedCountry.phoneCode}>
                    {selectedCountry.phoneCode}
                  </option>
                </select>
              </div>

              <div className="col-9 form-group">
                <input
                  type="text"
                  onKeyDown={validateNumber}
                  className="form-control"
                  placeholder={t('beneficiary.Identification Value')}
                  name="identificationValue"
                  autoComplete="off"
                  maxLength={phoneValidator().getMaxLength(
                    selectedCountry.threeCharCode
                  )}
                />
                <div className="invalid-feedback">
                  {this.state.identificationValueError}
                </div>
              </div>
            </div>

            <button className="btn btn-lg btn-green my-4">
              {isAddingPayoutMethod && <WhiteSpinner />}
              {t('button.Click to Continue')}
            </button>
          </form>
        </fieldset>
      </div>
    );
  }
}

CreateBeneficiaryPayoutMethod.propTypes = {
  sl: PropTypes.func,
  error: PropTypes.string,
  history: PropTypes.object,
  selectedCountry: PropTypes.object,
  getBeneficiaryList: PropTypes.func,
  addBeneficiaryWallet: PropTypes.func,
  isAddingPayoutMethod: PropTypes.bool,
  storeBeneficiaryDetails: PropTypes.func,
  handleAddBeneficiaryWalletSuccess: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  country: sl.string(''),
  error: sl.string(''),
  beneficiaryId: sl.string(''),
  getBeneficiaryList: sl.func(),
  selectedCountry: sl.object({
    name: sl.string(''),
    flagUrl: sl.string(''),
    phoneCode: sl.string(''),
    twoCharCode: sl.string(''),
    threeCharCode: sl.string(''),
  }),
  addBeneficiaryWallet: sl.func(),
  storeBeneficiaryDetails: sl.func(),
  isAddingPayoutMethod: sl.boolean(false),
  handleAddBeneficiaryWalletSuccess: sl.func(),
});

const mapStateToProps = (state) => {
  return {
    isAddingPayoutMethod: getReduxState(
      ['beneficiary', 'isAddingPayoutMethod'],
      state
    ),
    error: getReduxState(['beneficiary', 'error'], state),
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getBeneficiaryList,
      addBeneficiaryWallet,
    },
    dispatch
  );

const AddBeneficiaryWalletForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CreateBeneficiaryPayoutMethod));

export default AddBeneficiaryWalletForm;
