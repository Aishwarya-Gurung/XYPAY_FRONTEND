import React from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import {
  getPayerList,
  getBeneficiaryList,
  getBeneficiaryBanks,
} from 'beneficiary';
import AddBeneficiaryBankForm from 'beneficiary/components/add-beneficiary-bank';
import AddBeneficiaryPayerForm from 'beneficiary/components/add-beneficiary-payer';
import AddBeneficiaryWalletForm from 'beneficiary/components/add-beneficiary-wallet';

import sl from 'components/selector/selector';
import Navbar from 'components/layout/navbar';
import { PageHead } from 'components/layout/page-head';
import toast from 'components/form/toast-message-container';

import { storePaymentDetail } from 'payment';
import PaymentSideReceipt from 'payment/components/payment-side-receipt';

import { getReduxState } from 'utils';
import { history, PAGE, ROUTES, PAYOUT_METHOD } from 'app';

class CreateBeneficiaryPayoutMethod extends React.Component {
  componentDidMount = () => {
    const {
      getPayerList,
      paymentDetail,
      selectedCountry,
      getBeneficiaryBanks,
    } = staticSelector.select(this.props);
    const currency = paymentDetail.receivingCurrency
      ? paymentDetail.receivingCurrency
      : selectedCountry.currency[0].code;

    if (!selectedCountry.threeCharCode) {
      toast.error(i18n.t('validation.Destination country is not selected'));

      return history.push(ROUTES.PAYMENT_DETAILS);
    }

    getBeneficiaryBanks(selectedCountry.threeCharCode, currency);
    getPayerList(selectedCountry.threeCharCode);
  };

  handleAddBeneficiaryBankSuccess = (bankReferenceId, remittancePurpose) => {
    const { location } = staticSelector.select(this.props);

    const beneficiaryDetails = {
      bankId: bankReferenceId,
      beneficiaryId: location.state.beneficiaryId,
      payoutMethod: PAYOUT_METHOD.BANK_DEPOSIT,
      remittancePurpose,
    };

    return this.directToNextStep(beneficiaryDetails);
  };

  handleAddBeneficiaryWalletSuccess = (walletReferenceId) => {
    const { location } = staticSelector.select(this.props);

    const beneficiaryDetails = {
      walletId: walletReferenceId,
      payoutMethod: PAYOUT_METHOD.WALLET,
      beneficiaryId: location.state.beneficiaryId,
    };

    return this.directToNextStep(beneficiaryDetails);
  };

  directToNextStep = async (beneficiaryDetails) => {
    const { getBeneficiaryList, storePaymentDetail } = staticSelector.select(
      this.props
    );

    await getBeneficiaryList();
    await storePaymentDetail(beneficiaryDetails);

    return history.push(ROUTES.PAYMENT_INFORMATION);
  };

  render() {
    const { t, location } = staticSelector.select(this.props);
    const { beneficiaryId, payoutMethod } = location.state;

    return (
      <div className="page">
        <PageHead title={PAGE.ADD_BENEFICIARY} />
        <Navbar currentStep={3} />
        <section className="container">
          <div className="row justify-content-between my-5">
            <div className="col-12 mb-4">
              <h1 className="h2 bold text-primary">
                {t('beneficiary.Beneficiary Details')}
              </h1>
            </div>

            <div className="col-md-8 col-lg-6">
              {payoutMethod === PAYOUT_METHOD.BANK_DEPOSIT && (
                <AddBeneficiaryBankForm
                  beneficiaryId={beneficiaryId}
                  handleAddBeneficiaryBankSuccess={
                    this.handleAddBeneficiaryBankSuccess
                  }
                />
              )}

              {payoutMethod === PAYOUT_METHOD.CASH_PICKUP && (
                <AddBeneficiaryPayerForm
                  payoutMethod={payoutMethod}
                  beneficiaryId={beneficiaryId}
                />
              )}

              {payoutMethod === PAYOUT_METHOD.WALLET && (
                <AddBeneficiaryWalletForm
                  beneficiaryId={beneficiaryId}
                  handleAddBeneficiaryWalletSuccess={
                    this.handleAddBeneficiaryWalletSuccess
                  }
                />
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

CreateBeneficiaryPayoutMethod.propTypes = {
  sl: PropTypes.func,
  location: PropTypes.object,
  getPayerList: PropTypes.func,
  getBeneficiaryList: PropTypes.func,
  getBeneficiaryBanks: PropTypes.func,
  storePaymentDetail: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  selectedCountry: sl.object({
    name: sl.string(''),
    flagUrl: sl.string(''),
    phoneCode: sl.string(''),
    twoCharCode: sl.string(''),
    threeCharCode: sl.string(''),
    currency: sl.list(
      sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      })
    ),
    payoutMethod: sl.object({
      isCashPickupEnabled: sl.boolean(false),
      isBankDepositEnabled: sl.boolean(false),
      isMobileWalletEnabled: sl.boolean(false),
      isHomeDeliveryEnabled: sl.boolean(false),
    }),
  }),
  location: sl.object({
    state: sl.object({
      beneficiaryId: sl.string(''),
      payoutMethod: sl.string(''),
    }),
  }),
  paymentDetail: sl.object({
    exchangeRate: sl.number(),
    sendingAmount: sl.number(),
    receivingCurrency: sl.string(''),
    paymentCurrency: sl.string('USD'),
  }),

  getPayerList: sl.func(),
  getBeneficiaryList: sl.func(),
  getBeneficiaryBanks: sl.func(),
  storePaymentDetail: sl.func(),
});

const mapStateToProps = (state) => {
  return {
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getPayerList,
      getBeneficiaryList,
      storePaymentDetail,
      getBeneficiaryBanks,
    },
    dispatch
  );

export const CreateBeneficiaryPayoutMethodView = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(CreateBeneficiaryPayoutMethod);
