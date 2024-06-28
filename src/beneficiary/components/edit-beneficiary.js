import i18n from 'i18next';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { withTranslation, useTranslation } from 'react-i18next';
import React, { Fragment, Component, createRef, useEffect } from 'react';

import sl from 'components/selector/selector';
import { SuccessMessage } from 'components/form/toast-message-container';

import {
  resetError,
  getBeneficiaryList,
  updateBeneficiaryDetail,
} from 'beneficiary';
import { districts } from 'beneficiary/beneficiary.address';

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
  validateDateOfBirth,
  validateCountryCode,
  unsetIsInvalidField,
} from 'utils';
import { COUNTRY, RELATIONSHIP } from 'app';
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
  DAY: 'day',
  YEAR: 'year',
  MONTH: 'month',
  CITY: 'city',
  STATE: 'state',
  EMAIL: 'email',
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

class EditBeneficiary extends Component {
  state = {
    dayError: null,
    yearError: null,
    cityError: null,
    monthError: null,
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

    beneficiaryAddress: {
      street_number: '',
      route: '',
      locality: '',
      postal_code: '',
      state: '',
      country: '',
    },

    country: {},
  };

  componentDidMount = async () => {
    const { beneficiary } = staticSelector.select(this.props);

    await this.updateCountry(beneficiary.address.country);
    this.initGMapAutoComplete(this.state.country);
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

    this.setState(() => ({
      beneficiaryAddress: {
        ...this.state.beneficiaryAddress,
        ...address,
      },
    }));
  }

  updateCountry = (countryCode) => {
    const { destinationCountries } = staticSelector.select(this.props);

    const selectedCountry =
      destinationCountries.find(
        (country) => country.threeCharCode === countryCode
      ) || {};

    this.setState(() => ({
      country: selectedCountry,
    }));
  };

  updateAddress = (e, fieldName) => {
    const beneficiaryAddress = {
      ...this.state.beneficiaryAddress,
      [fieldName]: e.target.value,
    };

    this.setState(() => ({ beneficiaryAddress }));
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

  handleValidation = (input) => {
    const inputName = input.name,
      inputValue = input.value ? input.value.trim() : '';
    const { country } = this.state;

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
      !validatePostalCode(inputValue, country.threeCharCode)
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
      !validateCountryCode(country, inputValue)
    ) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter a country code')
      );
    }

    if (
      inputName === INPUT.PHONE_NUMBER &&
      !phoneValidator().validate(inputValue, country.threeCharCode)
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
    const beneficiaryDetail = {};
    const { t, beneficiary, getBeneficiaryList, updateBeneficiaryDetail } =
      staticSelector.select(this.props);

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (this.handleValidation(input)) {
        if (
          input.name !== INPUT.YEAR &&
          input.name !== INPUT.MONTH &&
          input.name !== INPUT.DAY
        ) {
          beneficiaryDetail[input.name] = input.value ? input.value.trim() : '';
        }
      } else if (input.name && !isInputFocused) {
        input.focus();
        isFormValid = false;
        isInputFocused = true;
      }
    }

    if (isFormValid) {
      const isUpdated = await updateBeneficiaryDetail(
        beneficiary.referenceId,
        beneficiaryDetail
      );

      if (isUpdated) {
        toast.success(
          <SuccessMessage
            message={t('beneficiary.Beneficiary has been successfully updated')}
          />
        );
        await getBeneficiaryList();
      }
    }
  };

  render() {
    const {
      t,
      error,
      beneficiary,
      destinationCountries,
      isUpdatingBeneficiary,
    } = staticSelector.select(this.props);

    this.autoCompleteRef = createRef();
    const { country, beneficiaryAddress } = this.state;

    return (
      <Fragment>
        <fieldset disabled={isUpdatingBeneficiary}>
          <form
            onSubmit={(e) => this.handleAddBeneficiary(e)}
            onBlur={(e) => this.handleValidation(e.target)}
          >
            <h4 className="text-primary bold mb-3">
              <i className="icon ion-md-contacts" />{' '}
              {t('beneficiary.Update Beneficiary')}
            </h4>

            {error && (
              <span className="text-danger small alert-danger d-flex">
                <i className="icon ion-md-remove-circle text-danger mr-2" />{' '}
                {error}
              </span>
            )}

            <div className="row">
              <label className="form-group col-md-4">
                <span>{t('beneficiary.First Name')}</span>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  defaultValue={beneficiary.firstName}
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
                  className="form-control"
                  defaultValue={beneficiary.middleName}
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
                  className="form-control"
                  defaultValue={beneficiary.lastName}
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
                  name="addressLine1"
                  className="form-control"
                  ref={this.autoCompleteRef}
                  placeholder={t('beneficiary.Address Line')}
                  defaultValue={beneficiary.address.addressLine1}
                />
                <div className="invalid-feedback">
                  {this.state.addressLine1Error}
                </div>
              </label>

              <label className="form-group col-md-6">
                <span>{t('beneficiary.Country')}</span>
                <select
                  disabled
                  name="country"
                  className="custom-select"
                  defaultValue={beneficiary.address.country}
                  onChange={(e) => this.updateCountry(e.target.value)}
                  value={
                    COUNTRY[beneficiaryAddress.country.toLocaleUpperCase()]
                  }
                >
                  <React.Fragment>
                    <option value="">{t('beneficiary.Select Country')}</option>
                    {destinationCountries.map((country, key) => (
                      <option key={key} value={country.threeCharCode}>
                        {country.name}
                      </option>
                    ))}
                  </React.Fragment>
                </select>
                <div className="invalid-feedback">
                  {this.state.countryError}
                </div>
              </label>

              {COUNTRY.GUINEA === beneficiary.address.country ? (
                <label className="form-group col-md-6">
                  <span>{t('beneficiary.Region')}</span>
                  <input
                    autoComplete="off"
                    name={INPUT.STATE}
                    className="form-control"
                    onKeyPress={validateAlphabet}
                    placeholder={t('beneficiary.Region')}
                    defaultValue={beneficiary.address.state}
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
                    className="custom-select"
                    defaultValue={beneficiary.address.state || ''}
                    onChange={(e) => this.updateAddress(e, FIELD.AREA_LEVEL)}
                  >
                    <React.Fragment>
                      <option value="" disabled>
                        {t('beneficiary.Select District')}
                      </option>
                      {districts.map((state, key) => (
                        <option key={key} value={state.name}>
                          {state.name}
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
                  className="form-control"
                  placeholder={t('beneficiary.City')}
                  defaultValue={beneficiary.address.city}
                />
                <div className="invalid-feedback">{this.state.cityError}</div>
              </label>

              {/* <label className="form-group col-12 mb-0">
                <span>{t('beneficiary.Date of Birth')}</span>
              </label>

              <DateSelector
                inputName={INPUT.DOB}
                dayError={this.state.dayError}
                yearError={this.state.yearError}
                monthError={this.state.monthError}
                defaultValue={beneficiary.dateOfBirth}
                dateError={this.state.dateOfBirthError}
                handleValidation={this.handleValidation}
              /> */}

              <label className="form-group col-6">
                <span>{t('beneficiary.Relationship')}</span>
                <select
                  className="custom-select"
                  name="senderRelationship"
                  defaultValue={beneficiary.senderRelationship}
                >
                  <option value="">
                    {t('beneficiary.Select Relationship')}
                  </option>
                  {RELATIONSHIP.map((relation, key) => (
                    <option key={key} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {this.state.senderRelationshipError}
                </div>
              </label>
            </div>
            <p className="m-0">{t('beneficiary.Phone number')}</p>

            <div className="row">
              <div className="col-md-3">
                <select name="countryCode" className="custom-select">
                  <option value={country.phoneCode}>{country.phoneCode}</option>
                </select>
                <div className="invalid-feedback">
                  {this.state.countryCodeError}
                </div>
              </div>
              <div className="col-md-9">
                <label className="form-group d-block">
                  <input
                    type="text"
                    name="phoneNumber"
                    onKeyDown={validateNumber}
                    className="form-control"
                    defaultValue={beneficiary.phoneNumber}
                    placeholder={t(
                      "beneficiary.Enter Beneficiary's phone number"
                    )}
                    maxLength={phoneValidator().getMaxLength(
                      country.threeCharCode
                    )}
                  />
                  <div className="invalid-feedback">
                    {this.state.phoneNumberError}
                  </div>
                </label>
              </div>
            </div>

            {/* <label className="form-group col-12 p-0">
              <span>{t('beneficiary.Email')}</span>

              <input
                type="email"
                name="email"
                className="form-control"
                defaultValue={beneficiary.email}
                placeholder={t('beneficiary.Email')}
              />
              <div className="invalid-feedback">{this.state.emailError}</div>
            </label> */}

            <button className="btn btn-lg btn-primary my-4">
              {isUpdatingBeneficiary && <WhiteSpinner />}
              {t('button.Save Info')}
            </button>
          </form>
        </fieldset>
      </Fragment>
    );
  }
}

EditBeneficiary.propTypes = {
  t: PropTypes.func,
  error: PropTypes.string,
  getBeneficiaryList: PropTypes.func,
  isUpdatingBeneficiary: PropTypes.bool,
  updateBeneficiaryDetail: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  error: sl.string(''),
  updateBeneficiaryDetail: sl.func(),
  isUpdatingBeneficiary: sl.boolean(false),

  destinationCountries: sl.list(
    sl.object({
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
    })
  ),

  getBeneficiaryList: sl.func(),

  // Selector below are used in EditBeneficiaryModal
  closeModal: sl.func(),
  isModalOpen: sl.boolean(false),
  beneficiary: sl.object({
    firstName: sl.string(''),
    middleName: sl.string(''),
    lastName: sl.string(''),
    email: sl.string(''),
    fullName: sl.string(''),
    referenceId: sl.string(''),
    phoneNumber: sl.string(''),
    dateOfBirth: sl.string(''),
    isEditable: sl.boolean(false),
    isDeletable: sl.boolean(false),
    senderRelationship: sl.string(''),
    address: sl.object({
      addressLine1: sl.string(''),
      city: sl.string(''),
      country: sl.string(''),
      postalCode: sl.string(''),
      state: sl.string(''),
    }),
  }),
});

const mapStateToProps = (state) => {
  return {
    isUpdatingBeneficiary: getReduxState(
      ['beneficiary', 'isUpdatingBeneficiary'],
      state
    ),
    error: getReduxState(['beneficiary', 'error'], state),
    destinationCountries: getReduxState(
      ['home', 'destinationCountries'],
      state
    ),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getBeneficiaryList,
      updateBeneficiaryDetail,
    },
    dispatch
  );

const EditBeneficiaryForm = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(EditBeneficiary)
);

const EditBeneficiaryModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { closeModal, beneficiary, isModalOpen } = staticSelector.select(props);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <Modal
      isOpen={isModalOpen}
      className="modal-dialog modal-md"
      overlayClassName="modal-open"
    >
      <div className="modal-dialog modal-md" role="document">
        <button type="button" className="close text-white" onClick={closeModal}>
          <span aria-hidden="true">&times;</span>
        </button>
        <h1 className="h2 text-white py-4 text-center">
          {t('beneficiary.Update Beneficiary')}
        </h1>

        <div className="modal-content p-3">
          <div className="col-md-12">
            <EditBeneficiaryForm
              closeModal={closeModal}
              beneficiary={beneficiary}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

EditBeneficiary.propTypes = {
  closeModal: PropTypes.func,
  isModalOpen: PropTypes.bool,
  beneficiary: PropTypes.object,
};

export default EditBeneficiaryModal;
