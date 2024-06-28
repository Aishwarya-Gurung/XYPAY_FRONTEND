import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { useTranslation, withTranslation } from 'react-i18next';

import { PAGE, ROUTES } from 'app';
import { requestForgotPassword } from 'auth';
import sl from 'components/selector/selector';
import { FORGOT_PASSWORD } from '../auth.type';
import { PageHead } from 'components/layout/page-head';
import { isInputEmpty, getReduxState, setIsInvalidField } from 'utils';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

class ForgotPassword extends Component {
  state = {
    email: '',
    emailError: '',
    linkSent: false,
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;

    this.props.requestForgotPassword(email).then((res) => {
      if (res.type === FORGOT_PASSWORD.SUCCESS) {
        return this.setState({ linkSent: true });
      }
    });
  };

  setErrorState = (input, errorMessage = i18n.t('validation.This field cannot be empty')) => {
    setIsInvalidField(input);
    const stateName = `${input.name}Error`;

    this.setState(() => {
      return { [stateName]: errorMessage };
    });

    return false;
  };

  handleValidation = (input) => {
    if (isInputEmpty(input)) {
      this.setErrorState(input);
    }
    // email validation

    return true;
  };

  updateEmailAddress = (e) => {
    e.preventDefault();

    return this.setState({
      email: e.target.value,
      emailError: '',
    });
  };

  render() {
    const { emailError, linkSent } = this.state;
    const {
      t,
      forgotPasswordError,
      forgotPasswordMessage,
      isRequestingForgotPassword,
    } = staticSelectors.select(this.props);

    return (
      <React.Fragment>
        <PageHead title={PAGE.FORGOT_PASSWORD} />
        <div className="cityscape">
          <section className="container">
            <div className="row justify-content-center my-5">
              <div className="col-lg-8 text-center mb-4">
                <h1 className="h2 bold text-primary">
                  {t('auth.Forgot Password?')}
                </h1>
              </div>

              <div className="col-lg-6">
                <div className="card p-4">
                  <fieldset disabled={isRequestingForgotPassword}>
                    {linkSent ? (
                      <LinkSentMessage
                        forgotPasswordMessage={forgotPasswordMessage}
                      />
                    ) : (
                      <form
                        onSubmit={(e) => this.handleFormSubmit(e)}
                        onBlur={(e) => this.handleValidation(e.target)}
                      >
                        {forgotPasswordError && (
                          <div className="col-12">
                            <span className="text-danger small alert-danger">
                              <i className="icon ion-md-remove-circle text-danger" />{' '}
                              {forgotPasswordError}
                            </span>
                          </div>
                        )}
                        <div className="col-12 my-2 form-group">
                          <label className="w-100">
                            <span>{t('auth.Your email address')}</span>
                            <input
                              required
                              type="email"
                              name="email"
                              className="form-control"
                              placeholder={t('auth.Your email address')}
                              onChange={this.updateEmailAddress}
                            />
                            <div className="invalid-feedback">{emailError}</div>
                          </label>
                        </div>
                        <div className="col-12 my-4">
                          <button
                            type="submit"
                            className="btn btn-lg btn-green btn-block"
                            disabled={isRequestingForgotPassword}
                          >
                            {isRequestingForgotPassword && <WhiteSpinner />}
                            {t('button.Get Password Reset link')}
                          </button>
                        </div>
                      </form>
                    )}
                  </fieldset>
                </div>
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>
    );
  }
}

ForgotPassword.propTypes = {
  t: PropTypes.func,
  requestForgotPassword: PropTypes.func,
  forgotPasswordError: PropTypes.string,
  forgotPasswordMessage: PropTypes.string,
  isRequestingForgotPassword: PropTypes.bool,
};

const staticSelectors = sl.object({
  t: sl.func(),
  requestForgotPassword: sl.func(),
  forgotPasswordError: sl.string(''),
  forgotPasswordMessage: sl.string(''),
  isRequestingForgotPassword: sl.boolean(false),
});

const LinkSentMessage = ({ forgotPasswordMessage }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <div className="verification-icon">
        <img src={require('../../assets/img/email.png')} alt="email-sent" />
        <i className="icon ion-md-checkmark-circle text-success verified-icon" />
      </div>

      <h4 className="text-primary">
        {t('verification.Please check your email now')}
      </h4>
      <p className="text-primary">{forgotPasswordMessage}</p>
      <Link
        to={ROUTES.HOME}
        className="border-0 btn-link p-0 mb-3 d-block bold cursor-pointer text-danger"
      >
        {t('button.Go to Home')}
      </Link>
    </div>
  );
};

LinkSentMessage.propTypes = {
  forgotPasswordMessage: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    isRequestingForgotPassword: getReduxState(
      ['auth', 'isRequestingForgotPassword'],
      state
    ),
    forgotPasswordError: getReduxState(['auth', 'error'], state),
    forgotPasswordMessage: getReduxState(
      ['auth', 'forgotPasswordMessage'],
      state
    ),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      requestForgotPassword,
    },
    dispatch
  );

export const ForgotPasswordView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ForgotPassword));
