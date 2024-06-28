import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import PopupAlert from 'components/form/popup-alert';
import { SuccessMessage } from 'components/form/toast-message-container';

import { PASSWORD_RULE } from 'sender/sender.constant';
import PasswordValidationInfo from 'sender/components/password-validation-info';

import {
  isInputEmpty,
  getReduxState,
  validatePassword,
  setIsInvalidField,
  getInvalidPasswordRule,
} from 'utils';
import {
  authLogOut,
  RESET_PASSWORD,
  requestResetPassword,
  initializeResetPasswordMessage,
} from 'auth';
import { history, ROUTES } from 'app';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const INPUT = {
  PASSWORD: 'password',
  NEW_PASSWORD: 'newPassword',
  OLD_PASSWORD: 'oldPassword',
  REPEAT_PASSWORD: 'repeatPassword',
};

class ResetPasswordFormComponent extends Component {
  state = {
    newPassword: null,
    oldPassword: null,
    passwordInvalidRule: [
      PASSWORD_RULE.NUMBER,
      PASSWORD_RULE.MIN_CHAR,
      PASSWORD_RULE.LOWER_CASE,
      PASSWORD_RULE.UPPER_CASE,
      PASSWORD_RULE.SPECIAL_CHAR,
    ],
    newPasswordError: null,
    oldPasswordError: null,
    isConfirmBoxOpen: false,
    repeatPasswordError: null,
  };

  componentDidMount = () => {
    const { initializeResetPasswordMessage } = staticSelector.select(
      this.props
    );

    initializeResetPasswordMessage();
  };

  setErrorState = (input, errorMessage = i18n.t('validation.This field cannot be empty')) => {
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
    let passwords = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];
      if (this.handleValidation(input)) {
        passwords[input.name] = input.value;
      } else if (input.name && !isInputFocused) {
        input.focus();
        isFormValid = false;
        isInputFocused = true;
      }
    }

    passwords = {
      ...passwords,
      phoneNumber: `${passwords.countryCode}${passwords.phoneNumber}`,
    };

    if (isFormValid) {
      if (this.props.isOldPasswordRequired) {
        return this.resetOldPassword(e);
      }

      this.resetForgottenPassword(e);
    }
  };

  resetOldPassword = (e) => {
    const oldPassword = e.target[0].value;
    const newPassword = e.target[1].value;
    const { requestResetPassword } = staticSelector.select(this.props);

    return requestResetPassword({ newPassword, oldPassword }).then(
      (resetPassword) => {
        if (resetPassword.type === RESET_PASSWORD.SUCCESS) {
          toast.success(
            <SuccessMessage message={this.props.resetPasswordResponse} />
          );

          this.toggleConfirmationBox();
        }
      }
    );
  };

  resetForgottenPassword = (e) => {
    const newPassword = e.target[0].value;
    const { token } = staticSelector.select(this.props);

    this.props
      .requestResetPassword({ newPassword, token })
      .then((resetPassword) => {
        if (resetPassword.type === RESET_PASSWORD.SUCCESS) {
          return history.push({
            pathname: ROUTES.HOME,
            message: this.props.resetPasswordResponse,
          });
        }
      });
  };

  handleValidation = (input) => {
    const inputName = input.name;
    const inputValue = input.value;

    if (isInputEmpty(input)) {
      return this.setErrorState(input);
    }

    if (
      (inputName === INPUT.NEW_PASSWORD || inputName === INPUT.OLD_PASSWORD) &&
      !validatePassword(inputValue)
    ) {
      return this.setErrorState(input, i18n.t('validation.Your password does not match the criteria'));
    } else {
      this.setStateValue(inputName, inputValue);
    }

    if (
      inputName === INPUT.REPEAT_PASSWORD &&
      inputValue !== this.state.newPassword
    ) {
      return this.setErrorState(input, i18n.t('validation.Password does not match'));
    }

    if (
      inputName === INPUT.NEW_PASSWORD &&
      inputValue === this.state.oldPassword
    ) {
      return this.setErrorState(input, i18n.t('validation.New password can not be same as old password'));
    }

    return true;
  };

  toggleConfirmationBox = () => {
    this.setState({
      isConfirmBoxOpen: !this.state.isConfirmBoxOpen,
    });
  };

  logout = () => {
    const { authLogOut } = staticSelector.select(this.props);

    this.toggleConfirmationBox();
    history.push(ROUTES.HOME);
    authLogOut();
  };

  cancelLogout = () => {
    this.toggleConfirmationBox();
  };

  validatePasswordRequirement = (e) => {
    e.preventDefault();
    const inputValue = e.target.value;

    this.setState(() => {
      return { passwordInvalidRule: getInvalidPasswordRule(inputValue) };
    });
  };

  render() {
    const {
      t,
      resetPasswordError,
      isResettingPassword,
      isOldPasswordRequired,
      resetPasswordResponse,
    } = staticSelector.select(this.props);
    const {
      newPasswordError,
      oldPasswordError,
      passwordInvalidRule,
      repeatPasswordError,
    } = this.state;

    return (
      <React.Fragment>
        <form
          onSubmit={(e) => this.handleFormSubmit(e)}
          onBlur={(e) => this.handleValidation(e.target)}
        >
          {resetPasswordError && (
            <div className="col-12">
              <span className="text-danger small alert-danger">
                <i className="icon ion-md-remove-circle text-danger" />{' '}
                {resetPasswordError}
              </span>
            </div>
          )}
          {resetPasswordResponse && (
            <div className="col-12">
              <span className="text-success small alert-success">
                <i className="icon ion-md-remove-circle text-success" />{' '}
                {resetPasswordResponse}
              </span>
            </div>
          )}
          {isOldPasswordRequired && (
            <div className="col-12 my-2 form-group">
              <label className="w-100">
                <span>{t('auth.Enter your old Password')}</span>
                <input
                  type="password"
                  placeholder={t('auth.Enter your old Password')}
                  className="form-control"
                  name={INPUT.OLD_PASSWORD}
                />
                <div className="invalid-feedback">{oldPasswordError}</div>
              </label>
            </div>
          )}
          <div className="col-12 my-2 form-group">
            <label className="w-100">
              <span>{t('auth.Select a Password')}</span>
              <input
                type="password"
                name={INPUT.NEW_PASSWORD}
                className="form-control password"
                placeholder={t('auth.Enter new Password')}
                onChange={this.validatePasswordRequirement}
              />
              <PasswordValidationInfo invalidRule={passwordInvalidRule} />
              <div className="invalid-feedback">{newPasswordError}</div>
            </label>
          </div>

          <div className="col-12 my-2 form-group">
            <label className="w-100">
              <span>{t('auth.Repeat Password')}</span>
              <input
                type="password"
                placeholder={t('auth.Repeat Password')}
                className="form-control"
                name="repeatPassword"
              />
              <div className="invalid-feedback">{repeatPasswordError}</div>
            </label>
          </div>

          <div className="col-12 my-4">
            <button
              type="submit"
              className="btn btn-lg btn-primary btn-block"
              disabled={isResettingPassword}
            >
              {isResettingPassword && <WhiteSpinner />}
              {t('button.Reset Password')}
            </button>
          </div>
        </form>
        <PopupAlert
          title={t('settings.Would you like to Logout?')}
          message={t(
            'settings.Would you like to logout from all of the devices previously you were logged in with?'
          )}
          className={'info'}
          asyncAction={this.logout}
          alert={this.state.isConfirmBoxOpen}
          toggleConfirmationBox={this.cancelLogout}
        />
      </React.Fragment>
    );
  }
}

ResetPasswordFormComponent.propTypes = {
  t: PropTypes.func,
  token: PropTypes.string,
  authLogOut: PropTypes.func,
  isOldPasswordRequired: PropTypes.bool,
  isResettingPassword: PropTypes.bool,
  resetPasswordError: PropTypes.string,
  requestResetPassword: PropTypes.func,
  resetPasswordResponse: PropTypes.string,
  initializeResetPasswordMessage: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  authLogOut: sl.func(),
  token: sl.string(null),
  requestResetPassword: sl.func(),
  resetPasswordError: sl.string(''),
  resetPasswordResponse: sl.string(''),
  isResettingPassword: sl.boolean(false),
  isOldPasswordRequired: sl.boolean(false),
  initializeResetPasswordMessage: sl.func(),
});

const mapStateToProps = (state) => {
  return {
    isResettingPassword: getReduxState(
      ['auth', 'isRequestingResetPassword'],
      state
    ),
    resetPasswordResponse: getReduxState(
      ['auth', 'resetPasswordMessage'],
      state
    ),
    resetPasswordError: getReduxState(['auth', 'error'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      authLogOut,
      requestResetPassword,
      initializeResetPasswordMessage,
    },
    dispatch
  );

const ResetPasswordForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ResetPasswordFormComponent));

export default ResetPasswordForm;
