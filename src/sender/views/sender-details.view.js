import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import Navbar from 'components/layout/navbar';
import { PageHead } from 'components/layout/page-head';
import BlinkTextLoader from 'components/form/blink-loader-text';

import PaymentSideReceipt from 'payment/components/payment-side-receipt';

import KycForm from 'sender/components/kyc-form';
import { toggleWidgetModal } from 'sender';

import { initiateKYC } from 'api';
import { setKYCStatus } from 'auth';
import { history, PAGE, ROUTES } from 'app';
import { getReduxState, getApiExceptionMsg } from 'utils';

/**
 * Sender Details view.
 */
class SenderDetails extends Component {
  state = {
    isBasicKYCSubmitted: false,
  };

  /**
   * Component did mount.
   */
  componentDidMount = () => {
    const { kycStatus, isEmailVerified, isPhoneVerified } =
      staticSelector.select(this.props);

    if (this.isEligible(isEmailVerified, isPhoneVerified, kycStatus)) {
      return <Redirect to={ROUTES.BENEFICIARY_DETAILS} />;
    }
  };

  /**
   * Continuous to next step.
   */
  continueToNextStep = () => {
    history.push(ROUTES.BENEFICIARY_DETAILS);
  };

  /**
   * Check if email, phone and kycStatus is verified.
   *
   * @param {boolean} isEmailVerified
   * @param {boolean} isPhoneVerified
   */
  isEligible = (isEmailVerified, isPhoneVerified) => {
    return isEmailVerified && isPhoneVerified;
  };

  handleInitiateKYC = async () => {
    const { toggleWidgetModal } = staticSelector.select(this.props);

    const { error } = await initiateKYC();

    if (error) {
      toast.error(getApiExceptionMsg(error.message));
    }

    this.setState({
      isBasicKYCSubmitted: false,
    });

    return toggleWidgetModal(false);
  };

  /**
   * Renders Details forms.
   */
  render() {
    const {
      t,
      kycStatus,
      isEmailVerified,
      isPhoneVerified,

      isFetchingWidgetToken,
    } = staticSelector.select(this.props);

    if (this.isEligible(isEmailVerified, isPhoneVerified, kycStatus)) {
      return <Redirect to={ROUTES.BENEFICIARY_DETAILS} />;
    }

    return (
      <div className="page pb-4">
        <PageHead title={PAGE.SENDER_DETAILS} />
        <Navbar currentStep={2} />
        <section className="container">
          <div className="row justify-content-between my-5">
            <div className="col-md-7">
              {isFetchingWidgetToken ? (
                <BlinkTextLoader
                  align="left"
                  message={t(
                    'sender.Loading your personal details Please wait'
                  )}
                />
              ) : (
                <>
                  <KycForm
                    setIsBasicKYCSubmitted={() => {
                      this.setState({ isBasicKYCSubmitted: true });
                    }}
                  />
                </>
              )}
            </div>
            <div className="col-md-4">
              <PaymentSideReceipt />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

SenderDetails.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
  history: PropTypes.object,
  kycStatus: PropTypes.string,
  setKYCStatus: PropTypes.func,
  referenceId: PropTypes.string,
  widgetToken: PropTypes.string,
  isKYCVerified: PropTypes.bool,

  isEmailVerified: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,
  paymentDetail: PropTypes.object,
  toggleWidgetModal: PropTypes.func,
  isWidgetModalOpen: PropTypes.bool,
  isFetchingWidgetToken: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  user: sl.object({
    id: sl.number(),
    fullName: sl.string(''),
    phoneNumber: sl.string(''),
    email: sl.string(''),
  }),

  referenceId: sl.string(''),
  widgetToken: sl.string(null),
  isFetchingWidgetToken: sl.boolean(false),

  toggleWidgetModal: sl.func(),
  isWidgetModalOpen: sl.boolean(false),

  setKYCStatus: sl.func(),
  kycStatus: sl.string(''),
  isKYCVerified: sl.boolean(false),
  isEmailVerified: sl.boolean(false),
  isPhoneVerified: sl.boolean(false),

  paymentDetail: sl.object({
    sendingAmount: sl.number(),
    receivingCurrency: sl.string(''),
  }),
});

/**
 * Maps state to props.
 *
 * @param {Object} state
 */
const mapStateToProps = (state) => {
  return {
    // Data
    user: getReduxState(['auth', 'user'], state),
    kycStatus: getReduxState(['auth', 'kycStatus'], state),
    widgetToken: getReduxState(['sender', 'widgetToken'], state),
    referenceId: getReduxState(['sender', 'referenceId'], state),
    isKYCVerified: getReduxState(['auth', 'isKYCVerified'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
    isEmailVerified: getReduxState(['auth', 'isEmailVerified'], state),
    isPhoneVerified: getReduxState(['auth', 'isPhoneVerified'], state),
    // UI
    isWidgetModalOpen: getReduxState(['sender', 'isWidgetModalOpen'], state),
    isFetchingWidgetToken: getReduxState(
      ['sender', 'isFetchingWidgetToken'],
      state
    ),
  };
};

/**
 * Maps dispatch to props.
 *
 * @param {Function} dispatch
 */
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setKYCStatus,

      toggleWidgetModal,
    },
    dispatch
  );

export const SenderDetailsView = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(SenderDetails);
