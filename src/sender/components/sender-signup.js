import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import { PASSWORD_RULE } from 'sender/sender.constant';
import { signupSender, getDeviceFingerPrint } from 'sender';
import PasswordValidationInfo from 'sender/components/password-validation-info';

import {
  securedLS,
  isInputEmpty,
  validateName,
  getReduxState,
  phoneValidator,
  validatePassword,
  setIsInvalidField,
  unsetIsInvalidField,
  getInvalidPasswordRule,
} from 'utils';
import { LS_KEY } from 'auth';
import sl from 'components/selector/selector';
import { COUNTRY, ROUTES, history } from 'app';
import { getStates } from 'landing-page';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const INPUT = {
  STATE: 'state',
  PASSWORD: 'password',
  LAST_NAME: 'lastName',
  FIRST_NAME: 'firstName',
  MIDDLE_NAME: 'middleName',
  REPEAT_PASSWORD: 'repeatPassword',
};

let validInputs = [];

const passwordInputs = [
  INPUT.PASSWORD,
  INPUT.REPEAT_PASSWORD,
  INPUT.REMIT_AGREEMENT,
];

class SignUp extends PureComponent {
  state = {
    passwordInvalidRule: [
      PASSWORD_RULE.NUMBER,
      PASSWORD_RULE.MIN_CHAR,
      PASSWORD_RULE.LOWER_CASE,
      PASSWORD_RULE.UPPER_CASE,
      PASSWORD_RULE.SPECIAL_CHAR,
    ],
    state: '',
    password: '',
    senderData: {},
    stateError: null,
    fingerPrint: null,
    recaptchaToken: '',
    passwordError: null,
    lastNameError: null,
    firstNameError: null,
    middleNameError: null,
    repeatPasswordError: null,
  };

  // typeRef = React.createRef();
  // autoCompleteRef = React.createRef();
  // stateRef = React.createRef();
  // cityRef = React.createRef();
  // zipcodeRef = React.createRef();

  componentDidMount = async () => {
    const { getStates, states } = staticSelector.select(this.props);

    const fingerPrint = await getDeviceFingerPrint();

    this.setStateValue('fingerPrint', fingerPrint);

    const senderData = securedLS.get(LS_KEY.SIGN_UP_DATA).data;

    securedLS.clear(LS_KEY.VERIFIED_EMAIL_ADDRESS);
    securedLS.clear(LS_KEY.VERIFIED_PHONE_NUMBER);

    if (senderData) {
      // Note: Remove passwordInputs from validInputs when redirected from verification page
      validInputs = validInputs.filter(
        (input) => !passwordInputs.includes(input)
      );

      // this.calculateSignUpProgress();
      const state = senderData.state;

      this.setState({
        state,
        senderData,
      });
    } else {
      validInputs = [];
    }

    if (!states.length) {
      getStates();
    }
  };

  setErrorState = (
    input,
    errorMessage = i18n.t('validation.This field cannot be empty')
  ) => {
    setIsInvalidField(input);
    const stateName = `${input.name}Error`;

    this.setState(() => {
      return { [stateName]: errorMessage };
    });

    return false;
  };

  setStateValue = (name, value) => {
    this.setState((state) => {
      return (state[name] = value);
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const senderDetails = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];
      if (this.handleValidation(input)) {
        if (input.name !== INPUT.REMIT_AGREEMENT) {
          senderDetails[input.name] = input.value ? input.value.trim() : '';
        }
      } else if (input.name && !isInputFocused) {
        input.focus();
        isFormValid = false;
        isInputFocused = true;
      }
    }

    senderDetails.device = this.state.fingerPrint;

    if (isFormValid) {
      securedLS.set(LS_KEY.SIGN_UP_DATA, senderDetails);

      return history.push(ROUTES.SENDER_VERIFICATION);
    }
  };

  handleValidation = (input) => {
    const inputName = input.name;
    const inputValue = input.value ? input.value.trim() : '';

    unsetIsInvalidField(input);
    if (inputName !== INPUT.MIDDLE_NAME && isInputEmpty(input)) {
      return this.setErrorState(input);
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

    if (inputName === INPUT.STATE) {
      // state validation
    }

    if (inputName === INPUT.COUNTRY_CODE) {
      // state validation
    }

    if (
      inputName === INPUT.PHONE_NUMBER &&
      !phoneValidator().validate(inputValue, COUNTRY.USA)
    ) {
      return this.setErrorState(
        input,
        i18n.t('validation.Please enter valid phone number')
      );
    }

    if (inputName === INPUT.PASSWORD && !validatePassword(inputValue)) {
      return this.setErrorState(
        input,
        i18n.t('validation.Your password does not match the criteria')
      );
    } else {
      this.setStateValue(inputName, inputValue);
    }

    if (
      inputName === INPUT.REPEAT_PASSWORD &&
      inputValue !== this.state.password
    ) {
      return this.setErrorState(
        input,
        i18n.t('validation.Password does not match')
      );
    }

    if (inputName === INPUT.REMIT_AGREEMENT) {
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

  validatePasswordRequirement = (e) => {
    e.preventDefault();
    const inputValue = e.target.value;

    this.setState(() => {
      return { passwordInvalidRule: getInvalidPasswordRule(inputValue) };
    });
  };

  setUserState(e) {
    this.setState({ state: e.target.value });
  }

  agreeUserAgreement = (e) => {
    const checked = e.target.checked;

    this.setErrorState(e.target, '');

    validInputs = validInputs.filter(
      (input) => input !== INPUT.REMIT_AGREEMENT
    );

    if (!checked) {
      const message = i18n.t(
        'validation.You need to agree to the user agreement and conditions'
      );

      this.setErrorState(e.target, message);
    }
  };

  render() {
    const { t, error, states, isSigningUp, isLoggingIn } =
      staticSelector.select(this.props);
    const { state, senderData, passwordInvalidRule } = this.state;

    return (
      <React.Fragment>
        {error && (
          <span className="text-danger small alert-danger">
            <i className="icon ion-md-remove-circle text-danger" /> {error}
          </span>
        )}
        <fieldset disabled={isSigningUp || isLoggingIn}>
          <form
            disabled
            autoComplete="off"
            onSubmit={(e) => this.handleFormSubmit(e)}
            onBlur={(e) => this.handleValidation(e.target)}
          >
            <section className="row">
              <div className="col-12">
                <span>Your full name</span>
              </div>
              <div className="col-md-4 form-group">
                <input
                  type="text"
                  placeholder={t('auth.First Name')}
                  className="form-control"
                  defaultValue={senderData.firstName}
                  name="firstName"
                  autoComplete="offf"
                />
                <div className="invalid-feedback">
                  {this.state.firstNameError}
                </div>
              </div>
              <div className="col-md-4 form-group">
                <input
                  type="text"
                  placeholder={t('auth.Middle Name')}
                  className="form-control"
                  defaultValue={senderData.middleName}
                  name="middleName"
                  autoComplete="offf"
                />
                <div className="invalid-feedback">
                  {this.state.middleNameError}
                </div>
              </div>
              <div className="col-md-4 form-group">
                <input
                  type="text"
                  placeholder={t('auth.Last Name')}
                  className="form-control"
                  defaultValue={senderData.lastName}
                  name="lastName"
                  autoComplete="offf"
                />
                <div className="invalid-feedback">
                  {this.state.lastNameError}
                </div>
              </div>
              <div className="col-12">
                <span>Your state</span>
              </div>

              <div className="col-md-12 form-group">
                <select
                  className="custom-select"
                  name="state"
                  value={state}
                  ref={this.stateRef}
                  onChange={(e) => this.setUserState(e)}
                >
                  <option value="">Select State</option>

                  {states.map((state, index) => (
                    <option key={index} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{this.state.stateError}</div>
              </div>

              <div className="col-md-6 form-group mt-2 mb-0">
                <label className="w-100">
                  <span>Select a Password</span>
                  <input
                    type="password"
                    name="password"
                    onChange={this.validatePasswordRequirement}
                    placeholder={t('auth.Select a Password')}
                    className="form-control password"
                  />
                  <PasswordValidationInfo invalidRule={passwordInvalidRule} />
                  <div className="invalid-feedback">
                    {this.state.passwordError}
                  </div>
                </label>
              </div>

              <div className="col-md-6 form-group mt-2 mb-0">
                <label className="w-100">
                  <span>Repeat Password</span>
                  <input
                    type="password"
                    placeholder={t('auth.Repeat Password')}
                    className="form-control"
                    name="repeatPassword"
                  />
                  <div className="invalid-feedback">
                    {this.state.repeatPasswordError}
                  </div>
                </label>
              </div>

              <div className="mt-4 p-0 mx-auto">
                <button
                  type="submit"
                  className={'btn btn-lg btn-success mt-2 btn-block'}
                  disabled={isSigningUp || isLoggingIn}
                >
                  {(isSigningUp || isLoggingIn) && <WhiteSpinner />}
                  {t('button.Continue to Next Step')}
                </button>
              </div>

              {/* Social media disable */}
              {/* <div className="col-6">
                <a
                  onClick={clearAuthData}
                  href={AUTH_URL.FACEBOOK}
                  className="btn btn-outline-primary btn-block"
                >
                  <i className="icon ion-logo-facebook" />
                  <span className="d-none d-lg-inline">
                    {' '}
                    {t('auth.Continue with')}{' '}
                  </span>{' '}
                  {t('auth.Facebook')}
                </a>
              </div>
              <div className="col-6">
                <a
                  onClick={clearAuthData}
                  href={AUTH_URL.GOOGLE}
                  className="btn btn-outline-danger btn-block"
                >
                  <i className="icon ion-logo-google" />
                  <span className="d-none d-lg-inline">
                    {' '}
                    {t('auth.Continue with')}{' '}
                  </span>{' '}
                  {t('auth.Google')}
                </a>
              </div> */}
            </section>
          </form>
          {/* {features.isRecaptchaEnabled && (
            <p className="text-center small text-muted mb-0">
              <Trans i18nKey="auth.ReCAPTCHA Text">
                This site is protected by reCAPTCHA and the Google
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{' '}
                and
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{' '}
                apply.
              </Trans>
            </p>
          )} */}
        </fieldset>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    states: getReduxState(['home', 'states'], state),
    isFetchingStates: getReduxState(['home', 'isFetchingStates'], state),

    isLoggingIn: getReduxState(['auth', 'isLoggingIn'], state),
    error: getReduxState(['sender', 'error', 'signUp'], state),
    isSigningUp: getReduxState(['sender', 'isSigningUp'], state),
    features: getReduxState(['home', 'features'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getStates,
      signupSender,
    },
    dispatch
  );

SignUp.propTypes = {
  t: PropTypes.func,
  states: PropTypes.array,
  error: PropTypes.string,
  getStates: PropTypes.func,
  features: PropTypes.object,
  isSigningUp: PropTypes.bool,
  isLoggingIn: PropTypes.bool,
  isFetchingStates: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),

  states: sl.list(
    sl.object({
      name: sl.string(''),
      code: sl.string(''),
    })
  ),
  isFetchingStates: sl.boolean(false),

  getStates: sl.func(),
  error: sl.string(null),
  signupSender: sl.func(),

  isSigningUp: sl.boolean(false),
  isLoggingIn: sl.boolean(false),
  features: sl.object({
    isRecaptchaEnabled: sl.boolean(false),
  }),
});

const SenderSignUp = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SignUp)
);

export default SenderSignUp;
