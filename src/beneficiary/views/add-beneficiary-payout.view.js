import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import { getReduxState } from 'utils';
import { PAGE, history, ROUTES, PAYOUT_METHOD } from 'app';

import {
  resetError,
  getBeneficiaryList,
  addBeneficiaryBank,
  getBeneficiaryBanks,
  addBeneficiaryWallet,
} from 'beneficiary';

import Navbar from 'components/layout/navbar';
import { PageHead } from 'components/layout/page-head';
import { storePaymentDetail } from 'payment/payment.action';
import BankDeposit from 'beneficiary/components/bank-deposit';
import MobileWallet from 'beneficiary/components/mobile-wallet';
import PaymentSideReceipt from 'payment/components/payment-side-receipt';

import sl from 'components/selector/selector';

class AddPayoutMethod extends Component {
  state = {
    currentPayoutMethod: null,
  };

  componentDidMount = () => {
    const { param } = staticSelector.select(this.props.location);
    const { selectedCountry, getBeneficiaryBanks, paymentDetail } =
      staticSelector.select(this.props);
    const currency = paymentDetail.receivingCurrency
      ? paymentDetail.receivingCurrency
      : selectedCountry.currency[0].code;

    this.updatePayoutMethod(param.payoutMethod);
    getBeneficiaryBanks(selectedCountry.threeCharCode, currency);
  };

  updatePayoutMethod = (pReceiveMethod) => {
    const { resetError } = staticSelector.select(this.props);

    resetError();
    this.setState(() => ({
      currentPayoutMethod: pReceiveMethod,
      paymentPayoutMethodError: null,
    }));
  };

  updateBeneficiaryDetails = async (beneficiaryDetails) => {
    const { getBeneficiaryList, storePaymentDetail } = staticSelector.select(
      this.props
    );

    await getBeneficiaryList();
    await storePaymentDetail(beneficiaryDetails);

    return history.push(ROUTES.PAYMENT_INFORMATION);
  };

  cancelAddPayoutMethod = () => {
    return history.push(ROUTES.BENEFICIARY_DETAILS);
  };

  render() {
    const {
      t,
      selectedCountry,
      beneficiaryBanks,
      addBeneficiaryBank,
      addBeneficiaryWallet,
      isAddingPayoutMethod,
    } = staticSelector.select(this.props);
    const { param } = staticSelector.select(this.props.location);

    const { isBankDepositEnabled, isMobileWalletEnabled } =
      selectedCountry.payoutMethod;

    if (!param.beneficiaryId) {
      history.push(ROUTES.BENEFICIARY_DETAILS);

      return null;
    }

    return (
      <div className="page">
        <PageHead title={PAGE.PAYOUT_METHOD} />
        <Navbar currentStep={3} />
        <section className="container">
          <div className="row justify-content-between my-5">
            <div className="col-12 mb-4">
              <h1 className="h2 bold text-primary">
                {t('beneficiary.Payout Method')}
              </h1>
            </div>
            <div className="col-md-8 col-lg-6">
              <p className="bold">{t('beneficiary.Add new payout method')}</p>
              {isMobileWalletEnabled && (
                <MobileWallet
                  beneficiaryId={param.beneficiaryId}
                  addWallet={addBeneficiaryWallet}
                  selectedCountry={selectedCountry}
                  isCurrentPayoutMethod={
                    this.state.currentPayoutMethod === PAYOUT_METHOD.WALLET
                  }
                  isAddingWallet={isAddingPayoutMethod}
                  cancelAddWallet={this.cancelAddPayoutMethod}
                  updateBeneficiaryDetails={this.updateBeneficiaryDetails}
                  updatePayoutMethod={this.updatePayoutMethod}
                />
              )}

              {isBankDepositEnabled && (
                <BankDeposit
                  addBank={addBeneficiaryBank}
                  beneficiaryBanks={beneficiaryBanks}
                  beneficiaryId={param.beneficiaryId}
                  isCurrentPayoutMethod={
                    this.state.currentPayoutMethod ===
                    PAYOUT_METHOD.BANK_DEPOSIT
                  }
                  isAddingBank={isAddingPayoutMethod}
                  cancelAddBank={this.cancelAddPayoutMethod}
                  updateBeneficiaryDetails={this.updateBeneficiaryDetails}
                  updatePayoutMethod={this.updatePayoutMethod}
                />
              )}

              {/* <HomeDelivery
                beneficiaryId={param.beneficiaryId}
                updatePayoutMethod={this.updatePayoutMethod}
                isCurrentPayoutMethod={
                  this.state.currentPayoutMethod ===
                  PAYOUT_METHOD.HOME_DELIVERY
                }
              /> */}
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

AddPayoutMethod.propTypes = {
  t: PropTypes.func,
  resetError: PropTypes.func,
  location: PropTypes.object,
  selectedCountry: PropTypes.object,
  beneficiaryBanks: PropTypes.array,
  getBeneficiaryList: PropTypes.func,
  addBeneficiaryBank: PropTypes.func,
  getBeneficiaryBanks: PropTypes.func,
  addBeneficiaryWallet: PropTypes.func,
  isAddingPayoutMethod: PropTypes.bool,
  storePaymentDetail: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  param: sl.object({
    payoutMethod: sl.string(''),
    beneficiaryId: sl.string(''),
  }),
  selectedCountry: sl.object({
    phoneCode: sl.string(''),
    threeCharCode: sl.string(''),
    payoutMethod: sl.object({
      isCashPickupEnabled: sl.boolean(false),
      isBankDepositEnabled: sl.boolean(false),
      isMobileWalletEnabled: sl.boolean(false),
      isHomeDeliveryEnabled: sl.boolean(false),
    }),
    currency: sl.list(
      sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      })
    ),
  }),

  beneficiaryBanks: sl.list(
    sl.object({
      id: sl.number(null),
      name: sl.string(''),
      referenceId: sl.number(null),
    })
  ),
  paymentDetail: sl.object({
    exchangeRate: sl.number(),
    sendingAmount: sl.number(),
    receivingCurrency: sl.string(''),
    paymentCurrency: sl.string('USD'),
  }),
  resetError: sl.func(),
  getBeneficiaryList: sl.func(),
  addBeneficiaryBank: sl.func(),
  getBeneficiaryBanks: sl.func(),
  addBeneficiaryWallet: sl.func(),
  storePaymentDetail: sl.func(),
  isAddingPayoutMethod: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    isAddingPayoutMethod: getReduxState(
      ['beneficiary', 'isAddingPayoutMethod'],
      state
    ),
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),
    beneficiaryBanks: getReduxState(['beneficiary', 'beneficiaryBanks'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      resetError,
      getBeneficiaryList,
      addBeneficiaryBank,
      getBeneficiaryBanks,
      addBeneficiaryWallet,
      storePaymentDetail,
    },
    dispatch
  );

export const AddPayoutMethodView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AddPayoutMethod));
