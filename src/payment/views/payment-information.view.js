import i18n from 'i18next';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import Navbar from 'components/layout/navbar';
import sl from 'components/selector/selector';
import { InfoMessage } from 'components/form/toast-message-container';
import { PageHead } from 'components/layout/page-head';

import {
  cookie,
  isInputEmpty,
  getReduxState,
  serializeArray,
  setIsInvalidField,
  unsetIsInvalidField,
} from 'utils';

import Khalti from 'payment/components/khalti';
import PaymentSideReceipt from 'payment/components/payment-side-receipt';

import { getBeneficiaryList } from 'beneficiary';
import { toggleWidgetModal } from 'sender';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';
import { PAGE, ROUTES, history, COOKIE_KEY, PAYMENT_METHOD } from 'app';

import {
  getSenderBanks,
  storePaymentDetail,
  getSenderDebitCards,
} from 'payment';

class PaymentInformation extends Component {
  state = {
    isRedirect: false,
    expiredBank: null,
    paymentMethod: null,
    senderBankError: null,
    paymentSourceError: null,
    senderDebitCardError: null,
  };

  componentDidMount = () => {
    const {
      senderBanks,
      paymentDetail,
      getSenderBanks,
      senderDebitCards,
      getSenderDebitCards,
    } = staticSelector.select(this.props);

    if (!senderBanks.length) {
      getSenderBanks();
    }

    if (!senderDebitCards.length) {
      getSenderDebitCards();
    }

    this.setState(() => {
      return {
        paymentMethod: paymentDetail.paymentMethod,
      };
    });
  };

  updatePaymentMethod = (paymentMethod) => {
    this.setState(() => {
      return {
        paymentMethod,
        paymentSourceError: null,
      };
    }, this.updateWidgetStatus);
  };

  updateWidgetStatus = () => {
    const {
      senderBanks,
      senderDebitCards,
      toggleWidgetModal,
      isSenderBanksFetched,
      isSenderDebitCardsFetched,
    } = staticSelector.select(this.props);
    const { paymentMethod } = this.state;

    if (paymentMethod === PAYMENT_METHOD.BANK_ACCOUNT) {
      if (isSenderBanksFetched && !senderBanks.length) {
        return toggleWidgetModal(true);
      }
    }

    if (paymentMethod === PAYMENT_METHOD.DEBIT_CARD) {
      if (isSenderDebitCardsFetched && !senderDebitCards.length) {
        return toggleWidgetModal(true);
      }
    }

    toggleWidgetModal(false);
  };

  setErrorState = (
    input,
    errorMessage = i18n.t('validation.This field cannot be empty')
  ) => {
    setIsInvalidField(input);

    this.setState((state) => {
      return (state[`${input.name}Error`] = errorMessage);
    });

    return false;
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();
    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const paymentInfo = {};

    const { storePaymentDetail } = staticSelector.select(this.props);
    const formData = serializeArray(e.target);

    if (this.state.paymentMethod === PAYMENT_METHOD.BANK_ACCOUNT) {
      const senderBank = formData.find((data) => data.name === 'senderBank');

      if (!senderBank) {
        this.updateWidgetStatus();

        return this.setState(() => {
          return {
            paymentSourceError: i18n.t(
              'validation.Please select a payment method'
            ),
          };
        });
      }
    }

    if (this.state.paymentMethod === PAYMENT_METHOD.DEBIT_CARD) {
      const senderDebitCard = formData.find(
        (data) => data.name === 'senderDebitCard'
      );

      if (!senderDebitCard) {
        this.updateWidgetStatus();

        return this.setState(() => {
          return {
            paymentSourceError: i18n.t(
              'validation.Please select a payment method'
            ),
          };
        });
      }
    }

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (!input.disabled && input.name) {
        if (this.handleValidation(input)) {
          if (input.type === 'radio') {
            paymentInfo['paymentMethod'] = this.state.paymentMethod;
            continue;
          }

          paymentInfo[input.name] = input.value;
        } else {
          if (!isInputFocused) {
            input.focus();
            isFormValid = false;
            isInputFocused = true;
          }
        }
      }
    }

    if (isFormValid && this.state.paymentMethod) {
      history.push(ROUTES.REVIEW_DETAILS);
      await storePaymentDetail(paymentInfo);
    }
  };

  handleValidation = (input) => {
    unsetIsInvalidField(input);

    if (!this.state.paymentMethod) {
      return this.setState(() => {
        return {
          paymentSourceError: i18n.t(
            'validation.Please select a payment method'
          ),
        };
      });
    }

    if (isInputEmpty(input)) {
      return this.setErrorState(input);
    }

    return true;
  };

  bankReLoginRequired = (bankId) => {
    const { paymentDetail } = this.props;

    cookie.set(COOKIE_KEY.PAYMENT_METHOD, this.state.paymentMethod, 1);
    cookie.set(COOKIE_KEY.PAYMENT_DETAIL, JSON.stringify(paymentDetail), 1);

    if (bankId !== null) {
      cookie.set(COOKIE_KEY.BANK_RELOGIN, true, 1);
    }

    this.setState(() => {
      return { expiredBank: bankId };
    });
  };

  handleNewPaymentSourceAdded = async (paymentSourceMethod) => {
    const { getSenderBanks, getSenderDebitCards, storePaymentDetail } =
      staticSelector.select(this.props);

    cookie.delete([
      COOKIE_KEY.BANK_RELOGIN,
      COOKIE_KEY.PAYMENT_DETAIL,
      COOKIE_KEY.PAYMENT_METHOD,
      COOKIE_KEY.RECIPIENT_DETAIL,
    ]);

    if (paymentSourceMethod === PAYMENT_METHOD.BANK_ACCOUNT) {
      this.setState(() => ({
        isRedirect: false,
      }));
      await getSenderBanks();
      const { senderBanks } = staticSelector.select(this.props);

      if (senderBanks.length) {
        const senderBank = senderBanks[0].id;
        const paymentInfo = {
          senderBank,
          paymentMethod: this.state.paymentMethod,
        };

        await storePaymentDetail(paymentInfo);

        return history.push(ROUTES.REVIEW_DETAILS);
      }
    }

    if (paymentSourceMethod === PAYMENT_METHOD.DEBIT_CARD) {
      await getSenderDebitCards();
      const { senderDebitCards } = staticSelector.select(this.props);

      if (senderDebitCards.length) {
        const senderDebitCard = senderDebitCards[0].id;
        const paymentInfo = {
          senderDebitCard,
          paymentMethod: this.state.paymentMethod,
        };

        await storePaymentDetail(paymentInfo);

        return history.push(ROUTES.REVIEW_DETAILS);
      }
    }

    return toast.info(
      <InfoMessage
        message={i18n.t(
          'validation.There is no any payment method available at the moment'
        )}
      />
    );
  };

  handleCloseModel = () => {
    const { toggleWidgetModal } = staticSelector.select(this.props);

    toggleWidgetModal();
    this.setState(() => ({
      isRedirect: false,
    }));
  };

  render() {
    const { t, isSavingPaymentInfo } = staticSelector.select(this.props);

    return (
      <div className="page pb-4">
        <PageHead title={PAGE.PAYMENT_INFORMATION} />
        <Navbar currentStep={4} />
        <section className="container">
          <div className="row justify-content-between my-5">
            <div className="col-12 mb-4">
              <h1 className="h2 text-primary bold">
                {t('payment.How would you want to pay for this transaction?')}
              </h1>
            </div>

            <div className="col-md-8 col-lg-6">
              <fieldset>
                <form
                  onBlur={(e) => this.handleValidation(e.target)}
                  onSubmit={(e) => this.handleFormSubmit(e)}
                >
                  <Khalti
                    isCurrentPaymentMethod={
                      this.state.paymentMethod === PAYMENT_METHOD.KHALTI
                    }
                    updatePaymentMethod={this.updatePaymentMethod}
                  />
                  {/* <PaymentBank
                    banks={senderBanks}
                    toggleWidgetModal={toggleWidgetModal}
                    defaultValue={paymentDetail.senderBank}
                    senderBankError={this.state.senderBankError}
                    updatePaymentMethod={this.updatePaymentMethod}
                    isCurrentPaymentMethod={
                      this.state.paymentMethod === PAYMENT_METHOD.BANK_ACCOUNT
                    }
                    isFetching={isFetchingSenderBanks}
                    bankReLoginRequired={this.bankReLoginRequired}
                  />

                  <PaymentCard
                    cards={senderDebitCards}
                    defaultValue={paymentDetail.senderDebitCard}
                    sendingAmount={paymentDetail.sendingAmount}
                    senderDebitCardError={this.state.senderDebitCardError}
                    isCurrentPaymentMethod={
                      this.state.paymentMethod === PAYMENT_METHOD.DEBIT_CARD
                    }
                    toggleWidgetModal={toggleWidgetModal}
                    updatePaymentMethod={this.updatePaymentMethod}
                    isFetching={isFetchingSenderDebitCard}
                  /> */}

                  <Link
                    to={ROUTES.BENEFICIARY_DETAILS}
                    title={t('button.Previous Step')}
                    className="btn btn-lg btn-default mr-1"
                  >
                    <i className="icon ion-md-arrow-round-back"></i>
                  </Link>
                  <button
                    onClick={this.continueToNextStep}
                    className="btn btn-lg btn-green"
                    disabled={
                      this.state.paymentMethod ===
                        PAYMENT_METHOD.BANK_ACCOUNT ||
                      this.state.paymentMethod === PAYMENT_METHOD.DEBIT_CARD
                        ? false
                        : true
                    }
                  >
                    {isSavingPaymentInfo && <WhiteSpinner />}
                    {t('button.Continue to Next Step')}
                  </button>
                </form>
              </fieldset>
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

PaymentInformation.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  paymentDetail: PropTypes.object,

  senderBanks: PropTypes.array,
  senderDebitCards: PropTypes.array,
  getSenderBanks: PropTypes.func,
  getBeneficiaryList: PropTypes.func,
  getSenderDebitCards: PropTypes.func,

  isSavingPaymentInfo: PropTypes.bool,
  storePaymentDetail: PropTypes.func,

  referenceId: PropTypes.string,
  widgetToken: PropTypes.string,
  toggleWidgetModal: PropTypes.func,
  isWidgetModalOpen: PropTypes.bool,

  isSenderBanksFetched: PropTypes.bool,
  isFetchingSenderBanks: PropTypes.bool,
  isFetchingSenderDebitCard: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  user: sl.object({
    id: sl.string(''),
    name: sl.string(''),
    phone: sl.string(''),
    email: sl.string(''),
  }),

  senderBanks: sl.list(
    sl.object({
      id: sl.string(''),
      name: sl.string(''),
      currency: sl.string(''),
      accountType: sl.string(''),
      institutionName: sl.string(''),
      accountHolderName: sl.string(''),
      verificationStatus: sl.string(''),
    })
  ),

  senderDebitCards: sl.list(
    sl.object({
      id: sl.string(''),
      nickName: sl.string(''),
      senderId: sl.string(''),
      institutionName: sl.string(''),
      fundingSourceName: sl.string(''),
    })
  ),

  paymentDetail: sl.object({
    receivingCurrency: sl.string(''),
    senderBank: sl.string(''),
    sendingAmount: sl.number(),
    senderDebitCard: sl.string(''),
    paymentMethod: sl.string('No payment method selected'),
  }),

  getSenderBanks: sl.func(),
  getSenderDebitCards: sl.func(),
  getBeneficiaryList: sl.func(),

  storePaymentDetail: sl.func(),
  isSavingPaymentInfo: sl.boolean(false),

  referenceId: sl.string(''),
  widgetToken: sl.string(null),
  toggleWidgetModal: sl.func(),
  isWidgetModalOpen: sl.boolean(false),

  isSenderBanksFetched: sl.boolean(false),
  isFetchingSenderBanks: sl.boolean(false),
  isSenderDebitCardsFetched: sl.boolean(false),
  isFetchingSenderDebitCard: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    // Data
    user: getReduxState(['auth', 'user'], state),
    widgetToken: getReduxState(['sender', 'widgetToken'], state),
    referenceId: getReduxState(['sender', 'referenceId'], state),
    senderBanks: getReduxState(['payment', 'senderBanks'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
    senderDebitCards: getReduxState(['payment', 'senderDebitCards'], state),

    // UI
    isSenderBanksFetched: getReduxState(
      ['payment', 'isSenderBanksFetched'],
      state
    ),
    isFetchingSenderBanks: getReduxState(
      ['payment', 'isFetchingSenderBanks'],
      state
    ),

    isSenderDebitCardsFetched: getReduxState(
      ['payment', 'isSenderDebitCardsFetched'],
      state
    ),
    isFetchingSenderDebitCard: getReduxState(
      ['payment', 'isFetchingSenderDebitCard'],
      state
    ),
    isWidgetModalOpen: getReduxState(['sender', 'isWidgetModalOpen'], state),
    isSavingPaymentInfo: getReduxState(
      ['payment', 'isSavingPaymentInfo'],
      state
    ),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getSenderBanks,
      toggleWidgetModal,
      storePaymentDetail,
      getBeneficiaryList,
      getSenderDebitCards,
    },
    dispatch
  );

export const PaymentInformationView = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(PaymentInformation);
