import i18n from 'i18next';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';
import bigdecimal, { RoundingMode } from 'bigdecimal';

import { history, PAGE, ROUTES } from 'app';

import Navbar from 'components/layout/navbar';
import { PageHead } from 'components/layout/page-head';
import BeneficiaryCountrySelector from 'components/form/beneficiary-country-selector';

import { getFeeRange, getExchangeRate, storePaymentDetail } from 'payment';
import { staticSelector } from 'payment';
import CurrencyConverter from 'payment/components/currency-converter';

import {
  securedLS,
  isInputEmpty,
  getReduxState,
  getMinumumFee,
  getFeesWithDetail,
  getMinFeeSetAmount,
} from 'utils';
import { authLogin, getSenderInfo, toggleLoginModal } from 'auth';

const INPUT = {
  COUNTRY: 'country',
  COUNTRY_TEMP: 'country-temp',
  SENDING_AMOUNT: 'sendingAmount',
  RECEIVING_AMOUNT: 'receivingAmount',
  PAYMENT_CURRENCY: 'paymentCurrency',
  RECEIVING_CURRENCY: 'receivingCurrency',
};

class PaymentDetails extends Component {
  state = {
    transferFee: 0,
    transferFeesDetail: [],
    sendingAmount: 0,
    tempCountry: '',
    receivingAmount: 0,
    countryError: null,
    sendingAmountError: null,
    receivingAmountError: null,
    currency: '',
  };

  componentDidMount = async () => {
    const {
      feeSets,
      getFeeRange,
      paymentDetail,
      getSenderInfo,
      exchangeRates,
      isAuthenticated,
      getExchangeRate,
    } = staticSelector.select(this.props);

    this.updateCurrency();

    if (exchangeRates.length <= 0) {
      getExchangeRate();
    }

    if (feeSets.length <= 0) {
      await getFeeRange();
    }

    if (isAuthenticated) {
      await getSenderInfo();
    }

    if (paymentDetail.sendingAmount) {
      const transferFee = this.getTransferFee(paymentDetail.sendingAmount);

      this.setState(() => {
        return {
          transferFee,
          sendingAmount: paymentDetail.sendingAmount,
          receivingAmount: this.calculateReceivingAmount(
            paymentDetail.sendingAmount
          ),
          currency: this.state.currency,
        };
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { getFeeRange, isSigningOut, getExchangeRate } =
      staticSelector.select(this.props);

    if (prevProps.isSigningOut !== isSigningOut) {
      this.setState({
        transferFee: 0,
        sendingAmount: 0,
        receivingAmount: 0,
        countryError: null,
        sendingAmountError: null,
        receivingAmountError: null,
      });
      getExchangeRate();
      getFeeRange();
    }

    if (prevProps.selectedCountry !== this.props.selectedCountry) {
      this.updateCurrency();
    }

    if (prevState.currency !== this.state.currency) {
      this.updateSendingAmount();
    }
  }

  updateCurrency = () => {
    const { selectedCountry } = staticSelector.select(this.props);

    const currency = selectedCountry.currency[0]?.code;

    return this.setState({ currency });
  };

  handleCurrencyChange = (input = null) => {
    const currency = input.target.value;
    const sendingAmount = this.state.sendingAmount || 0;
    const receivingAmount = this.calculateReceivingAmount(sendingAmount);
    const transferFee = this.getTransferFee(sendingAmount);

    this.setState({
      transferFee,
      sendingAmount,
      receivingAmount,
      currency,
    });

    const invalidMaxAndMinAmount = this.checkMaximumAndMinimumAmount(
      sendingAmount,
      currency
    );

    if (invalidMaxAndMinAmount) {
      return this.setErrorState(INPUT.SENDING_AMOUNT, invalidMaxAndMinAmount);
    }

    this.unsetErrorState(INPUT.SENDING_AMOUNT);
  };

  updateSendingAmount = (input = null) => {
    let transferFee, sendingAmount, receivingAmount;

    if (input) {
      if (input.target.name === INPUT.SENDING_AMOUNT) {
        sendingAmount = parseFloat(input.target.value) || 0;
        receivingAmount = this.calculateReceivingAmount(sendingAmount);
        transferFee = this.getTransferFee(sendingAmount);
      }

      if (input.target.name === INPUT.RECEIVING_AMOUNT) {
        receivingAmount = parseFloat(input.target.value) || 0;
        sendingAmount = this.calculateSendingAmount(receivingAmount);
        transferFee = this.getTransferFee(sendingAmount);
      }

      this.handleValidation(input.target);
    } else {
      sendingAmount = this.state.sendingAmount;
      receivingAmount = this.calculateReceivingAmount(sendingAmount);
      transferFee = this.getTransferFee(sendingAmount);
    }

    this.setState({
      transferFee,
      sendingAmount,
      receivingAmount,
    });
  };

  calculateReceivingAmount = (amount) => {
    const exchangeRate = this.getExchangeRateForSelectedDestination();

    if (exchangeRate) {
      const rate = new bigdecimal.BigDecimal(exchangeRate.rate.toString());
      const sendingAmount = new bigdecimal.BigDecimal(amount.toString());
      const receivingAmount = sendingAmount.multiply(rate);

      return receivingAmount.floatValue();
    }

    return 0;
  };

  calculateSendingAmount = (amount) => {
    const exchangeRate = this.getExchangeRateForSelectedDestination();

    if (exchangeRate) {
      const rate = new bigdecimal.BigDecimal(exchangeRate.rate.toString());
      const receivingAmount = new bigdecimal.BigDecimal(amount.toString());

      const sendingAmount = receivingAmount.divide(
        rate,
        2,
        RoundingMode.HALF_UP()
      );

      return sendingAmount.floatValue();
    }

    return 0;
  };

  getTransferFee = (sendingAmount) => {
    const { currency } = this.state;
    const { feeSets, selectedCountry } = staticSelector.select(this.props);

    const fees = getFeesWithDetail({
      feeSets,
      currency,
      sendingAmount,
      selectedCountry,
    });

    this.updateTransferFeesDetail(fees);

    return getMinumumFee(sendingAmount, feeSets, selectedCountry);
  };

  updateTransferFeesDetail = (transferFeesDetail) => {
    this.setState(() => ({ transferFeesDetail }));
  };

  getMinTxnAmount = (currency) => {
    const { feeSets, selectedCountry } = staticSelector.select(this.props);

    return getMinFeeSetAmount(feeSets, selectedCountry, currency);
  };

  setErrorState = (
    input,
    errorMessage = i18n.t('validation.This field cannot be empty')
  ) => {
    this.setState(() => {
      return { [`${input}Error`]: errorMessage };
    });

    return false;
  };

  unsetErrorState = (input) => {
    this.setState((state) => {
      return (state[`${input}Error`] = null);
    });

    return true;
  };

  handleValidation = (input) => {
    const inputName = input.name;
    const { destinationCountries } = staticSelector.select(this.props);

    if (isInputEmpty(input)) {
      if (inputName === INPUT.COUNTRY_TEMP) {
        return this.setErrorState(INPUT.COUNTRY);
      }

      if (inputName === INPUT.SENDING_AMOUNT) {
        return this.setErrorState(
          INPUT.SENDING_AMOUNT,
          i18n.t('validation.Please insert a valid amount')
        );
      }

      if (inputName === INPUT.RECEIVING_AMOUNT) {
        return this.setErrorState(
          INPUT.RECEIVING_AMOUNT,
          i18n.t('validation.Please insert a valid amount')
        );
      }

      return this.setErrorState(inputName);
    }

    if (inputName === INPUT.COUNTRY || inputName === INPUT.COUNTRY_TEMP) {
      const country = destinationCountries.find(
        (country) => country.name === input.value
      );

      if (!country) {
        return this.setErrorState(INPUT.COUNTRY);
      }

      return this.unsetErrorState(INPUT.COUNTRY);
    }

    return true;
  };

 

  checkMaximumAndMinimumAmount = (txnAmount, currency) => {
    if (txnAmount < this.getMinTxnAmount(currency)) {
      return `${i18n.t(
        'validation.Minimum amount is $'
      )} ${this.getMinTxnAmount(currency)}`;
    }

    return false;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const paymentDetail = {};
    const { selectedCountry, storePaymentDetail } = staticSelector.select(
      this.props
    );

    const exchangeRate = this.getExchangeRateForSelectedDestination();

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];
      if (this.handleValidation(input)) {
        if (input.name === INPUT.COUNTRY_TEMP) {
          paymentDetail.country = input.value;
          continue;
        }

        paymentDetail[input.name] =
          input.name === INPUT.SENDING_AMOUNT ||
          input.name === INPUT.RECEIVING_AMOUNT
            ? parseFloat(input.value)
            : input.value;
      } else if (input.name && !isInputFocused) {
        input.focus();
        isFormValid = false;
        isInputFocused = true;
      }
    }

    if (isFormValid) {
      const grandTotal =
        paymentDetail.sendingAmount +
        this.getTransferFee(paymentDetail.sendingAmount);

      paymentDetail.totalAmount = Math.round(grandTotal * 100) / 100;
      paymentDetail.exchangeRate = exchangeRate && exchangeRate.rate;
      paymentDetail.destinationCountry = selectedCountry.threeCharCode;
      paymentDetail.transactionFee = this.getTransferFee(
        paymentDetail.sendingAmount
      );
      paymentDetail.receivingCurrency = this.state.currency;

      await storePaymentDetail(paymentDetail);
      securedLS.set('paymentDetail', paymentDetail);

    

      history.push(ROUTES.SENDER_REGISTRATION_ON_FLOW);
    }
  };

  getPaymentDetails = () => {};

  getExchangeRateMessage = () => {
    const exchangeRate = this.getExchangeRateForSelectedDestination();

    return (
      exchangeRate &&
      `1 ${exchangeRate.sourceCurrency} = ${exchangeRate.rate} ${exchangeRate.destinationCurrency}`
    );
  };

  getExchangeRateForSelectedDestination = () => {
    const { exchangeRates } = staticSelector.select(this.props);
    const { currency } = this.state;

    const exchangeRate = exchangeRates.find((exchangeRate) => {
      return (
        exchangeRate.sourceCurrency === 'USD' &&
        exchangeRate.destinationCurrency === currency
      );
    });

   

    return exchangeRate || 0;
  };

  updateTempCountry = (country) => {
    return this.setState(() => {
      return {
        tempCountry: country,
      };
    });
  };

  render() {
    const {
      currency,
      transferFee,
      tempCountry,
      countryError,
      sendingAmount,
      receivingAmount,
      transferFeesDetail,
      sendingAmountError,
      receivingAmountError,
    } = this.state;

    const {
      t,
      selectedCountry,
      isAuthenticated,
      toggleLoginModal,

      destinationCountries,
      isSavingPaymentDetail,
      isAccountDeleteRequested,
    } = staticSelector.select(this.props);

    return (
      <div className="pb-3">
        <PageHead title={PAGE.PAYMENT_DETAILS} />
        <Navbar currentStep={1} />
        <section className="container">
          <div className="row justify-content-center my-5">
            <div className="col-lg-5 col-md-8 mb-4 home-calculator">
              <h1 className="h3 bold text-primary">
                {t('payment.Enter the send amount')}
              </h1>
              <div
                className={`country-selector ${
                  countryError ? 'is-invalid' : ''
                }`}
              >
                <BeneficiaryCountrySelector
                  countries={destinationCountries}
                  handleValidation={this.handleValidation}
                  updateTempCountry={this.updateTempCountry}
                  calculateSendingAmount={this.updateSendingAmount}
                />
              </div>

              <form autoComplete="off" onSubmit={(e) => this.handleSubmit(e)}>
                {/* This is hack for ingoring autocomplete  */}
                <input
                  type="hidden"
                  value={tempCountry}
                  name={INPUT.COUNTRY_TEMP}
                />
                <CurrencyConverter
                  currency={currency}
                  transferFee={transferFee}
                  sendingAmount={sendingAmount}
                  isAuthenticated={isAuthenticated}
                  receivingAmount={receivingAmount}
                  selectedCountry={selectedCountry}
                  transferFeesDetail={transferFeesDetail}
                  sendingAmountError={sendingAmountError}
                  handleValidation={this.handleValidation}
                  receivingAmountError={receivingAmountError}
                  updateSendingAmount={this.updateSendingAmount}
                  handleCurrencyChange={this.handleCurrencyChange}
                  isSenderLimitExceeded={false}
                  getExchangeRateMessage={this.getExchangeRateMessage}
                />

                <button
                  className="btn btn-lg btn-block btn-green cursor-pointer"
                  disabled={
                    isSavingPaymentDetail ||
                    this.state.receivingAmountError ||
                    this.state.sendingAmountError ||
                    isAccountDeleteRequested
                  }
                >
                  {t('button.Continue to Next Step')}
                </button>
              </form>

              {!isAuthenticated && (
                <p className="text-center p-3">
                  {t('auth.Already have an account')}?{' '}
                  <button
                    onClick={toggleLoginModal}
                    className="border-0 btn-link p-0 m-0 bold cursor-pointer text-blue"
                  >
                    {t('auth.Sign in now')}
                  </button>
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

PaymentDetails.propTypes = {
  t: PropTypes.func,
  currency: PropTypes.string,
  history: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  selectedCountry: PropTypes.object,

  feeSets: PropTypes.array,
  getFeeRange: PropTypes.func,
  getExchangeRate: PropTypes.func,

  isSavingPaymentDetail: PropTypes.bool,
  storePaymentDetail: PropTypes.func,

  error: PropTypes.string,
  authLogin: PropTypes.func,
  destinationCountries: PropTypes.array,
  isLoggingIn: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  isSigningOut: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
  isAccountDeleteRequested: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    // data
    error: state.auth.error
      ? getReduxState(['auth', 'error', 'message'], state)
      : null,
    feeSets: getReduxState(['payment', 'feeSets'], state),
    exchangeRates: getReduxState(['payment', 'exchangeRates'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),

    destinationCountries: getReduxState(
      ['home', 'destinationCountries'],
      state
    ),

    // UI
    isSavingPaymentDetail: getReduxState(
      ['payment', 'isSavingPaymentDetail'],
      state
    ),
    isModalOpen: getReduxState(['auth', 'isModalOpen'], state),
    isLoggingIn: getReduxState(['auth', 'isLoggingIn'], state),
    isSigningOut: getReduxState(['auth', 'isSigningOut'], state),
    isAuthenticated: getReduxState(['auth', 'isAuthenticated'], state),

    isAccountDeleteRequested: getReduxState(
      ['auth', 'isAccountDeleteRequested'],
      state
    ),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      authLogin,
      getFeeRange,
      getSenderInfo,
      getExchangeRate,
      toggleLoginModal,
      storePaymentDetail,
    },
    dispatch
  );

export const PaymentDetailsView = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(PaymentDetails);
