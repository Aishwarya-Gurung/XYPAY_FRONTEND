/* eslint-disable indent */
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';
import React, { Fragment, Component, createRef } from 'react';

import {
  resetError,
  getPayerList,
  addBeneficiary,
  getBeneficiaryList,
  getBeneficiaryBanks,
  addBeneficiaryWallet,
} from 'beneficiary';
import { districts } from 'beneficiary/beneficiary.address';

import sl from 'components/selector/selector';
import toast from 'components/form/toast-message-container';
import RemittancePurposeSelector from 'components/form/remittance-purpose-selector';

import {
  validateName,
  isInputEmpty,
  getReduxState,
  validateEmail,
  phoneValidator,
  validateString,
  validateNumber,
  validateAddress,
  validateAlphabet,
  setIsInvalidField,
  validatePostalCode,
  validateCountryCode,
  unsetIsInvalidField,
  validateDateOfBirth,
} from 'utils';
import { isCurrentPath } from 'utils/routes-helper';

import { storePaymentDetail } from 'payment';
import { history, ROUTES, RELATIONSHIP, PAYOUT_METHOD, COUNTRY } from 'app';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const FIELD = {
  LOCALITY: 'locality',
  POSTAL_CODE: 'postal_code',
  AREA_LEVEL: 'administrative_area_level_1',
};

const ADDRESS_COMPONENT = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  postal_code: 'short_name',
  country: 'long_name',
  administrative_area_level_1: 'long_name',
};

const INPUT = {
  CITY: 'city',
  STATE: 'state',
  EMAIL: 'email',
  REGION: 'region',
  COUNTRY: 'country',
  DOB: 'dateOfBirth',
  LAST_NAME: 'lastName',
  FIRST_NAME: 'firstName',
  MIDDLE_NAME: 'middleName',
  POSTAL_CODE: 'postalCode',
  COUNTRY_CODE: 'countryCode',
  PHONE_NUMBER: 'phoneNumber',
  ADDRESS_LINE: 'addressLine1',
  RELATIONSHIP: 'senderRelationship',
};

class AddBeneficiary extends Component {
  state = {
    cityError: null,
    emailError: null,
    stateError: null,
    countryError: null,
    lastNameError: null,
    firstNameError: null,
    postalCodeError: null,
    middleNameError: null,
    dateOfBirthError: null,
    countryCodeError: null,
    phoneNumberError: null,
    addressLine1Error: null,
    senderRelationshipError: null,
    remittancePurposeError: null,

    beneficiaryAddress: {
      route: '',
      country: '',
      locality: '',
      postal_code: '',
      street_number: '',
      administrative_area_level_1: '',
    },
  };

  componentDidMount = () => {
    const { resetError, redirectedFrom, selectedCountry } =
      staticSelector.select(this.props);

    resetError();
    this.initGMapAutoComplete(selectedCountry);

    if (
      !selectedCountry.threeCharCode &&
      redirectedFrom !== ROUTES.SENDER_PROFILE
    ) {
      toast.error(i18n.t('validation.Destination country is not selected'));

      return history.push(ROUTES.PAYMENT_DETAILS);
    }
  };

  setErrorState = (
    input,
    errorMessage = i18n.t('validation.This field cannot be empty')
  ) => {
    setIsInvalidField(input);

    this.setState(() => {
      return { [`${input.name}Error`]: errorMessage };
    });

    return false;
  };

  initGMapAutoComplete = (selectedCountry) => {
    const restriction = { country: [selectedCountry.twoCharCode] };

    this.autocomplete = new window.google.maps.places.Autocomplete(
      this.autoCompleteRef.current,
      {}
    );

    if (restriction !== null) {
      this.autocomplete.setComponentRestrictions(restriction);
    }

    this.autocomplete.addListener('place_changed', () =>
      this.handlePlaceSelect(this.autocomplete)
    );
  };

  setAddressLine = (beneficiaryAddress) => {
    const streetNumber = beneficiaryAddress.street_number;
    const { route, locality } = beneficiaryAddress;

    if (streetNumber) {
      return route ? `${streetNumber}, ${route}` : streetNumber;
    }

    return route ? route : locality;
  };

  handlePlaceSelect(autocomplete) {
    const gAddress = autocomplete.getPlace().address_components;
    const address = {};

    for (let i = 0; i < gAddress.length; i++) {
      const addressType = gAddress[i].types[0];

      if (ADDRESS_COMPONENT[addressType]) {
        address[addressType] = gAddress[i][ADDRESS_COMPONENT[addressType]];
      }
    }
    this.autoCompleteRef.current.value = this.setAddressLine(address);

    this.setState((state) => ({
      beneficiaryAddress: {
        ...state.beneficiaryAddress,
        ...address,
      },
    }));
  }

  updateAddress = (e, fieldName) => {
    const beneficiaryAddress = {
      ...this.state.beneficiaryAddress,
      [fieldName]: e.target.value,
    };

    this.setState(() => ({ beneficiaryAddress }));
  };

  updatePayoutMethods = () => {
    const {
      getPayerList,
      payoutMethod,
      paymentDetails,
      selectedCountry,
      getBeneficiaryBanks,
    } = staticSelector.select(this.props);
    const currency = paymentDetails.receivingCurrency
      ? paymentDetails.receivingCurrency
      : selectedCountry.currency[0].code;

    if (payoutMethod === PAYOUT_METHOD.BANK_DEPOSIT) {
      return getBeneficiaryBanks(selectedCountry.threeCharCode, currency);
    }

    if (payoutMethod === PAYOUT_METHOD.CASH_PICKUP) {
      return getPayerList(selectedCountry.threeCharCode);
    }
  };

  handleValidation = (input) => {
    const inputName = input.name,
      inputValue = input.value ? input.value?.trim() : '';

    const { selectedCountry } = staticSelector.select(this.props);

    unsetIsInvalidField(input);

    if (isInputEmpty(input)) {
      if (inputName !== INPUT.MIDDLE_NAME && inputName !== INPUT.DOB) {
        return this.setErrorState(input);
      }
    }

    if (
      (inputName === INPUT.FIRST_NAME || inputName === INPUT.LAST_NAME) &&
      !validateName(inputValue)
    ) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a valid name')
      );
    }

    if (
      inputName === INPUT.MIDDLE_NAME &&
      inputValue &&
      !validateName(inputValue)
    ) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a valid name')
      );
    }

    if (inputName === INPUT.ADDRESS_LINE && !validateAddress(inputValue)) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a valid address')
      );
    }

    if (inputName === INPUT.CITY && !validateString(inputValue)) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a valid city')
      );
    }

    if (
      inputName === INPUT.POSTAL_CODE &&
      !validatePostalCode(inputValue, selectedCountry.threeCharCode)
    ) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a valid postal code')
      );
    }

    if (inputName === INPUT.DOB && !validateDateOfBirth(inputValue)) {
      return this.setErrorState(
        input,
        i18n.t('validation.You must be 18 years or older')
      );
    }

    if (inputName === INPUT.EMAIL && !validateEmail(inputValue)) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a valid email address')
      );
    }

    if (
      inputName === INPUT.COUNTRY_CODE &&
      !validateCountryCode(selectedCountry, inputValue)
    ) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a country code')
      );
    }

    if (
      inputName === INPUT.PHONE_NUMBER &&
      !phoneValidator().validate(inputValue, selectedCountry.threeCharCode)
    ) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter valid phone number')
      );
    }

    if (inputName === INPUT.STATE && !validateName(inputValue)) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a valid name')
      );
    }

    return true;
  };

  handleAddBeneficiary = async (e) => {
    e.preventDefault();
    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const beneficiary = {};
    const { t } = staticSelector.select(this.props);

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (this.handleValidation(input)) {
        if (input.name) {
          beneficiary[input.name] = input.value.trim();
        }
      } else if (input.name && !isInputFocused) {
        input.focus();
        isFormValid = false;
        isInputFocused = true;
      }
    }

    if (isFormValid) {
      const { addBeneficiary } = staticSelector.select(this.props);
      const beneficiaryId = await addBeneficiary(beneficiary);

      if (beneficiaryId) {
        toast.success(t('beneficiary.Beneficiary has been successfully added'));

        const { payoutMethod, handleAddBeneficiarySuccess } =
          staticSelector.select(this.props);

        if (PAYOUT_METHOD.WALLET === payoutMethod) {
          return this.handleAddWallet({
            beneficiary,
            beneficiaryId,
          });
        }

        handleAddBeneficiarySuccess(beneficiaryId, beneficiary.country);
      }
    }
  };

  handleAddWallet = async ({ beneficiaryId, beneficiary }) => {
    const { t, addBeneficiaryWallet } = staticSelector.select(this.props);

    const walletId = await addBeneficiaryWallet({
      beneficiaryId,
      identificationValue: beneficiary.phoneNumber,
    });

    if (walletId) {
      toast.success(t('beneficiary.Beneficiary mobile wallet has been added'));

      if (isCurrentPath(ROUTES.ADD_BENEFICIARY)) {
        const { getBeneficiaryList, storePaymentDetail } =
          staticSelector.select(this.props);

        getBeneficiaryList();
        await storePaymentDetail({
          walletId,
          beneficiaryId,
          payoutMethod: PAYOUT_METHOD.WALLET,
          remittancePurpose: beneficiary.remittancePurpose,
        });

        return history.push(ROUTES.PAYMENT_INFORMATION);
      }

      if (isCurrentPath(ROUTES.NEW_BENEFICIARY)) {
        return history.push(ROUTES.BENEFICIARY_LIST);
      }
    }

    toast.error(t('beneficiary.Beneficiary mobile wallet could not be added'));
    history.push({
      pathname: ROUTES.BENEFICIARY_PAYOUT_METHOD,
      state: { beneficiaryId, payoutMethod: PAYOUT_METHOD.WALLET },
    });
  };

  redirectToNextStep = async (paymentDetails) => {
    if (isCurrentPath(ROUTES.ADD_BENEFICIARY)) {
      const { getBeneficiaryList, storePaymentDetail } = staticSelector.select(
        this.props
      );

      await getBeneficiaryList();
      await storePaymentDetail(paymentDetails);

      return history.push(ROUTES.PAYMENT_INFORMATION);
    }

    if (isCurrentPath(ROUTES.NEW_BENEFICIARY)) {
      return history.push(ROUTES.BENEFICIARY_LIST);
    }
  };

  render() {
    const {
      t,
      error,
      payoutMethod,
      handleCancel,
      selectedCountry,
      isAddingBeneficiary,
    } = staticSelector.select(this.props);

    this.autoCompleteRef = createRef();

    return (
      <Fragment>
        {error && (
          <span className="text-danger small alert-danger">
            <i className="icon ion-md-remove-circle text-danger" /> {error}
          </span>
        )}
        {PAYOUT_METHOD.WALLET === payoutMethod && (
          <div className="alert alert-info small p-2 d-flex">
            <i className="icon ion-md-information-circle mr-2" />
            {t('beneficiary.wallet-info')}
          </div>
        )}
        <fieldset disabled={isAddingBeneficiary}>
          <form
            autoComplete="off"
            onSubmit={this.handleAddBeneficiary}
            onBlur={(e) => this.handleValidation(e.target)}
          >
            <p className="bold">{t('beneficiary.Add a new Beneficiary')}</p>

            <div className="row">
              <label className="form-group col-md-4">
                <span>{t('beneficiary.First Name')}</span>
                <input
                  type="text"
                  name="firstName"
                  autoComplete="off"
                  className="form-control"
                  placeholder={t('beneficiary.First Name')}
                />
                <div className="invalid-feedback">
                  {this.state.firstNameError}
                </div>
              </label>
              <label className="form-group col-md-4 ">
                <span>{t('beneficiary.Middle Name')}</span>
                <input
                  type="text"
                  name="middleName"
                  autoComplete="off"
                  className="form-control"
                  placeholder={t('beneficiary.Middle Name')}
                />
                <div className="invalid-feedback">
                  {this.state.middleNameError}
                </div>
              </label>
              <label className="form-group col-md-4">
                <span>{t('beneficiary.Last Name')}</span>
                <input
                  type="text"
                  name="lastName"
                  autoComplete="off"
                  className="form-control"
                  placeholder={t('beneficiary.Last Name')}
                />
                <div className="invalid-feedback">
                  {this.state.lastNameError}
                </div>
              </label>
              <label className="form-group col-12">
                <span>{t('beneficiary.Address Line')}</span>
                <input
                  max="255"
                  type="text"
                  autoComplete="off"
                  name="addressLine1"
                  className="form-control"
                  ref={this.autoCompleteRef}
                  placeholder={t('beneficiary.Address Line')}
                />

                <div className="invalid-feedback">
                  {this.state.addressLine1Error}
                </div>
              </label>
              <input
                type="hidden"
                name="country"
                value={selectedCountry.threeCharCode}
              />

              {COUNTRY.GUINEA === selectedCountry.threeCharCode ? (
                <label className="form-group col-md-6">
                  <span>{t('beneficiary.Region')}</span>
                  <input
                    autoComplete="off"
                    name={INPUT.STATE}
                    className="form-control"
                    onKeyPress={validateAlphabet}
                    placeholder={t('beneficiary.Region')}
                  />
                  <div className="invalid-feedback">
                    {this.state.stateError}
                  </div>
                </label>
              ) : (
                <label className="form-group col-md-6">
                  <span>{t('beneficiary.State')}</span>
                  <select
                    name="state"
                    defaultValue=""
                    className="custom-select"
                    onChange={(e) => this.updateAddress(e, FIELD.AREA_LEVEL)}
                  >
                    <React.Fragment>
                      <option value="" disabled>
                        {t('beneficiary.Select District')}
                      </option>
                      {districts.map((district, key) => (
                        <option key={key} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </React.Fragment>
                  </select>
                  <div className="invalid-feedback">
                    {this.state.stateError}
                  </div>
                </label>
              )}
              <label className="form-group col-md-6">
                <span>{t('beneficiary.City')}</span>
                <input
                  type="text"
                  name="city"
                  autoComplete="off"
                  className="form-control"
                  placeholder={t('beneficiary.City')}
                />
                <div className="invalid-feedback">{this.state.cityError}</div>
              </label>

              <label className="form-group col-md-12">
                <span>{t('beneficiary.Relationship')}</span>
                <select
                  defaultValue=""
                  name="senderRelationship"
                  className="custom-select"
                >
                  <option value="" disabled>
                    {t('beneficiary.Select Relationship')}
                  </option>
                  {RELATIONSHIP.map((relation) => (
                    <option key={relation}>{relation}</option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {this.state.senderRelationshipError}
                </div>
              </label>
            </div>
            {/* <p className="bold mt-4">
              {PAYOUT_METHOD.WALLET === payoutMethod
                ? t('beneficiary.Wallet details of the Beneficiary')
                : t('beneficiary.Phone number')}
            </p> */}
            <p className="m-0">{t('beneficiary.Phone number')}</p>

            <div className="row">
              <div className="col-3">
                <select
                  name="countryCode"
                  className="custom-select phonecode-field"
                >
                  <option value={selectedCountry.phoneCode}>
                    {selectedCountry.phoneCode}
                  </option>
                </select>
                <div className="invalid-feedback">
                  {this.state.countryCodeError}
                </div>
              </div>
              <div className="col-9">
                <label className="form-group d-block">
                  <input
                    type="text"
                    onKeyDown={validateNumber}
                    placeholder={`${
                      PAYOUT_METHOD.WALLET === payoutMethod
                        ? t('beneficiary.Enter identification value')
                        : t("beneficiary.Enter Beneficiary's phone number")
                    }`}
                    className="form-control"
                    name="phoneNumber"
                    autoComplete="off"
                    maxLength={phoneValidator().getMaxLength(
                      selectedCountry.threeCharCode
                    )}
                  />
                  <div className="invalid-feedback">
                    {this.state.phoneNumberError}
                  </div>
                </label>
              </div>

              {isCurrentPath(ROUTES.ADD_BENEFICIARY) &&
                PAYOUT_METHOD.WALLET === payoutMethod && (
                  <div className="col-12">
                    <RemittancePurposeSelector
                      varient="p"
                      remittancePurposeError={this.state.remittancePurposeError}
                    />
                  </div>
                )}
            </div>
            <Link
              title={t('button.Previous Step')}
              to={handleCancel}
              className="btn btn-lg btn-default text-primary my-4 mr-2"
            >
              <i className="icon ion-md-arrow-round-back"></i>
            </Link>

            <button className="btn btn-lg btn-green my-4">
              {isAddingBeneficiary && <WhiteSpinner />}
              {t('beneficiary.Add Beneficiary')}
            </button>
          </form>
        </fieldset>
      </Fragment>
    );
  }
}

AddBeneficiary.propTypes = {
  t: PropTypes.func,
  error: PropTypes.string,
  resetError: PropTypes.func,
  handleCancel: PropTypes.string,
  payoutMethod: PropTypes.string,
  addBeneficiary: PropTypes.func,
  selectedCountry: PropTypes.object,
  isBeneficiaryAdded: PropTypes.bool,
  getBeneficiaryList: PropTypes.func,
  storePaymentDetail: PropTypes.func,
  saveSelectedCountry: PropTypes.func,
  isAddingBeneficiary: PropTypes.bool,
  getBeneficiaryBanks: PropTypes.func,
  addBeneficiaryWallet: PropTypes.func,
  handleAddBeneficiarySuccess: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  error: sl.string(''),
  addBeneficiary: sl.func(),
  handleCancel: sl.string(''),
  storePaymentDetail: sl.func(),
  getBeneficiaryList: sl.func(),
  addBeneficiaryWallet: sl.func(),
  isBeneficiaryAdded: sl.boolean(false),
  isAddingBeneficiary: sl.boolean(false),
  handleAddBeneficiarySuccess: sl.func(),
  payoutMethod: sl.string(''),
  selectedCountry: sl.object({
    name: sl.string(''),
    flagUrl: sl.string(''),
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
  }),

  resetError: sl.func(),
  getPayerList: sl.func(),
  getBeneficiaryBanks: sl.func(),
});

const mapStateToProps = (state) => {
  return {
    isBeneficiaryAdded: getReduxState(
      ['beneficiary', 'isBeneficiaryAdded'],
      state
    ),
    isAddingBeneficiary: getReduxState(
      ['beneficiary', 'isAddingBeneficiary'],
      state
    ),
    error: getReduxState(['beneficiary', 'error'], state),
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      resetError,
      getPayerList,
      addBeneficiary,
      storePaymentDetail,
      getBeneficiaryList,
      getBeneficiaryBanks,
      addBeneficiaryWallet,
    },
    dispatch
  );

const AddBeneficiaryForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AddBeneficiary));

export default AddBeneficiaryForm;
