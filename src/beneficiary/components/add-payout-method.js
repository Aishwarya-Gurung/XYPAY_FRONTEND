import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import {
  resetError,
  getBeneficiaryList,
  addBeneficiaryBank,
  addBeneficiaryWallet,
  getBeneficiaryBanks,
  getBeneficiaryBanksByCountry,
} from 'beneficiary';
import CashPickup from 'beneficiary/components/cash-pickup';
import BankDeposit from 'beneficiary/components/bank-deposit';
import MobileWallet from 'beneficiary/components/mobile-wallet';

import { PAYOUT_METHOD } from 'app';
import { getReduxState } from 'utils';
import sl from 'components/selector/selector';

class PayoutMethod extends Component {
  state = {
    currentPayoutMethod: null,
  };

  componentDidMount = () => {
    const { beneficiaryCountry, getBeneficiaryBanksByCountry } =
      staticSelector.select(this.props);

    getBeneficiaryBanksByCountry(beneficiaryCountry);
  };

  updatePayoutMethod = (receiveMethod) => {
    const { resetError } = staticSelector.select(this.props);

    resetError();
    this.setState(() => {
      return {
        currentPayoutMethod: receiveMethod,
      };
    });
  };

  updateBeneficiaryList = async (beneficiaryDetails) => {
    if (beneficiaryDetails) {
      const { getBeneficiaryList } = staticSelector.select(this.props);

      await getBeneficiaryList();
    }
  };

  getSelectedBeneficiaryCountryDetails = () => {
    const { beneficiaryCountry, destinationCountries } = staticSelector.select(
      this.props
    );

    return destinationCountries.find(
      (country) => country.threeCharCode === beneficiaryCountry
    );
  };

  render() {
    const {
      t,
      beneficiaryId,
      beneficiaryBanks,
      addBeneficiaryBank,
      addBeneficiaryWallet,
      isAddingPayoutMethod,
      closeAddPayoutMethodModal,
    } = staticSelector.select(this.props);

    const selectedBeneficiaryCountry =
      this.getSelectedBeneficiaryCountryDetails();

    const { isBankDepositEnabled, isMobileWalletEnabled, isCashPickupEnabled } =
      selectedBeneficiaryCountry.payoutMethod;

    return (
      <div className="col-md-12">
        <h5 className="bold text-primary mt-2">
          <i className="icon ion-md-paper-plane"></i>{' '}
          {t('beneficiary.Add new payout method')}
        </h5>

        {isMobileWalletEnabled && (
          <MobileWallet
            beneficiaryId={beneficiaryId}
            addWallet={addBeneficiaryWallet}
            isCurrentPayoutMethod={
              this.state.currentPayoutMethod === PAYOUT_METHOD.WALLET
            }
            isAddingWallet={isAddingPayoutMethod}
            cancelAddWallet={closeAddPayoutMethodModal}
            selectedCountry={selectedBeneficiaryCountry}
            updateBeneficiaryDetails={this.updateBeneficiaryList}
            updatePayoutMethod={this.updatePayoutMethod}
          />
        )}

        {isBankDepositEnabled && (
          <BankDeposit
            beneficiaryId={beneficiaryId}
            addBank={addBeneficiaryBank}
            beneficiaryBanks={beneficiaryBanks}
            selectedCountry={selectedBeneficiaryCountry}
            isCurrentPayoutMethod={
              this.state.currentPayoutMethod === PAYOUT_METHOD.BANK_DEPOSIT
            }
            cancelAddBank={closeAddPayoutMethodModal}
            isAddingBank={isAddingPayoutMethod}
            updateBeneficiaryDetails={this.updateBeneficiaryList}
            updatePayoutMethod={this.updatePayoutMethod}
          />
        )}

        {isCashPickupEnabled && (
          <CashPickup
            updatePayoutMethod={this.updatePayoutMethod}
            beneficiaryCountry={selectedBeneficiaryCountry}
            closeAddPayoutMethodModal={closeAddPayoutMethodModal}
            isCurrentPayoutMethod={
              this.state.currentPayoutMethod === PAYOUT_METHOD.CASH_PICKUP
            }
          />
        )}

        {/* <HomeDelivery
          beneficiaryId={beneficiaryId}
          updatePayoutMethod={this.updatePayoutMethod}
          isCurrentPayoutMethod={
            this.state.currentPayoutMethod ===
            PAYOUT_METHOD.HOME_DELIVERY
          }
        /> */}
      </div>
    );
  }
}

PayoutMethod.propTypes = {
  t: PropTypes.func,
  resetError: PropTypes.func,
  location: PropTypes.object,
  beneficiaryId: PropTypes.string,
  beneficiaryBanks: PropTypes.array,
  selectedCountry: PropTypes.object,
  addBeneficiaryBank: PropTypes.func,
  getBeneficiaryBanks: PropTypes.func,
  isAddingPayoutMethod: PropTypes.bool,
  addBeneficiaryWallet: PropTypes.func,
  beneficiaryCountry: PropTypes.string,
  closeAddPayoutMethodModal: PropTypes.func,
  getBeneficiaryBanksByCountry: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  beneficiaryCountry: sl.string(''),

  beneficiaryBanks: sl.list(
    sl.object({
      id: sl.number(0),
      name: sl.string(''),
      currency: sl.string(''),
      referenceId: sl.number(0),
    })
  ),
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
  destinationCountries: sl.list(
    sl.object({
      name: sl.string(''),
      phoneCode: sl.string(''),
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
    })
  ),
  paymentDetail: sl.object({
    exchangeRate: sl.number(0),
    sendingAmount: sl.number(0),
    receivingCurrency: sl.string(''),
    paymentCurrency: sl.string('USD'),
  }),
  resetError: sl.func(),
  beneficiaryId: sl.string(''),
  getBeneficiaryList: sl.func(),
  addBeneficiaryBank: sl.func(),
  getBeneficiaryBanks: sl.func(),
  addBeneficiaryWallet: sl.func(),
  closeAddPayoutMethodModal: sl.func(),
  isAddingPayoutMethod: sl.boolean(false),
  getBeneficiaryBanksByCountry: sl.func(),
});

const mapStateToProps = (state) => {
  return {
    isAddingPayoutMethod: getReduxState(
      ['beneficiary', 'isAddingPayoutMethod'],
      state
    ),
    beneficiaryBanks: getReduxState(['beneficiary', 'beneficiaryBanks'], state),
    destinationCountries: getReduxState(
      ['home', 'destinationCountries'],
      state
    ),
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
      getBeneficiaryBanksByCountry,
    },
    dispatch
  );

const AddPayoutMethod = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PayoutMethod));

export default AddPayoutMethod;
