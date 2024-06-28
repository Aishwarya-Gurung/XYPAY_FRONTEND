import React from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import {
  isInputEmpty,
  getReduxState,
  validateNumber,
  validateString,
  setIsInvalidField,
} from 'utils';
import { ROUTES } from 'app';
import sl from 'components/selector/selector';
import { isCurrentPath } from 'utils/routes-helper';
import toast from 'components/form/toast-message-container';
import {
  getBeneficiaryList,
  addBeneficiaryBank,
  getBeneficiaryBanks,
  getBeneficiaryBanksByCountry,
} from 'beneficiary';
import RemittancePurposeSelector from 'components/form/remittance-purpose-selector';

import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

class CreateBeneficiaryPayoutMethod extends React.Component {
  state = {
    currency: '',
    bankIdError: null,
    accountNumberError: null,
    branchLocationError: null,
    remittancePurposeError: null,
  };

  setErrorState = (input, errorMessage = i18n.t('validation.This field cannot be empty')) => {
    if (errorMessage !== '') {
      setIsInvalidField(input);
    }

    this.setState(() => {
      return { [`${input.name}Error`]: errorMessage };
    });

    return false;
  };

  componentDidMount = async () => {
    const { getBeneficiaryBanksByCountry } = staticSelector.select(this.props);

    if (isCurrentPath(ROUTES.NEW_BENEFICIARY)) {
      await getBeneficiaryBanksByCountry(
        this.props.selectedCountry.threeCharCode
      );
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const bankDetails = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (!input.disabled && input.name) {
        if (this.handleValidation(input)) {
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
      this.handleAddBeneficiaryBank(bankDetails);
    }
  };

  handleAddBeneficiaryBank = async (bankDetails) => {
    const {
      t,
      getBeneficiaryList,
      addBeneficiaryBank,
      handleAddBeneficiaryBankSuccess,
    } = staticSelector.select(this.props);

    bankDetails.accountType = 'SAVINGS';
    const bankReferenceId = await addBeneficiaryBank(bankDetails);

    if (bankReferenceId) {
      toast.success(
        t('beneficiary.Beneficiary bank has been successfully added')
      );

      await getBeneficiaryList();

      return handleAddBeneficiaryBankSuccess(
        bankReferenceId,
        bankDetails.remittancePurpose
      );
    }
  };

  handleValidation = (input) => {
    const inputName = input.name;

    if (inputName === 'beneficiaryId' && isInputEmpty(input)) {
      return this.setState(() => {
        return {
          paymentPayoutMethodError: i18n.t('validation.Please select a beneficiary'),
        };
      });
    }

    if (inputName !== 'branchLocation' && isInputEmpty(input)) {
      return this.setErrorState(input);
    }

    if (
      inputName === 'branchLocation' &&
      input.value &&
      !validateString(input.value)
    ) {
      return this.setErrorState(input, i18n.t('validation.Please enter a valid location'));
    }

    if (inputName === 'accountNumber') {
      // validation account number will be done later
    }

    this.setErrorState(input, '');

    return true;
  };

  filterCurrency = () => {
    const { beneficiaryBanks, paymentDetail } = staticSelector.select(
      this.props
    );

    if (isCurrentPath(ROUTES.NEW_BENEFICIARY)) {
      return beneficiaryBanks?.filter(
        (bank) => bank.currency === this.state.currency
      );
    }
    
    return beneficiaryBanks?.filter(
      (bank) => bank.currency === paymentDetail.receivingCurrency
    );
  };

  render() {
    const { t, beneficiaryId, selectedCountry, isAddingPayoutMethod } =
      staticSelector.select(this.props);

    return (
      <div className="col-md-12 col-lg-12">
        <fieldset disabled={isAddingPayoutMethod}>
          <form
            autoComplete="off"
            onSubmit={(e) => this.handleSubmit(e)}
            onBlur={(e) => this.handleValidation(e.target)}
          >
            <p className="bold">{t('beneficiary.Add beneficiary bank')}</p>

            {this.state.paymentPayoutMethodError && (
              <span className="text-danger small alert-danger">
                <i className="icon ion-md-remove-circle text-danger" />{' '}
                {this.state.paymentPayoutMethodError}
              </span>
            )}

            <div className="row">
              {isCurrentPath(ROUTES.NEW_BENEFICIARY) && (
                <div className="col-12 form-group">
                  <select
                    name="currency"
                    className="custom-select"
                    onChange={(e) =>
                      this.setState({ currency: e.target.value })
                    }
                  >
                    <option value="">{t('beneficiary.Select Currency')}</option>
                    {selectedCountry.currency.map((currency, key) => (
                      <option key={key} value={currency.code}>
                        {currency.name}({currency.code})
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {i18n.t('validation.Please select a currency')}
                  </div>
                </div>
              )}
              <input type="hidden" name="beneficiaryId" value={beneficiaryId} />

              <div className="col-12 form-group">
                <select className="custom-select" name="bankId">
                  <option value="">{t('beneficiary.Select the bank')}</option>
                  {this.filterCurrency().map((bank, key) => (
                    <option key={key} value={bank.referenceId}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{this.state.bankIdError}</div>
              </div>

              {/* 
              We dont need this field for now
              <div className="col-12 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('beneficiary.Branch Location')}
                  name="branchLocation"
                  autoComplete="offf"
                />
                <div className="invalid-feedback">
                  {this.state.branchLocationError}
                </div>
              </div> */}

              <div className="col-12 form-group">
                <input
                  type="number"
                  onKeyDown={validateNumber}
                  className="form-control"
                  placeholder={t('beneficiary.Account Number')}
                  name="accountNumber"
                  autoComplete="off"
                />
                <div className="invalid-feedback">
                  {this.state.accountNumberError}
                </div>
              </div>
            </div>

            {!isCurrentPath(ROUTES.NEW_BENEFICIARY) && (
              <RemittancePurposeSelector
                varient="p"
                remittancePurposeError={this.state.remittancePurposeError}
              />
            )}

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
  history: PropTypes.object,
  beneficiaryBanks: PropTypes.array,
  addBeneficiaryBank: PropTypes.func,
  selectedCountry: PropTypes.object,
  getBeneficiaryList: PropTypes.func,
  isAddingPayoutMethod: PropTypes.bool,
  isBeneficiaryBankFetched: PropTypes.bool,
  handleAddBeneficiaryBankSuccess: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),

  beneficiaryBanks: sl.list(
    sl.object({
      id: sl.number(null),
      name: sl.string(''),
      currency: sl.string(''),
      referenceId: sl.number(null),
    })
  ),
  paymentDetail: sl.object({
    receivingCurrency: sl.string(''),
  }),
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
  country: sl.string(''),
  beneficiaryId: sl.string(''),
  getBeneficiaryList: sl.func(),
  addBeneficiaryBank: sl.func(),
  getBeneficiaryBanks: sl.func(),
  receivingCurrency: sl.string(''),
  getBeneficiaryBanksByCountry: sl.func(),
  isAddingPayoutMethod: sl.boolean(false),
  handleAddBeneficiaryBankSuccess: sl.func(),
  isBeneficiaryBankFetched: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    isBeneficiaryBankFetched: getReduxState(
      ['beneficiary', 'isBeneficiaryBankFetched'],
      state
    ),
    isAddingPayoutMethod: getReduxState(
      ['beneficiary', 'isAddingPayoutMethod'],
      state
    ),
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),
    beneficiaryBanks: getReduxState(['beneficiary', 'beneficiaryBanks'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getBeneficiaryBanks,
      addBeneficiaryBank,
      getBeneficiaryList,
      getBeneficiaryBanksByCountry,
    },
    dispatch
  );

const AddBeneficiaryBankForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CreateBeneficiaryPayoutMethod));

export default AddBeneficiaryBankForm;
