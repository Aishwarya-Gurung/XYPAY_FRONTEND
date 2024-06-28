import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { compose, bindActionCreators } from 'redux';

import {
  isEmpty,
  isDateValid,
  isInputEmpty,
  validateName,
  getReduxState,
  validateAddress,
  setIsInvalidField,
  validatePostalCode,
  getPostalCodeLength,
  validateDateOfBirth,
  unsetIsInvalidField,
  validateNumber,
  getApiExceptionMsg,
} from 'utils';
import loadScript from 'utils/script-helper';

import sl from 'components/selector/selector';
import DOBSelector from 'components/form/dob-selector';

import {
  initiateKYC,
  fetchLicense,
  updateKYCInfo,
  updateSenderDetails,
} from 'api';
import { getSenderInfo } from 'auth';
import { getStates } from 'landing-page';
import { history, ROUTES, COUNTRY } from 'app';
import StateDisclaimerModel from './state-disclaimer';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const INPUT = {
  DAY: 'day',
  YEAR: 'year',
  MONTH: 'month',
  CITY: 'city',
  EMAIL: 'email',
  STATE: 'state',
  GENDER: 'gender',
  DOB: 'dateOfBirth',
  PASSWORD: 'password',
  LAST_NAME: 'lastName',
  POSTAL_CODE: 'zipcode',
  FIRST_NAME: 'firstName',
  MIDDLE_NAME: 'middleName',
  COUNTRY_CODE: 'countryCode',
  PHONE_NUMBER: 'phoneNumber',
  ADDRESS_LINE1: 'addressLine1',
  USER_AGREEMENT: 'userAgreement',
  REPEAT_PASSWORD: 'repeatPassword',
};

const ADDRESS_COMPONENT = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  postal_code: 'short_name',
  country: 'long_name',
  administrative_area_level_1: 'long_name',
};

const GENDER = Object.freeze({
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
});

class KYCForm extends PureComponent {
  state = {
    city: '',
    state: '',
    gender: '',
    license: {},
    address: {},
    zipcode: '',
    lastName: '',
    kycError: '',
    dayError: '',
    yearError: '',
    firstName: '',
    emailError: '',
    middleName: '',
    stateError: '',
    monthError: '',
    genderError: '',
    addressLine1: '',
    apiLoaded: false,
    ssn: '',
    showSSN: false,
    isValid: false,
    lastNameError: '',
    firstNameError: '',
    isModelOpen: false,
    isSubmitting: false,
    middleNameError: '',
    countryCodeError: '',
    dateOfBirthError: '',
    userAgreement: false,
    userAgreementError: '',
    isLastNameEditable: false,
    isFirstNameEditable: false,
    isMiddleNameEditable: false,
  };

  cityRef = React.createRef();
  zipcodeRef = React.createRef();
  autoCompleteRef = React.createRef();

  toggleSSNVisibility = () => {
    this.setState({ showSSN: !this.state.showSSN });
  };

  componentDidMount = async () => {
    const { getSenderInfo, user, getStates, states } = staticSelector.select(
      this.props
    );

    await this.fetchLicenseData(user.address.stateCode);

    const { apiLoaded } = this.state;

    await getSenderInfo();

    if (user) {
      const address = {};

      address.locality = user.senderAddress.city;
      address.postal_code = user.senderAddress.zipcode;
      address.administrative_area_level_1 = user.address.state;
      const state = user.address.stateCode;

      this.setState({ gender: user.gender, address, state });
    }

    if (!states.length) {
      getStates();
    }

    if (!apiLoaded) {
      loadScript(process.env.REACT_APP_GOOGLE_MAPS).then(() =>
        this.setState({ apiLoaded: true })
      );
    }
  };

  fetchLicenseData = async (stateCode) => {
    const { data, error } = await fetchLicense(stateCode);

    if (error) {
      return;
    }

    this.setState({ license: data });
  };

  componentDidUpdate = (prevProps) => {
    const { apiLoaded } = this.state;
    const { user } = this.props;

    if (apiLoaded) {
      this.initGMapAutoComplete('US');
    }

    if (user.address.stateCode !== prevProps.user.address.stateCode) {
      this.fetchLicenseData(user.address.stateCode);
    }
  };

  initGMapAutoComplete = (countryTwoCharCode) => {
    const restriction = { country: [countryTwoCharCode] };
    const autocomplete = new window.google.maps.places.Autocomplete(
      this.autoCompleteRef.current,
      {}
    );

    if (restriction !== null) {
      autocomplete.setComponentRestrictions(restriction);
    }

    autocomplete.addListener('place_changed', () =>
      this.handlePlaceSelect(autocomplete)
    );
  };

  handlePlaceSelect = (autocomplete) => {
    const { user } = staticSelector.select(this.props);

    const gAddress = autocomplete.getPlace().address_components;
    const address = {};

    for (let i = 0; i < gAddress.length; i++) {
      const addressType = gAddress[i].types[0];

      if (ADDRESS_COMPONENT[addressType]) {
        address[addressType] = gAddress[i][ADDRESS_COMPONENT[addressType]];
      }
    }

    this.autoCompleteRef.current.value = this.setAddressLine(address);
    unsetIsInvalidField(this.autoCompleteRef.current);

    this.setState({
      address,
      city: address?.locality,
      zipcode: address?.postal_code,
    });

    this.unsetIsInvalidField();

    if (address.administrative_area_level_1 !== user.address.state) {
      this.setErrorState(
        this.autoCompleteRef.current,
        i18n.t(
          'validation.The address you entered is not valid Please provide a valid address'
        )
      );
    }
  };

  unsetIsInvalidField = () => {
    const { city, zipcode } = this.state;
    const { cityRef, zipcodeRef } = this;

    if (!isEmpty(city)) {
      unsetIsInvalidField(cityRef.current);
    }

    if (!isEmpty(zipcode)) {
      unsetIsInvalidField(zipcodeRef.current);
    }
  };

  setAddressLine = (address) => {
    const streetNumber = address.street_number;
    const { route, locality } = address;

    if (streetNumber) {
      return route ? `${streetNumber}, ${route}` : streetNumber;
    }

    return route ? route : locality ? locality : '';
  };

  setErrorState = (
    input,
    errorMessage = i18n.t('validation.This field cannot be empty')
  ) => {
    if (errorMessage !== '') {
      setIsInvalidField(input);
    }

    const stateName = `${input.name}Error`;

    this.setState(() => {
      return { [stateName]: errorMessage };
    });

    return false;
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isSubmitting: true });

    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const senderDetails = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (this.handleValidation(input)) {
        senderDetails[input.name] = input.value.trim();
      } else if (input.name && !isInputFocused) {
        input.focus();
        isFormValid = false;
        isInputFocused = true;
        this.setState({ isSubmitting: false });
      }
    }

    if (isFormValid) {
      await this.submitSenderDetails(senderDetails);

      history.push(ROUTES.DASHBOARD);
    }
  };

  submitSenderDetails = async (senderDetails) => {
    const { user } = staticSelector.select(this.props);

    const userDetails = {
      ...senderDetails,
      email: user.email,
      phoneNumber: user.phoneNumber.replace('+1', ''),
    };

    const { error } = await updateSenderDetails(userDetails);

    if (error) {
      return this.setState({ isSubmitting: false, kycError: error });
    }

    await this.submitKYCDetails(userDetails);
  };

  submitKYCDetails = async (kycDetails) => {
    const { getSenderInfo, setIsBasicKYCSubmitted } = staticSelector.select(
      this.props
    );

    this.setState({ isSubmitting: true });

    const { error } = await updateKYCInfo(kycDetails);

    setIsBasicKYCSubmitted();

    await getSenderInfo();

    this.setState({ isSubmitting: false });
  };

  handleInitiateKYC = async () => {
    const { error } = await initiateKYC();

    if (error) {
      return this.setState({
        isSubmitting: false,
        kycError: getApiExceptionMsg(error.message),
      });
    }

    this.setState({ isSubmitting: false });
  };

  isAddressValid = () => {
    const { user } = staticSelector.select(this.props);

    return (
      this.state.address.administrative_area_level_1 === user.address.state
    );
  };

  handleValidation = (input) => {
    const inputName = input.name;
    const inputValue = input.value ? input.value.trim() : '';
    const { gender } = this.state;

    unsetIsInvalidField(input);

    if (
      inputName !== INPUT.DAY &&
      inputName !== INPUT.YEAR &&
      inputName !== INPUT.MONTH &&
      inputName !== INPUT.GENDER &&
      inputName !== INPUT.MIDDLE_NAME &&
      isInputEmpty(input)
    ) {
      return this.setErrorState(input);
    }

    if (
      (inputName === INPUT.FIRST_NAME || inputName === INPUT.LAST_NAME) &&
      !validateName(inputValue)
    ) {
      const message = i18n.t('validation.Please enter a valid name');

      return this.setErrorState(input, message);
    }

    if (
      inputName === INPUT.MIDDLE_NAME &&
      inputValue &&
      !validateName(inputValue)
    ) {
      const message = i18n.t('validation.Please enter a valid name');

      return this.setErrorState(input, message);
    }

    if (inputName === INPUT.GENDER) {
      if (gender) {
        this.setErrorState(input, '');
      } else {
        const message = i18n.t('validation.Please select a gender');

        return this.setErrorState(input, message);
      }
    }

    if (isEmpty(inputValue)) {
      if (inputName === INPUT.DAY) {
        return this.setErrorState(
          input,
          i18n.t('validation.Please select a day')
        );
      }

      if (inputName === INPUT.MONTH) {
        return this.setErrorState(
          input,
          i18n.t('validation.Please select a month')
        );
      }

      if (inputName === INPUT.YEAR) {
        this.setState({ dateOfBirthError: '' });

        return this.setErrorState(
          input,
          i18n.t('validation.Please select a year')
        );
      }
    }

    if (
      inputName === INPUT.DOB &&
      isDateValid(inputValue) &&
      !validateDateOfBirth(inputValue)
    ) {
      const message = i18n.t('validation.You must be 18 years or older');

      return this.setErrorState(input, message);
    }

    if (
      inputName === INPUT.ADDRESS_LINE1 &&
      (!validateAddress(inputValue) || !this.isAddressValid())
    ) {
      const message = i18n.t(
        'validation.The address you entered is not valid Please provide a valid address'
      );

      return this.setErrorState(input, message);
    }

    if (inputName === INPUT.CITY && !validateAddress(inputValue)) {
      const message = i18n.t('validation.Please enter a valid city');

      return this.setErrorState(input, message);
    }

    if (
      inputName === INPUT.POSTAL_CODE &&
      !validatePostalCode(inputValue, COUNTRY['USA'])
    ) {
      const message = i18n.t('validation.Please enter a valid postal code');

      return this.setErrorState(input, message);
    }

    if (inputName === INPUT.USER_AGREEMENT) {
      if (input.checked) {
        this.setErrorState(input, '');
      } else {
        const message = i18n.t(
          'validation.You need to agree to the user agreement and conditions'
        );

        return this.setErrorState(input, message);
      }
    }

    return true;
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    return this.setState({
      [name]: value,
    });
  };

  handleInputChange = (e) => {
    const value = e.target.value;

    const isNumeric = /^[0-9]*$/.test(value);

    const isSSNValid = isNumeric && value.length === 4;

    this.setState({ isValid: isSSNValid });

    if (isNumeric || value === '') {
      this.setState({ ssn: value });
    }
  };

  setUserAgreement = (e) => {
    const isChecked = e.target.checked;

    this.setState({
      userAgreement: isChecked,
    });
  };

  toggleModel = () => this.setState({ isModelOpen: !this.state.isModelOpen });

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  render() {
    const { t, user, states, kycStatus } = staticSelector.select(this.props);

    const {
      state,
      gender,
      license,
      address,
      kycError,
      dayError,
      yearError,
      cityError,
      monthError,
      stateError,
      genderError,
      isModelOpen,
      zipcodeError,
      isSubmitting,
      lastNameError,
      firstNameError,
      middleNameError,
      dateOfBirthError,
      addressLine1Error,
      isLastNameEditable,
      isFirstNameEditable,
      isMiddleNameEditable,
    } = this.state;

    // const country = COUNTRY['USA'];

    return (
      <>
        {kycStatus === 'UNVERIFIED' && (
          <div className="bg-white">
            {kycError && (
              <div className="col-md-12 p-0">
                <div className="alert alert-danger small pl-3">
                  <i className="icon ion-md-information-circle pl-1 mr-1"></i>
                  {kycError}
                </div>
              </div>
            )}

            <form
              autoComplete="off"
              onSubmit={this.handleFormSubmit}
              onBlur={(e) => this.handleValidation(e.target)}
            >
              <div className="alert alert-warning p-2 d-flex">
                <i className="icon ion-md-information-circle pl-1 mr-2"></i>
                <p className="m-0">
                  {t(
                    'form.Please ensure that you thoroughly review and verify all your details prior to submitting the form'
                  )}
                </p>
              </div>

              <section className="row">
                <div className="col-md-4 form-group position-relative">
                  <label className="w-100">
                    <span>{t('form.First Name')}</span>
                    <input
                      type="text"
                      name="firstName"
                      autoComplete="off"
                      className="form-control"
                      onChange={this.handleChange}
                      defaultValue={user.firstName}
                      readOnly={!isFirstNameEditable}
                      placeholder={t('form.First Name')}
                    />
                    <div className="invalid-feedback">{firstNameError}</div>
                  </label>
                  {!isFirstNameEditable && (
                    <div
                      onClick={() =>
                        this.setState({ isFirstNameEditable: true })
                      }
                      className="btn-edit bold text-dark position-absolute"
                    >
                      {t('button.EDIT')}
                    </div>
                  )}
                </div>

                <div className="col-md-4 form-group">
                  <label className="w-100">
                    <span>{t('form.Middle Name')}</span>
                    <input
                      type="text"
                      name="middleName"
                      autoComplete="off"
                      className="form-control"
                      onChange={this.handleChange}
                      defaultValue={user.middleName}
                      readOnly={!isMiddleNameEditable}
                      placeholder={t('form.Middle Name')}
                    />
                    <div className="invalid-feedback">{middleNameError}</div>
                  </label>
                  {!isMiddleNameEditable && (
                    <div
                      onClick={() =>
                        this.setState({ isMiddleNameEditable: true })
                      }
                      className="btn-edit bold text-dark position-absolute"
                    >
                      {t('button.EDIT')}
                    </div>
                  )}
                </div>

                <div className="col-md-4 form-group">
                  <label className="w-100">
                    <span>{t('form.Last Name')}</span>
                    <input
                      type="text"
                      name="lastName"
                      autoComplete="off"
                      className="form-control"
                      defaultValue={user.lastName}
                      onChange={this.handleChange}
                      readOnly={!isLastNameEditable}
                      placeholder={t('form.Last Name')}
                    />
                    <div className="invalid-feedback">{lastNameError}</div>
                  </label>
                  {!isLastNameEditable && (
                    <div
                      onClick={() =>
                        this.setState({ isLastNameEditable: true })
                      }
                      className="btn-edit bold text-dark position-absolute"
                    >
                      {t('button.EDIT')}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <span>{t('form.Gender')}</span>
                </div>
                <div className="col-md-4 col-sm-6 form-group">
                  <div
                    className="form-control d-flex align-items-center"
                    onClick={() => this.setState({ gender: GENDER.MALE })}
                  >
                    <input
                      type="radio"
                      className="mr-2"
                      id={GENDER.MALE}
                      name={INPUT.GENDER}
                      value={GENDER.MALE}
                      onChange={this.handleChange}
                      checked={gender === GENDER.MALE}
                    />
                    <label htmlFor={GENDER.MALE} className="radio-button">
                      {t('form.Male')}
                    </label>
                  </div>
                  <div
                    className={`invalid-feedback ${genderError && 'd-block'}`}
                  >
                    {genderError}
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 form-group">
                  <div
                    className="form-control d-flex align-items-center"
                    onClick={() => this.setState({ gender: GENDER.FEMALE })}
                  >
                    <input
                      type="radio"
                      className="mr-2"
                      id={GENDER.FEMALE}
                      name={INPUT.GENDER}
                      value={GENDER.FEMALE}
                      onChange={this.handleChange}
                      checked={gender === GENDER.FEMALE}
                    />
                    <label htmlFor={GENDER.FEMALE} className="radio-button">
                      {t('form.Female')}
                    </label>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 form-group">
                  <div
                    className="form-control d-flex align-items-center"
                    onClick={() => this.setState({ gender: GENDER.OTHER })}
                  >
                    <input
                      type="radio"
                      className="mr-2"
                      id={GENDER.OTHER}
                      name={INPUT.GENDER}
                      value={GENDER.OTHER}
                      onChange={this.handleChange}
                      checked={gender === GENDER.OTHER}
                    />
                    <label htmlFor={GENDER.OTHER} className="radio-button">
                      {t('form.Other')}
                    </label>
                  </div>
                </div>

                <input type="hidden" value={gender} name={INPUT.GENDER} />

                <div className="col-12 form-group">
                  <DOBSelector
                    defaultDOB={user.dateOfBirth}
                    dateOfBirthError={dateOfBirthError}
                    handleValidation={this.handleValidation}
                    dateOfBirthDayError={dayError}
                    dateOfBirthYearError={yearError}
                    dateOfBirthMonthError={monthError}
                  />
                </div>

                <div className="col-12 col-md-6 form-group">
                  <label className="w-100">
                    <span>{t('form.Address Line 1')}</span>
                    <input
                      max="255"
                      type="text"
                      autoComplete="off"
                      name="addressLine1"
                      className="form-control"
                      ref={this.autoCompleteRef}
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                      placeholder={t('form.Address Line 1')}
                      defaultValue={user.senderAddress.addressLine1}
                    />
                    <div className="invalid-feedback">{addressLine1Error}</div>
                  </label>
                </div>

                <div className="col-12 col-md-6 form-group">
                  <label className="w-100">
                    <span>{t('form.City')}</span>
                    <input
                      max="255"
                      type="text"
                      name="city"
                      ref={this.cityRef}
                      autoComplete="off"
                      onChange={this.handleChange}
                      className="form-control"
                      defaultValue={address.locality}
                      placeholder={t('form.City')}
                    />
                    <div className="invalid-feedback">{cityError}</div>
                  </label>
                </div>

                <div className="col-12 col-md-6 form-group">
                  <span>{t('form.State')}</span>
                  <select
                    disabled
                    name="state"
                    value={state}
                    className="custom-select"
                  >
                    <option value="">{t('form.Select State')}</option>

                    {states.map((state, index) => (
                      <option key={index} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{stateError}</div>
                </div>

                <div className="col-12 col-md-6 form-group">
                  <label className="w-100">
                    <span>{t('form.Postal Code')}</span>
                    <input
                      type="text"
                      name="zipcode"
                      defaultValue={address.postal_code}
                      autoComplete="off"
                      ref={this.zipcodeRef}
                      className="form-control"
                      onKeyPress={validateNumber}
                      onChange={this.handleChange}
                      placeholder={t('form.Postal Code')}
                      maxLength={getPostalCodeLength(COUNTRY['UNITED STATES'])}
                    />
                    <div className="invalid-feedback">{zipcodeError}</div>
                  </label>
                </div>

                {/* <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="ssn" className="mb-0">
                      SSN (Last 4 digits):
                    </label>
                    <div className="ssn-form">
                      <input
                        type={this.state.showSSN ? 'text' : 'password'}
                        id="ssn"
                        value={this.state.ssn}
                        className="form-control"
                        onChange={this.handleInputChange}
                        placeholder="Enter 4 digit SSN"
                        maxLength={4}
                      />
                      <button
                        type="button"
                        onClick={this.toggleSSNVisibility}
                        className="toggle-ssn"
                      >
                        {this.state.showSSN ? (
                          <i className="icon ion-md-eye mr-1" />
                        ) : (
                          <i className="icon ion-md-eye-off mr-1" />
                        )}
                      </button>
                    </div>

                    {!this.state.isValid && this.state.ssn && (
                      <div className="text-danger">
                        <p>Please enter last 4 digit of SSN</p>
                      </div>
                    )}
                  </div>
                </div>
              </div> */}

                {/* <div className="col-md-12 form-group">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    value={userAgreement}
                    id={INPUT.USER_AGREEMENT}
                    name={INPUT.USER_AGREEMENT}
                    className="custom-control-input"
                    onChange={this.setUserAgreement}
                  />
                  <label
                    htmlFor={INPUT.USER_AGREEMENT}
                    className="custom-control-label remit-agreement-text"
                  >
                    <Trans i18nKey="form.I agree to Golden Money Transfer">
                      I agree to Golden Money Transfer Inc.
                      <a
                        target="_blank"
                        className="text-info"
                        rel="noopener noreferrer nofollow"
                        href="https://XYPAYservices.com/golden-money-transfer/"
                      >
                        User Agreement
                      </a>
                      and
                      <a
                        target="_blank"
                        className="text-info"
                        rel="noopener noreferrer nofollow"
                        href="https://XYPAYservices.com/golden-money-transfer/"
                      >
                        Privacy Policy
                      </a>
                      .
                    </Trans>
                  </label>
                  <div className="invalid-feedback">{userAgreementError}</div>
                </div>
              </div> */}

                <div className="col-12 my-3">
                  <button
                    type="submit"
                    className="btn btn-lg btn-success text-white btn-block"
                  >
                    {isSubmitting && <WhiteSpinner />}
                    {t('button.Submit')}
                  </button>
                </div>

                {/* <div className="col-md-12 d-flex justify-content-between mt-3">
                <div
                  onClick={this.toggleModel}
                  className="text-blue cursor-pointer mr-3"
                >
                  {t('form.State Disclaimer and Complaint Filing')}
                </div>

                <div className="d-flex flex-column">
                  {t('form.Service provided by')}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Golden Money Transfer"
                    href="https://www.gmtnorthamerica.com/"
                  >
                    <img
                      width="100%"
                      className="disclaimer-logo"
                      alt="Golden Money Transfer"
                      src={require('assets/img/gmt.png')}
                    />
                  </a>
                </div>
                <div className="d-flex flex-column">
                  <span className="ml-4">{t('form.Powered by')}</span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.XYPAYinc.com/"
                    title="XYPAY Technologies Inc. California"
                  >
                    <img
                      className="disclaimer-logo"
                      src={require('assets/img/XYPAY.png')}
                      alt="XYPAY Technologies Payment Processing for Cross Border"
                    />
                  </a>
                </div>
              </div> */}
              </section>
            </form>
            {isModelOpen && (
              <StateDisclaimerModel
                license={license}
                isModelOpen={isModelOpen}
                closeModal={this.toggleModel}
              />
            )}
          </div>
        )}
      </>

      // <>
      //   {kycStatus === MACHPAY_WIDGET.KYC_RETRY ||
      //   kycStatus === MACHPAY_WIDGET.KYC_UNVERIFIED ? (
      //     <div className="bg-white">
      //       {kycError && (
      //         <div className="col-md-12 p-0">
      //           <div className="alert alert-danger small pl-3">
      //             <i className="icon ion-md-information-circle pl-1 mr-1"></i>
      //             {kycError}
      //           </div>
      //         </div>
      //       )}

      //       {this.state.formIsEditable ? (
      //         <form
      //           autoComplete="off"
      //           onSubmit={this.handleFormSubmit}
      //           onBlur={(e) => this.handleValidation(e.target)}
      //         >
      //           <div className="alert alert-warning p-2 d-flex">
      //             <i className="icon ion-md-information-circle pl-1 mr-2"></i>
      //             <div>
      //               <div>
      //                 {t('form.Please verify and confirm your Information')}
      //               </div>

      //               <div>
      //                 {t(
      //                   'form.Please enter the name as it appears in your US Government issued Photo ID'
      //                 )}
      //               </div>
      //             </div>
      //           </div>
      //           <section className="row">
      //             <div className="col-md-4 form-group">
      //               <label className="w-100">
      //                 <span>{t('auth.First Name')}</span>
      //                 <input
      //                   type="text"
      //                   name="firstName"
      //                   autoComplete="off"
      //                   defaultValue={user.firstName}
      //                   className="form-control"
      //                   placeholder={t('auth.First Name')}
      //                 />
      //                 <div className="invalid-feedback">
      //                   {this.state.firstNameError}
      //                 </div>
      //               </label>
      //             </div>
      //             <div className="col-md-4 form-group">
      //               <label className="w-100">
      //                 <span>{t('auth.Middle Name')}</span>
      //                 <input
      //                   type="text"
      //                   name="middleName"
      //                   autoComplete="off"
      //                   defaultValue={user.middleName}
      //                   className="form-control"
      //                   placeholder={t('auth.Middle Name')}
      //                 />
      //                 <div className="invalid-feedback">
      //                   {this.state.middleNameError}
      //                 </div>
      //               </label>
      //             </div>
      //             <div className="col-md-4 form-group">
      //               <label className="w-100">
      //                 <span>{t('auth.Last Name')}</span>
      //                 <input
      //                   type="text"
      //                   name="lastName"
      //                   defaultValue={user.lastName}
      //                   autoComplete="off"
      //                   className="form-control"
      //                   placeholder={t('auth.Last Name')}
      //                 />
      //                 <div className="invalid-feedback">
      //                   {this.state.lastNameError}
      //                 </div>
      //               </label>
      //             </div>

      //             <div className="col-12">
      //               <span>{t('auth.Gender')}</span>
      //             </div>
      //             <div className="col-md-4 form-group">
      //               <div
      //                 className="form-control"
      //                 onClick={() => this.setState({ gender: GENDER.MALE })}
      //               >
      //                 <input
      //                   type="radio"
      //                   className="mr-2"
      //                   name={INPUT.GENDER}
      //                   id={GENDER.MALE}
      //                   value={GENDER.MALE}
      //                   checked={this.state.gender === GENDER.MALE}
      //                   onChange={this.setGender}
      //                 />
      //                 <label htmlFor={GENDER.MALE} className="mb-0">
      //                   {t('auth.Male')}
      //                 </label>
      //               </div>
      //               <div
      //                 className={`invalid-feedback ${genderError && 'd-block'}`}
      //               >
      //                 {genderError}
      //               </div>
      //             </div>
      //             <div className="col-md-4 form-group">
      //               <div
      //                 className="form-control"
      //                 onClick={() => this.setState({ gender: GENDER.FEMALE })}
      //               >
      //                 <input
      //                   type="radio"
      //                   className="mr-2"
      //                   name={INPUT.GENDER}
      //                   id={GENDER.FEMALE}
      //                   value={GENDER.FEMALE}
      //                   checked={this.state.gender === GENDER.FEMALE}
      //                   onChange={this.setGender}
      //                 />
      //                 <label htmlFor={GENDER.FEMALE} className="mb-0">
      //                   {t('auth.Female')}
      //                 </label>
      //               </div>
      //             </div>
      //             <div className="col-md-4 form-group">
      //               <div
      //                 className="form-control"
      //                 onClick={() => this.setState({ gender: GENDER.OTHER })}
      //               >
      //                 <input
      //                   type="radio"
      //                   className="mr-2"
      //                   name={INPUT.GENDER}
      //                   id={GENDER.OTHER}
      //                   value={GENDER.OTHER}
      //                   checked={this.state.gender === GENDER.OTHER}
      //                   onChange={this.setGender}
      //                 />
      //                 <label htmlFor={GENDER.OTHER} className="mb-0">
      //                   {t('auth.Other')}
      //                 </label>
      //               </div>
      //             </div>

      //             <div className="col-md-12 form-group">
      //               <DOBSelector
      //                 defaultDOB={user.dateOfBirth}
      //                 dateOfBirthError={dateOfBirthError}
      //                 handleValidation={this.handleValidation}
      //                 dateOfBirthDayError={dayError}
      //                 dateOfBirthYearError={yearError}
      //                 dateOfBirthMonthError={monthError}
      //               />
      //               <div className="invalid-feedback">{dateOfBirthError}</div>
      //             </div>

      //             <div className="col-12 form-group">
      //               <label className="w-100">
      //                 <span>{t('auth.Address Line 1')}</span>
      //                 <input
      //                   ref={this.autoCompleteRef}
      //                   max="255"
      //                   type="text"
      //                   autoComplete="off"
      //                   name="addressLine1"
      //                   className="form-control"
      //                   placeholder={t('auth.Address Line 1')}
      //                   defaultValue={user.senderAddress.addressLine1}
      //                 />
      //                 <div className="invalid-feedback">
      //                   {this.state.addressLine1Error}
      //                 </div>
      //               </label>
      //             </div>

      //             <div className="col-12 form-group">
      //               <span>{t('auth.State')}</span>
      //               <select
      //                 className="custom-select"
      //                 name="state"
      //                 value={this.state.state}
      //                 onChange={this.handleStateChange}
      //               >
      //                 <option value="">Select State</option>

      //                 {states.map((state, index) => (
      //                   <option key={index} value={state.code}>
      //                     {state.name}
      //                   </option>
      //                 ))}
      //               </select>
      //               <div className="invalid-feedback">
      //                 {this.state.stateError}
      //               </div>
      //             </div>

      //             <div className="col-6 form-group">
      //               <label className="w-100">
      //                 <span>{t('auth.City')}</span>
      //                 <input
      //                   max="255"
      //                   type="text"
      //                   name="city"
      //                   autoComplete="off"
      //                   className="form-control"
      //                   placeholder={t('auth.City')}
      //                   value={address.locality}
      //                   onChange={this.setCity}
      //                 />
      //                 <div className="invalid-feedback">
      //                   {this.state.cityError}
      //                 </div>
      //               </label>
      //             </div>

      //             <div className="col-6 form-group">
      //               <label className="w-100">
      //                 <span>{t('auth.Postal Code')}</span>
      //                 <input
      //                   max="255"
      //                   type="text"
      //                   name="zipcode"
      //                   autoComplete="off"
      //                   className="form-control"
      //                   placeholder={t('auth.Postal Code')}
      //                   maxLength={getPostalCodeLength(
      //                     COUNTRY['UNITED STATES']
      //                   )}
      //                   value={address.postal_code}
      //                   onChange={this.setPostalCode}
      //                 />
      //                 <div className="invalid-feedback">
      //                   {this.state.zipcodeError}
      //                 </div>
      //               </label>
      //             </div>
      //             <div className="col-12 form-group">
      //               <label className="w-100">
      //                 <span>{t('auth.Email address')}</span>
      //                 <input
      //                   disabled
      //                   name="email"
      //                   type="email"
      //                   autoComplete="off"
      //                   className="form-control"
      //                   defaultValue={user.email}
      //                   placeholder={t('auth.Email address')}
      //                 />
      //                 <div className="invalid-feedback">
      //                   {this.state.emailError}
      //                 </div>
      //               </label>
      //             </div>

      //             <div className="col-12">
      //               <span>{t('auth.Phone number')}</span>
      //             </div>
      //             <div className="col-3 form-group">
      //               <select
      //                 disabled
      //                 className="custom-select"
      //                 name="countryCode"
      //               >
      //                 <option>+1</option>
      //               </select>
      //               <div className="invalid-feedback">
      //                 {this.state.countryCodeError}
      //               </div>
      //             </div>
      //             <div className="col-9 form-group">
      //               <input
      //                 disabled
      //                 type="text"
      //                 name="phoneNumber"
      //                 autoComplete="off"
      //                 defaultValue={user.phoneNumber.replace('+1', '')}
      //                 className="form-control"
      //                 placeholder={t('auth.Enter your phone number')}
      //                 maxLength={phoneValidator().getMaxLength(country)}
      //               />
      //               <div className="invalid-feedback">
      //                 {this.state.phoneNumberError}
      //               </div>
      //             </div>

      //             <input
      //               type="hidden"
      //               value={this.state.gender}
      //               name={INPUT.GENDER}
      //             />

      //             <div className="col-12 my-3">
      //               <button
      //                 type="submit"
      //                 className="btn btn-lg btn-success text-white btn-block"
      //                 disabled={isSubmitting}
      //               >
      //                 {isSubmitting && <WhiteSpinner />}
      //                 {t('button.Update')}
      //               </button>
      //             </div>
      //           </section>
      //         </form>
      //       ) : (
      //         <>
      //           <div className="alert alert-info p-2 d-flex align-items-center">
      //             <span className="bonus-icon">
      //               <i className="icon ion-md-thumbs-up" />
      //             </span>
      //             <p className="m-0 medium-text">
      //               <strong>{t('form.Good News!')}</strong>{' '}
      //               {t(
      //                 'sender.You have to do this only once We will remember your details next time'
      //               )}
      //             </p>
      //           </div>
      //           <div className="alert alert-warning p-2 d-flex">
      //             <i className="icon ion-md-information-circle pl-1 mr-2"></i>
      //             <p className="m-0">
      //               {t(
      //                 'form.Please verify and confirm your Information Incase your information is incorrect please update by clicking on edit button'
      //               )}
      //             </p>
      //           </div>

      //           <section className="row uneditable-form">
      //             <button
      //               className="small btn btn-sm btn-outline-green edit-kyc"
      //               onClick={() =>
      //                 this.setState({ formIsEditable: true, kycError: '' })
      //               }
      //             >
      //               {t('button.Edit')}
      //             </button>

      //             <div className="col-md-12">
      //               <span className="small text-muted">
      //                 {t('auth.Full Name')}:
      //               </span>
      //               <p className="bold">{user.fullName}</p>
      //             </div>

      //             <div className="col-md-6">
      //               <span className="small text-muted">
      //                 {t('auth.Date of Birth')}:
      //               </span>
      //               <p className="bold">
      //                 {user.dateOfBirth ? user.dateOfBirth : 'none'}
      //               </p>
      //             </div>

      //             <div className="col-md-6">
      //               <span className="small text-muted">
      //                 {t('auth.Gender')}:
      //               </span>
      //               <p className="bold">
      //                 {user.gender
      //                   ? capitalizeFirstLetter(user.gender)
      //                   : 'none'}
      //               </p>
      //             </div>

      //             <div className="col-md-6">
      //               <span className="small text-muted">
      //                 {t('auth.Phone number')}:
      //               </span>
      //               <p className="bold">{user.phoneNumber}</p>
      //             </div>

      //             <div className="col-md-6">
      //               <span className="small text-muted">{t('auth.Email')}:</span>
      //               <p className="bold">{user.email}</p>
      //             </div>

      //             <div className="col-md-12">
      //               <span className="small text-muted">
      //                 {t('auth.Address')}:
      //               </span>
      //               <p className="bold">
      //                 {user.senderAddress.addressLine1 &&
      //                   `${user.senderAddress.addressLine1}, `}
      //                 {user.address.state}, {user.address.country}
      //               </p>
      //             </div>

      //             <div className="col-md-12">
      //               <div className="custom-control custom-checkbox remit-agreement">
      //                 <input
      //                   type="checkbox"
      //                   className="custom-control-input"
      //                   id={INPUT.USER_AGREEMENT}
      //                   name={INPUT.USER_AGREEMENT}
      //                   onClick={this.agreeUserAgreement}
      //                 />
      //                 <label
      //                   className="custom-control-label user-agreement-label"
      //                   htmlFor={INPUT.USER_AGREEMENT}
      //                 >
      //                   <div className="pl-3 remit-agreement-text">
      //                     <Trans i18nKey="form.I agree to Golden Money Transfer">
      //                       I agree to Golden Money Transfer Inc.
      //                       <a
      //                         rel="noopener noreferrer nofollow"
      //                         target="_blank"
      //                         className="mx-1 text-info"
      //                         href="https://XYPAYservices.com/golden-money-transfer/"
      //                       >
      //                         User Agreement
      //                       </a>
      //                       and{' '}
      //                       <a
      //                         rel="noopener noreferrer nofollow"
      //                         target="_blank"
      //                         className="mx-1 text-info"
      //                         href="https://XYPAYservices.com/golden-money-transfer/"
      //                       >
      //                         Privacy Policy
      //                       </a>
      //                       .
      //                     </Trans>

      //                     <div
      //                       className={`invalid-feedback h6 ${
      //                         this.state.userAgreementError && 'd-block'
      //                       }`}
      //                     >
      //                       {this.state.userAgreementError}
      //                     </div>
      //                   </div>
      //                 </label>
      //               </div>
      //             </div>

      //             <div
      //               className={`col-md-12 mb-3 ${
      //                 this.state.userAgreementError && 'my-3'
      //               }`}
      //             >
      //               <button
      //                 className="btn btn-lg btn-success btn-block"
      //                 disabled={isSubmitting || !this.state.userAgreement}
      //                 onClick={this.submitKYCDetails}
      //               >
      //                 {isSubmitting && <WhiteSpinner />}
      //                 {t('button.Verify')}
      //               </button>
      //             </div>

      //             <div className="col-md-12 d-flex justify-content-between  mt-3">
      //               <div
      //                 className="text-blue cursor-pointer"
      //                 onClick={this.openModal}
      //               >
      //                 {t('form.State Disclaimer and Complaint Filing')}
      //               </div>

      //               <div className="d-flex">
      //                 <p className="d-flex flex-column">
      //                   {t('form.Service provided by')}
      //                   <a
      //                     target="_blank"
      //                     rel="noopener noreferrer"
      //                     href="https://www.gmtnorthamerica.com/"
      //                     title="Golden Money Transfer"
      //                   >
      //                     <img
      //                       className="disclaimer-logo"
      //                       src={require('../../assets/img/gmt.png')}
      //                       alt="Golden Money Transfer"
      //                       width="80%"
      //                     />
      //                   </a>
      //                 </p>
      //                 <p className="d-flex flex-column ml-3">
      //                   <span className="ml-4"> {t('form.Powered by')}</span>

      //                   <a
      //                     target="_blank"
      //                     rel="noopener noreferrer"
      //                     href="https://www.XYPAYinc.com/"
      //                     title="XYPAY Technologies Inc. California"
      //                   >
      //                     <img
      //                       className="disclaimer-logo"
      //                       src={require('../../assets/img/XYPAY.png')}
      //                       alt="XYPAY Technologies Payment Processing for Cross Border"
      //                       width="100%"
      //                     />
      //                   </a>
      //                 </p>
      //               </div>
      //             </div>
      //           </section>
      //           {this.state.isModelOpen && (
      //             <StateDisclaimerModel
      //               license={license}
      //               closeModal={this.closeModal}
      //               isModelOpen={this.state.isModelOpen}
      //             />
      //           )}
      //         </>
      //       )}
      //     </div>
      //   ) : kycStatus === MACHPAY_WIDGET.KYC_SUSPENDED ? (
      //     <div className="alert alert-danger p p-2 d-flex">
      //       <i className="icon ion-md-information-circle pl-1 mr-1"></i>
      //       {t('validation.Your Account is Suspended')}
      //     </div>
      //   ) : (
      //     <div className="alert alert-info p p-2 d-flex">
      //       <i className="icon ion-md-information-circle pl-1 mr-1"></i>
      //       {t('validation.Your account verification is under progress')}
      //     </div>
      //   )}
      // </>
    );
  }
}

KYCForm.propTypes = {
  user: PropTypes.object,
  states: PropTypes.array,
  getStates: PropTypes.func,
  kycStatus: PropTypes.string,
  userAgreement: PropTypes.bool,
  setIsBasicKYCSubmitted: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  user: sl.object({
    id: sl.number(),
    referenceId: sl.string(null),
    firstName: sl.string(null),
    middleName: sl.string(null),
    lastName: sl.string(null),
    fullName: sl.string(null),
    email: sl.string(null),
    phoneNumber: sl.string(null),
    imageUrl: sl.string(null),
    roles: sl.list(sl.string('')),
    address: sl.object({
      country: sl.string(null),
      state: sl.string(null),
      stateCode: sl.string(null),
    }),
    dateOfBirth: sl.string(null),
    gender: sl.string(null),
    senderAddress: sl.object({
      addressLine1: sl.string(null),
      city: sl.string(null),
      zipcode: sl.string(null),
    }),
  }),

  kycStatus: sl.string(''),

  states: sl.list(
    sl.object({
      name: sl.string(''),
      code: sl.string(''),
    })
  ),
  getStates: sl.func(),

  getSenderInfo: sl.func(),
  setIsBasicKYCSubmitted: sl.func(),
});

const mapStateToProps = (state) => {
  return {
    user: getReduxState(['auth', 'user'], state),
    states: getReduxState(['home', 'states'], state),
    kycStatus: getReduxState(['auth', 'kycStatus'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getSenderInfo,
      getStates,
    },
    dispatch
  );

export default compose(
  withTranslation()(connect(mapStateToProps, mapDispatchToProps)(KYCForm))
);
