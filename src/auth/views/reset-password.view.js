import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import { PAGE } from 'app';
import { withTranslation } from 'react-i18next';
import { PageHead } from 'components/layout/page-head';
import { getReduxState, getValueOfParam } from 'utils';
import ResetPasswordForm from 'sender/components/reset-password';

/**
 * Sender signup view.
 *
 */
class ResetPassword extends Component {
  state = {
    password: null,
    passwordError: null,
    repeatPasswordError: null,
  };

  /**
   * Renders signup form.
   *
   */
  render() {
    const { t, isResettingPassword } = this.props;
    const token = getValueOfParam(this.props, 'token');

    return (
      <React.Fragment>
        <PageHead title={PAGE.RESET_PASSWORD} />
        <div className="cityscape">
          <section className="container">
            <div className="row justify-content-center my-5">
              <div className="col-lg-8 text-center mb-4">
                <h1 className="h2 bold text-primary">
                  {t('auth.Request for password Reset')}
                </h1>
              </div>
              <div className="col-lg-6">
                <div className="card p-4">
                  <fieldset disabled={isResettingPassword}>
                    <ResetPasswordForm token={token} />
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

ResetPassword.propTypes = {
  t: PropTypes.func,
  isResettingPassword: PropTypes.bool,
  resetPasswordResponse: PropTypes.string,
};

/**
 * Maps states to props of component.
 *
 * @param {Object} state
 */
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
  };
};

/**
 * Maps dispatch to props.
 *
 * @param {Function} dispatch
 */
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export const ResetPasswordView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ResetPassword));
