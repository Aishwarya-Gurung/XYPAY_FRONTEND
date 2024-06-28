/* eslint-disable indent */
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation, withTranslation } from 'react-i18next';

import {
  getPayerList,
  getBeneficiaryList,
  beneficiaryDetailsMapper,
} from 'beneficiary';
import BeneficiarySelector from 'beneficiary/components/beneficiary-selector';
import { isPayoutCurrencyAvailable } from 'beneficiary/beneficiary.helper.js';
import BeneficiaryBankSelector from 'beneficiary/components/beneficiary-bank-selector';
import CashPickupPayerSelector from 'beneficiary/components/cash-pickup-payer-selector';
import BeneficiaryWalletSelector from 'beneficiary/components/beneficiary-wallet-selector';

import Navbar from 'components/layout/navbar';
import { PageHead } from 'components/layout/page-head';
import BlinkTextLoader from 'components/form/blink-loader-text';
import { ErrorMessage } from 'components/form/toast-message-container';
import RemittancePurposeSelector from 'components/form/remittance-purpose-selector';

import { getExchangeRate, storePaymentDetail } from 'payment';
import PaymentSideReceipt from 'payment/components/payment-side-receipt';

import { history, PAGE, ROUTES, TXN_AMOUNT, PAYOUT_METHOD } from 'app';
import { isInputEmpty, getReduxState, setIsInvalidField } from 'utils';

import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

let bankRef = null;
let walletRef = null;

class BeneficiaryDetails extends Component {
  state = {
    beneficiary: {},
    payoutMethod: null,
    selectedBank: {},
    selectedWallet: null,
    selectedPayer: {},
    beneficiaryBankList: [],
    beneficiaryWalletList: [],

    bankIdError: null,
    payerIdError: null,
    walletIdError: null,
    beneficiaryIdError: null,
    remittancePurposeError: null,
  };

  componentDidMount = async () => {
    const {
      payers,
      getPayerList,
      paymentDetail,
      exchangeRates,
      selectedCountry,
      getExchangeRate,

      getBeneficiaryList,
    } = beneficiaryDetailsMapper.select(this.props);

    if (exchangeRates.length <= 0) {
      await getExchangeRate();
    }

    await getBeneficiaryList();

    await getPayerList(selectedCountry.threeCharCode);

    if (isPayoutCurrencyAvailable(paymentDetail.receivingCurrency)) {
      this.updatePayoutMethod(
        paymentDetail.payoutMethod || PAYOUT_METHOD.WALLET
      );
    } else {
      this.updatePayoutMethod(
        paymentDetail.payoutMethod || PAYOUT_METHOD.BANK_DEPOSIT
      );
    }

    if (
      (paymentDetail.payerId ||
        paymentDetail.bankId ||
        paymentDetail.walletId) &&
      paymentDetail.beneficiaryId &&
      paymentDetail.payoutMethod
    ) {
      this.updateSelectedBeneficiary(
        paymentDetail.beneficiaryId,
        paymentDetail.payoutMethod
      );

      if (paymentDetail.payoutMethod === PAYOUT_METHOD.BANK_DEPOSIT) {
        return this.updateSelectedBank(paymentDetail.bankId);
      }

      if (paymentDetail.payoutMethod === PAYOUT_METHOD.WALLET) {
        return this.updateSelectedWallet(paymentDetail.walletId);
      }

      if (paymentDetail.payoutMethod === PAYOUT_METHOD.CASH_PICKUP) {
        const isPayerAvailable = !!payers.find(
          ({ name, receivingCurrency }) =>
            receivingCurrency === paymentDetail.receivingCurrency &&
            paymentDetail.payerBankName.trim() === name.trim()
        );

        if (isPayerAvailable) {
          return this.updateSelectedPayer(
            paymentDetail.payerId,
            paymentDetail.payerBankName
          );
        }

        return this.setState(() => ({
          payerIdError: '',
        }));
      }
    }
  };

  setErrorState = (
    input,
    errorMessage = i18n.t('validation.This field cannot be empty')
  ) => {
    if (errorMessage !== '') {
      setIsInvalidField(input);
    }

    this.setState(() => ({ [`${input.name}Error`]: errorMessage }));

    return false;
  };

  handleSubmit = async (e, sendingAmount) => {
    e.preventDefault();
    let input = null,
      isFormValid = true,
      isInputFocused = false;
    const beneficiary = {};
    const { storePaymentDetail } = beneficiaryDetailsMapper.select(this.props);

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];

      if (!input.disabled && input.name) {
        if (this.handleValidation(input)) {
          if (input.value) {
            beneficiary[input.name] =
              input.name === 'payerId' ? parseInt(input.value) : input.value;
          }
        } else if (!isInputFocused) {
          input.focus();
          isFormValid = false;
          isInputFocused = true;
        }
      }
    }

    if (
      !Object.keys(this.state.beneficiary).length <= 0 &&
      !this.beneficiaryHasPayoutMethods()
    ) {
      isFormValid = false;

      return toast.error(
        <ErrorMessage
          message={i18n.t(
            'validation.Selected beneficiary has no payout method'
          )}
        />
      );
    }

    if (
      this.state.payoutMethod === PAYOUT_METHOD.WALLET &&
      !this.isSendingAmountValid(sendingAmount)
    ) {
      isFormValid = false;

      return toast.error(
        <ErrorMessage
          message={i18n.t(
            'validation.Sending amount limit is $700 for wallet transaction'
          )}
        />
      );
    }

    if (isFormValid) {
      const { payoutMethod } = this.state;

      const isBeneficiarySaved = await storePaymentDetail({
        ...beneficiary,
        payoutMethod,
      });

      if (isBeneficiarySaved) {
        return history.push(ROUTES.PAYMENT_INFORMATION);
      }
    }
  };

  isSendingAmountValid = (sendingAmount) => {
    return sendingAmount <= TXN_AMOUNT.MAX_WALLET_SENDING_AMT;
  };

  beneficiaryHasPayoutMethods = () => {
    const { beneficiary, beneficiaryBankList, beneficiaryWalletList } =
      this.state;

    return (
      beneficiaryBankList.length ||
      beneficiaryWalletList.length ||
      beneficiary.isCashPickupEnabled
    );
  };

  handleValidation = (input) => {
    if (isInputEmpty(input)) {
      return this.setErrorState(input);
    }

    this.setErrorState(input, '');

    return true;
  };

  updateBankListState = (beneficiary) => {
    // resets bank select box once new beneficiary is selected from list
    if (bankRef) {
      bankRef.selectedIndex = 0;
    }

    if (Object.keys(beneficiary).length) {
      const { paymentDetail } = beneficiaryDetailsMapper.select(this.props);
      const beneficiaryBankList =
        beneficiary.banks.filter(
          (bank) => bank.currency === paymentDetail.receivingCurrency
        ) || [];

      return {
        beneficiaryBankList,
        selectedBank:
          beneficiaryBankList.length === 1 ? beneficiaryBankList[0] : {},
      };
    }

    return { selectedBank: {}, beneficiaryBankList: [] };
  };

  updateWalletListState = (beneficiary) => {
    // resets wallet select box once new beneficiary is selected from list
    if (walletRef) {
      walletRef.selectedIndex = 0;
    }

    if (Object.keys(beneficiary).length) {
      const beneficiaryWalletList = beneficiary.wallets || [];

      return {
        beneficiaryWalletList,
        selectedWallet:
          beneficiaryWalletList.length === 1 ? beneficiaryWalletList[0] : {},
      };
    }

    return { beneficiaryWalletList: [] };
  };

  updateSelectedBank = (bankReferenceId) => {
    return this.setState(() => ({
      bankIdError: null,
      selectedBank: this.getBankDetails(bankReferenceId),
    }));
  };

  updateSelectedWallet = (walletReferenceId) => {
    return this.setState(() => ({
      selectedWallet: this.getWalletDetails(walletReferenceId),
    }));
  };

  updateSelectedPayer = (payerId, payerBankName) => {
    const selectedPayer = this.getPayerDetails(payerId, payerBankName);

    return this.setState(() => ({
      selectedPayer,
      payerIdError: '',
    }));
  };

  findExchangeRate = (destinationCurrency) => {
    const { exchangeRates, paymentDetail } = beneficiaryDetailsMapper.select(
      this.props
    );

    const exchangeRate =
      exchangeRates.find(
        (exchangeRate) =>
          exchangeRate.sourceCurrency === paymentDetail.paymentCurrency &&
          exchangeRate.destinationCurrency === destinationCurrency
      ) || {};

    if (Object.keys(exchangeRate).length) {
      return exchangeRate.rate;
    }

    return paymentDetail.exchangeRate;
  };

  updatePayoutMethod = (payoutMethod) => {
    return this.setState(() => ({ payoutMethod: payoutMethod }));
  };

  updateSelectedBeneficiary = (referenceId, currentPayoutMethod) => {
    const { beneficiaries } = beneficiaryDetailsMapper.select(this.props);
    const beneficiary =
      beneficiaries.find(
        (beneficiary) => beneficiary.referenceId === referenceId
      ) || {};
    const { banks, wallets } = beneficiary;

    const updatedBankStates = this.updateBankListState(beneficiary);
    const updatedWalletStates = this.updateWalletListState(beneficiary);
    const payoutMethod = this.getSelectedPayoutMethod(
      { banks, wallets, isCashPickupEnabled: beneficiary.isCashPickupEnabled },
      currentPayoutMethod
    );

    return this.setState(() => ({
      beneficiary,
      payoutMethod,
      ...updatedBankStates,
      ...updatedWalletStates,
    }));
  };

  getSelectedPayoutMethod = (currentBeneficiaryDetail, currentPayoutMethod) => {
    const { paymentDetail } = beneficiaryDetailsMapper.select(this.props);
    const { wallets, banks, isCashPickupEnabled } = currentBeneficiaryDetail;

    if (isPayoutCurrencyAvailable(paymentDetail.receivingCurrency)) {
      if (wallets.length) {
        return currentPayoutMethod || PAYOUT_METHOD.WALLET;
      }
      if (banks.length) {
        return currentPayoutMethod || PAYOUT_METHOD.BANK_DEPOSIT;
      }
    } else {
      if (banks.length) {
        return currentPayoutMethod === PAYOUT_METHOD.WALLET
          ? PAYOUT_METHOD.BANK_DEPOSIT
          : currentPayoutMethod || PAYOUT_METHOD.BANK_DEPOSIT;
      }
    }

    if (isCashPickupEnabled) {
      return PAYOUT_METHOD.CASH_PICKUP;
    }

    return null;
  };

  getBankDetails = (bankReferenceId) => {
    return this.state.beneficiaryBankList.find(
      (bank) => bank.referenceId === bankReferenceId
    );
  };

  getWalletDetails = (walletReferenceId) => {
    return (
      this.state.beneficiaryWalletList.find(
        (wallet) => wallet.referenceId === walletReferenceId
      ) || {}
    );
  };

  getPayerDetails = (payerId, payerBankName) => {
    const { payers } = beneficiaryDetailsMapper.select(this.props);

    return (
      payers.find(
        (payer) =>
          payer.referenceId === parseInt(payerId) &&
          payer.name === payerBankName
      ) || {}
    );
  };

  getBankListRef = (ref) => {
    return (bankRef = ref.current ? ref.current : null);
  };

  getWalletListRef = (ref) => {
    return (walletRef = ref.current ? ref.current : null);
  };

  getPayer = () => {
    const { payers, paymentDetail } = beneficiaryDetailsMapper.select(
      this.props
    );

    return (
      payers.filter(
        (payer) => payer.receivingCurrency === paymentDetail.receivingCurrency
      ) || {}
    );
  };

  render() {
    const {
      t,
      paymentDetail,
      beneficiaries,
      selectedCountry,
      isFetchingPayers,
      isSavingPaymentDetail,
      isBeneficiaryListFetched,
    } = beneficiaryDetailsMapper.select(this.props);

    const { isCashPickupEnabled, isBankDepositEnabled, isMobileWalletEnabled } =
      selectedCountry.payoutMethod;

    const {
      beneficiary,
      bankIdError,
      walletIdError,
      payoutMethod,
      payerIdError,
      selectedBank,
      selectedWallet,
      selectedPayer,
      beneficiaryIdError,
      beneficiaryBankList,
      beneficiaryWalletList,
      remittancePurposeError,
    } = this.state;

    if (isBeneficiaryListFetched && !beneficiaries.length) {
      if (!selectedCountry.threeCharCode) {
        toast.error(
          <ErrorMessage
            message={i18n.t('validation.Destination country is not selected')}
          />
        );

        return <Redirect to={ROUTES.PAYMENT_DETAILS} />;
      }

      return (
        <Redirect
          to={{
            pathname: ROUTES.BENEFICIARY_PAYOUT_METHOD_LIST,
            state: { isBeneficiaryAvailable: false },
          }}
        />
      );
    }

    return (
      <div className="page">
        <PageHead title={PAGE.BENEFICIARY_DETAILS} />
        <Navbar currentStep={3} />
        <section className="container">
          <div className="row justify-content-between my-5">
            <div className="col-12 mb-4">
              <h1 className="h2 bold text-primary">
                {t('beneficiary.Beneficiary Details')}
              </h1>
            </div>

            <div className="col-md-7 col-lg-6">
              {!isBeneficiaryListFetched ? (
                <BlinkTextLoader
                  align="left"
                  message={t(
                    'beneficiary.Loading your beneficiary details Please wait'
                  )}
                />
              ) : (
                <form
                  onSubmit={(e) =>
                    this.handleSubmit(e, paymentDetail.sendingAmount)
                  }
                  onBlur={(e) => this.handleValidation(e.target)}
                >
                  <BeneficiarySelector
                    beneficiaries={beneficiaries}
                    selectedBeneficiary={beneficiary}
                    beneficiaryIdError={beneficiaryIdError}
                    updateSelectedBeneficiary={this.updateSelectedBeneficiary}
                  />
                  {(beneficiary.isCashPickupEnabled ||
                    beneficiaryBankList.length > 0 ||
                    beneficiaryWalletList.length > 0) && (
                    <div className="d-flex justify-content-between mb-2 mt-3">
                      <p className="bold p-0 mb-1">
                        {t('beneficiary.Select Payout Method')}
                      </p>
                    </div>
                  )}
                  {beneficiary.referenceId && (
                    <div className="col-md-12 text-center mb-3 mt-3 text-muted p-0 clearfix">
                      {isMobileWalletEnabled &&
                        isPayoutCurrencyAvailable(
                          paymentDetail.receivingCurrency
                        ) && (
                          <PayoutMethodSelector
                            icon="phone-portrait"
                            name={PAYOUT_METHOD.WALLET}
                            currentPayoutMethod={payoutMethod}
                            updatePayoutMethod={this.updatePayoutMethod}
                          />
                        )}
                      {isBankDepositEnabled && (
                        <PayoutMethodSelector
                          icon="business"
                          name={PAYOUT_METHOD.BANK_DEPOSIT}
                          currentPayoutMethod={payoutMethod}
                          updatePayoutMethod={this.updatePayoutMethod}
                        />
                      )}
                      {isCashPickupEnabled && (
                        <PayoutMethodSelector
                          icon="cash"
                          name={PAYOUT_METHOD.CASH_PICKUP}
                          currentPayoutMethod={payoutMethod}
                          updatePayoutMethod={this.updatePayoutMethod}
                        />
                      )}
                    </div>
                  )}

                  {isBankDepositEnabled &&
                    (beneficiary.referenceId || paymentDetail.beneficiaryId) &&
                    payoutMethod === PAYOUT_METHOD.BANK_DEPOSIT && (
                      <BeneficiaryBankSelector
                        beneficiary={beneficiary}
                        bankIdError={bankIdError}
                        selectedBank={selectedBank}
                        passBankListRef={this.getBankListRef}
                        beneficiaryBankList={beneficiaryBankList}
                        updateSelectedBank={this.updateSelectedBank}
                      />
                    )}

                  {(beneficiary.referenceId || paymentDetail.beneficiaryId) &&
                    payoutMethod === PAYOUT_METHOD.CASH_PICKUP && (
                      <CashPickupPayerSelector
                        payers={this.getPayer()}
                        beneficiary={beneficiary}
                        payerIdError={payerIdError}
                        selectedPayer={selectedPayer}
                        isFetchingPayers={isFetchingPayers}
                        updateSelectedPayer={this.updateSelectedPayer}
                      />
                    )}

                  {(beneficiary.referenceId || paymentDetail.beneficiaryId) &&
                    payoutMethod === PAYOUT_METHOD.WALLET &&
                    isPayoutCurrencyAvailable(
                      paymentDetail.receivingCurrency
                    ) && (
                      <BeneficiaryWalletSelector
                        beneficiary={beneficiary}
                        walletIdError={walletIdError}
                        paymentDetail={paymentDetail}
                        selectedWallet={selectedWallet}
                        sendingAmount={paymentDetail.sendingAmount}
                        passWalletListRef={this.getWalletListRef}
                        beneficiaryWalletList={beneficiaryWalletList}
                        updateSelectedWallet={this.updateSelectedWallet}
                      />
                    )}
                  <RemittancePurposeSelector
                    defaultValue={paymentDetail.remittancePurpose}
                    remittancePurposeError={remittancePurposeError}
                  />

                  <div className=" mt-3">
                    <Link
                      to={ROUTES.PAYMENT_DETAILS}
                      title={t('button.Previous Step')}
                      className="btn btn-lg btn-default mr-1"
                    >
                      <i className="icon ion-md-arrow-round-back"></i>{' '}
                    </Link>
                    <button className="btn btn-lg btn-green">
                      {isSavingPaymentDetail && <WhiteSpinner />}
                      {t('button.Continue to Next Step')}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="col-md-5 col-lg-4">
              <PaymentSideReceipt />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const PayoutMethodSelector = (props) => {
  const { t } = useTranslation();
  const { name, currentPayoutMethod, updatePayoutMethod, icon } = props;

  return (
    <div
      className={`col-md-4 p-0 float-left mb-2 mb-md-0 clearfix 
      ${name === currentPayoutMethod && 'active-payout-method'}`}
    >
      <div
        title={t(`beneficiary.${name}`)}
        onClick={() => updatePayoutMethod(name)}
        className="shake float-left payout-method-selector mr-2 cursor-pointer"
      >
        <i className={`h4 icon ion-md-${icon} d-inline-block`} />
      </div>
      <div
        onClick={() => updatePayoutMethod(name)}
        className="float-left bold title pt-3 cursor-pointer"
      >
        {t(`beneficiary.${name}`)}
      </div>
    </div>
  );
};

PayoutMethodSelector.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  updatePayoutMethod: PropTypes.func,
  currentPayoutMethod: PropTypes.string,
};

BeneficiaryDetails.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  beneficiaries: PropTypes.array,
  paymentDetail: PropTypes.object,
  isFetchingPayers: PropTypes.bool,

  getBeneficiaryList: PropTypes.func,

  storeBeneficiaryDetails: PropTypes.func,
  isSavingPaymentDetail: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const allBeneficiaries = getReduxState(
    ['beneficiary', 'beneficiaries'],
    state
  );
  const selectedCountry = getReduxState(['home', 'selectedCountry'], state);
  const beneficiaries = allBeneficiaries.filter(
    (beneficiary) =>
      beneficiary.address.country === selectedCountry.threeCharCode
  );

  return {
    beneficiaries,
    selectedCountry,
    isSavingPaymentDetail: getReduxState(
      ['payment', 'isSavingPaymentDetail'],
      state
    ),

    isBeneficiaryListFetched: getReduxState(
      ['beneficiary', 'isBeneficiaryListFetched'],
      state
    ),

    payers: getReduxState(['beneficiary', 'payers'], state),
    exchangeRates: getReduxState(['payment', 'exchangeRates'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
    isFetchingPayers: getReduxState(['beneficiary', 'isFetchingPayers'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getPayerList,
      getExchangeRate,
      storePaymentDetail,
      getBeneficiaryList,
    },
    dispatch
  );

export const BeneficiaryDetailsView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(BeneficiaryDetails));
