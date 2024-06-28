import i18n from 'i18next';
import PropsTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { getStates } from 'landing-page';
import { ROUTES, PAGE, COUNTRY } from 'app';
import sl from 'components/selector/selector';
import { getGuestInfo, authOAuth2Signup } from 'auth';

import {
  isInputEmpty,
  getReduxState,
  phoneValidator,
  getValueOfParam,
  setIsInvalidField,
  unsetIsInvalidField,
} from 'utils';
import { PageHead } from 'components/layout/page-head';
import BlinkTextLoader from 'components/form/blink-loader-text';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const INPUT = {
  STATE: 'state',
  COUNTRY_CODE: 'countryCode',
  PHONE_NUMBER: 'phoneNumber',
};

class OAuth2Authentication extends Component {
  state = {
    emailError: null,
    stateError: null,
    countryCodeError: null,
  };

  componentDidMount = async () => {
    const token = getValueOfParam(this.props, 'token');
    const error = getValueOfParam(this.props, 'error');
    const { states, getStates, getGuestInfo } = staticSelector.select(
      this.props
    );

    if (error) {
      return this.props.history.push({
        pathname: ROUTES.HOME,
        message: error,
      });
    }

    if (token) {
      if (!(await getGuestInfo(token))) {
        return this.props.history.push(ROUTES.HOME);
      }

      if (!states.length) {
        return getStates();
      }
    }

    return this.props.history.push(ROUTES.HOME);
  };

  setErrorState = (input, errorMessage = i18n.t('validation.This field cannot be empty')) => {
    setIsInvalidField(input);
    const stateName = `${input.name}Error`;

    this.setState(() => {
      return { [stateName]: errorMessage };
    });

    return false;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const senderInfo = {};
    const { authOAuth2Signup } = staticSelector.select(this.props);

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];
      if (this.handleValidation(input)) {
        senderInfo[input.name] = input.value;
      } else if (input.name && !isInputFocused) {
        input.focus();
        isFormValid = false;
        isInputFocused = true;
      }
    }

    if (isFormValid) {
      return authOAuth2Signup(senderInfo);
    }
  };

  handleValidation = (input) => {
    const inputName = input.name;
    const inputValue = input.value;

    unsetIsInvalidField(input);
    if (isInputEmpty(input)) {
      return this.setErrorState(input);
    }

    if (
      inputName === INPUT.PHONE_NUMBER &&
      !phoneValidator().validate(inputValue, COUNTRY.USA)
    ) {
      return this.setErrorState(input, i18n.t('validation.Please enter valid phone number'));
    }

    return true;
  };

  render() {
    const {
      t,
      user,
      error,
      states,
      isLoggingIn,
      isFetchingGuestInfo,
    } = staticSelector.select(this.props);

    if (user.address.state && user.phoneNumber) {
      return (
        <Redirect
          to={{
            pathname: ROUTES.SENDER_VERIFICATION,
            state: { from: this.props.location },
          }}
        />
      );
    }

    return (
      <div className="cityscape pb-3">
        <PageHead title={PAGE.SIGN_UP} />
        <section className="container">
          <div className="row justify-content-center my-2">
            <div className="col-lg-4 col-md-8 mb-0">
              {isFetchingGuestInfo ? (
                <div className="cityscape">
                  <div className="container-loader w-100">
                    <BlinkTextLoader
                      message={t(
                        'auth.Gathering your account details Please wait'
                      )}
                    />
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => this.handleSubmit(e)}
                  onBlur={(e) => this.handleValidation(e.target)}
                >
                  {user.imageUrl && (
                    <div className="oauth2-profile-picture">
                      <img src={user.imageUrl} alt="profile" />
                    </div>
                  )}

                  <section className="row">
                    {error && (
                      <div className="col-12 mt-3">
                        <span className="text-danger small alert-danger">
                          <i className="icon ion-md-remove-circle text-danger" />{' '}
                          {error}
                        </span>
                      </div>
                    )}

                    <div className="col-12 my-2 form-group">
                      <label className="w-100">
                        <span>{t('auth.Your email address')}</span>
                        <span className="form-control">{user.email}</span>
                      </label>
                    </div>

                    <div className="col-12">
                      <span>{t('auth.Your state')}</span>
                    </div>
                    <div className="col-12 form-group">
                      <select className="custom-select" name="state">
                        <option value="">Select State</option>

                        {states.map((state, index) => (
                          <option key={index} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <div className="invalid-feedback">
                        {this.state.stateError}
                      </div>
                    </div>

                    <div className="col-12">
                      <span>{t('auth.Your phone number')}</span>
                    </div>
                    <div className="col-3 form-group">
                      <select className="custom-select" name="countryCode">
                        <option>+1</option>
                      </select>
                      <div className="invalid-feedback">
                        {this.state.countryCodeError}
                      </div>
                    </div>
                    <div className="col-9 form-group">
                      <input
                        type="text"
                        placeholder={t('auth.Enter your phone number')}
                        className="form-control"
                        name="phoneNumber"
                        maxLength={phoneValidator().getMaxLength(COUNTRY.USA)}
                      />
                      <div className="invalid-feedback">
                        {this.state.phoneNumberError}
                      </div>
                    </div>

                    <div className="col-12 my-4">
                      <button
                        type="submit"
                        className="btn btn-lg btn-green btn-block"
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn && <WhiteSpinner />}
                        {t('button.Continue')}
                      </button>
                    </div>
                  </section>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

OAuth2Authentication.propTypes = {
  t: PropsTypes.func,
  user: PropsTypes.object,
  states: PropsTypes.array,
  error: PropsTypes.string,
  getStates: PropsTypes.func,
  history: PropsTypes.object,
  location: PropsTypes.object,
  isLoggingIn: PropsTypes.bool,
  getGuestInfo: PropsTypes.func,
  authOAuth2Signup: PropsTypes.func,
  isFetchingStates: PropsTypes.bool,
  isFetchingGuestInfo: PropsTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  user: sl.object({
    id: sl.number(),
    firstName: sl.string(null),
    middleName: sl.string(null),
    lastName: sl.string(null),
    fullName: sl.string(null),
    email: sl.string(null),
    phoneNumber: sl.string(null),
    imageUrl: sl.string(null),

    address: sl.object({
      country: sl.string(null),
      state: sl.string(null),
      stateCode: sl.string(null),
    }),
  }),

  error: sl.string(null),

  states: sl.list(
    sl.object({
      name: sl.string(''),
      code: sl.string(''),
    })
  ),

  isLoggingIn: sl.boolean(false),
  isFetchingStates: sl.boolean(false),

  getStates: sl.func(),
  getGuestInfo: sl.func(),
  authOAuth2Signup: sl.func(),
  isFetchingGuestInfo: sl.boolean(false),
});

/**
 * Maps states to props.
 *
 * @param {Object} state
 */
const mapStateToProps = (state) => {
  return {
    user: getReduxState(['auth', 'user'], state),
    error: getReduxState(['auth', 'error'], state),
    states: getReduxState(['home', 'states'], state),
    isLoggingIn: getReduxState(['auth', 'isLoggingIn'], state),
    isFetchingStates: getReduxState(['home', 'isFetchingStates'], state),
    isFetchingGuestInfo: getReduxState(['auth', 'isFetchingGuestInfo'], state),
  };
};

/**
 * Maps dispatch to props.
 *
 * @param {Function} dispatch
 */
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ getStates, getGuestInfo, authOAuth2Signup }, dispatch);

export const OAuth2AuthenticationView = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(OAuth2Authentication);
