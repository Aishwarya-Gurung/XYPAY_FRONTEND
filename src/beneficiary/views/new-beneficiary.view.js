import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import { getReduxState } from 'utils';
import { ACCOUNT_MENU } from 'sender';
import sl from 'components/selector/selector';
import { getBeneficiaryBanks } from 'beneficiary';
import { getDestinationCountry } from 'landing-page';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';
import { ROUTES, PAGE, history, PAYOUT_METHOD } from 'app';
import AddBeneficiaryForm from 'beneficiary/components/add-beneficiary';
import { SuccessMessage } from 'components/form/toast-message-container';
import AddBeneficiaryBankForm from 'beneficiary/components/add-beneficiary-bank';
import AddBeneficiaryWalletForm from 'beneficiary/components/add-beneficiary-wallet';
import PayoutMethodSelector from 'beneficiary/components/beneficiary-payout-method-selector';
import BeneficiaryCountrySelector from 'components/form/beneficiary-country-selector';

class NewBeneficiary extends Component {
  state = {
    country: null,
    payoutMethod: null,
    beneficiaryId: null,
    isBeneficiaryFormOpen: false,
  };

  componentDidMount = () => {
    const { destinationCountries, getDestinationCountry } =
      staticSelector.select(this.props);

    if (!destinationCountries.length) {
      getDestinationCountry();
    }
  };

  handleAddBeneficiarySuccess = (beneficiaryId, beneficiaryCountry) => {
    const { payoutMethod } = this.state;

    this.setState(() => {
      return {
        beneficiaryId,
        country: beneficiaryCountry,
      };
    });

    switch (payoutMethod) {
      case PAYOUT_METHOD.CASH_PICKUP:
        return this.cashPickupEnabled();

      case PAYOUT_METHOD.HOME_DELIVERY:
        return this.homeDeliveryEnabled();

      default:
        return;
    }
  };

  cashPickupEnabled = () => {
    const { t } = staticSelector.select(this.props);

    toast.success(
      <SuccessMessage
        message={t(
          'beneficiary.Cash Pickup payout method has been enabled for this beneficiary'
        )}
      />
    );

    return history.push({
      pathname: ROUTES.BENEFICIARY_LIST,
    });
  };

  bankDepositEnabled = () => {
    const { t } = staticSelector.select(this.props);

    toast.success(
      <SuccessMessage
        message={t(
          'beneficiary.Bank Deposit payout method has been enabled for this beneficiary'
        )}
      />
    );
  };

  homeDeliveryEnabled = () => {
    const { t } = staticSelector.select(this.props);

    toast.success(
      <SuccessMessage
        message={t(
          'beneficiary.Home Delivery payout method has been enabled for this beneficiary'
        )}
      />
    );
  };

  handleAddBeneficiaryBankOrWalletSuccess = () => {
    return history.push({
      pathname: ROUTES.BENEFICIARY_LIST,
    });
  };

  updatePayoutMethod = (payoutMethod) => {
    this.setState(() => {
      return {
        payoutMethod,
      };
    });
  };

  openBeneficiaryForm = () => {
    this.setState(() => {
      return {
        isBeneficiaryFormOpen: true,
      };
    });
  };

  render() {
    const { country, payoutMethod, beneficiaryId, isBeneficiaryFormOpen } =
      this.state;
    const {
      t,
      selectedCountry,
      destinationCountries,
      paymentDetail: { receivingCurrency },
    } = staticSelector.select(this.props);

    return (
      <AccountLayout>
        <PageHead title={PAGE.ADD_BENEFICIARY} />
        <SidebarMenu
          menus={ACCOUNT_MENU}
          activeTab={ACCOUNT_MENU.BENEFICIARY}
        />
        <div className="col-md-9 p-0">
          <div className="col-md-12 p-0 float-left">
            <div className="col-md-12 mb-2 clearfix">
              <h4 className="bold text-primary float-left">
                <i className="icon ion-md-contacts"></i>{' '}
                {t('beneficiary.New Beneficiary')}
              </h4>
            </div>
            {!isBeneficiaryFormOpen && (
              <div className="col-md-8 clearfix">
                <div className="col-md-12 p-0 mb-2">
                  <div className="country-selector">
                    <BeneficiaryCountrySelector
                      countries={destinationCountries}
                      updatePayoutMethod={this.updatePayoutMethod}
                    />
                  </div>
                </div>

                {selectedCountry.name && (
                  <PayoutMethodSelector
                    payoutMethod={payoutMethod}
                    handleCancel={ROUTES.BENEFICIARY_LIST}
                    updatePayoutMethod={this.updatePayoutMethod}
                    handleAddBeneficiaryDetails={this.openBeneficiaryForm}
                  />
                )}
              </div>
            )}

            <div className="col-md-12 clearfix m-auto">
              <div className="col-md-8 p-0 pr-md-4 float-left">
                {isBeneficiaryFormOpen && !beneficiaryId && (
                  <AddBeneficiaryForm
                    receivingCurrency={receivingCurrency}
                    countries={destinationCountries}
                    payoutMethod={payoutMethod}
                    handleAddBeneficiarySuccess={
                      this.handleAddBeneficiarySuccess
                    }
                    handleCancel={ROUTES.BENEFICIARY_LIST}
                    redirectedFrom={ROUTES.SENDER_PROFILE}
                  />
                )}

                {beneficiaryId &&
                  payoutMethod === PAYOUT_METHOD.BANK_DEPOSIT && (
                    <AddBeneficiaryBankForm
                      country={country}
                      beneficiaryId={beneficiaryId}
                      handleAddBeneficiaryBankSuccess={
                        this.handleAddBeneficiaryBankOrWalletSuccess
                      }
                    />
                  )}

                {beneficiaryId && payoutMethod === PAYOUT_METHOD.WALLET && (
                  <AddBeneficiaryWalletForm
                    country={country}
                    beneficiaryId={beneficiaryId}
                    handleAddBeneficiaryWalletSuccess={
                      this.handleAddBeneficiaryBankOrWalletSuccess
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </AccountLayout>
    );
  }
}

NewBeneficiary.propTypes = {
  t: PropTypes.func,
  destinationCountries: PropTypes.array,
  getDestinationCountry: PropTypes.func,
  getBeneficiaryBanks: PropTypes.func,
  isBeneficiaryBankFetched: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  destinationCountries: sl.list(
    sl.object({
      flagUrl: sl.string(''),
      name: sl.string(''),
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
    })
  ),
  selectedCountry: sl.object({
    flagUrl: sl.string(''),
    name: sl.string(''),
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
  paymentDetail: sl.object({
    exchangeRate: sl.number(0),
    sendingAmount: sl.number(0),
    receivingCurrency: sl.string(''),
    paymentCurrency: sl.string('USD'),
  }),
  getBeneficiaryBanks: sl.func(),
  getDestinationCountry: sl.func(),
  isBeneficiaryBankFetched: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    isBeneficiaryBankFetched: getReduxState(
      ['beneficiary', 'isBeneficiaryBankFetched'],
      state
    ),
    destinationCountries: getReduxState(
      ['home', 'destinationCountries'],
      state
    ),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getDestinationCountry,
      getBeneficiaryBanks,
    },
    dispatch
  );

export const NewBeneficiaryView = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(NewBeneficiary));
