import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation, useTranslation } from 'react-i18next';

import { ACCOUNT_MENU, toggleWidgetModal } from 'sender';
import { UserProfile } from 'sender/components/user-profile';

import sl from 'components/selector/selector';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';

import TransactionList from 'dashboard/components/transaction-list';
import TransactionGlance from 'dashboard/components/transaction-glance';

import {
  getReduxState,
  abbreviateNumber,
  SEARCH_PARAMETER_COOKIES,
  getSearchParameterCookie,
  deleteSearchParameterCookie,
} from 'utils';
import { getSenderInfo } from 'auth';
import { getSenderBanks } from 'payment';
import { PAGE, PAYMENT_METHOD } from 'app';

class Dashboard extends Component {
  state = {
    invoice: '',
    widgetType: null,
    transactionId: null,
    isInvoiceModalOpen: false,
    threeDSStatus: '',
  };

  componentDidMount = () => {
    const { getSenderInfo } = staticSelector.select(this.props);

    getSenderInfo();
  };

  handleThreeDsEvent = (status) => {
    return this.setState({ threeDSStatus: status });
  };

  handleWidgetEvent = (paymentMethod) => {
    if (paymentMethod === PAYMENT_METHOD.BANK_ACCOUNT) {
      return this.setState({ expiredBanks: [] });
    }
  };

  render() {
    const {
      auth,
      referenceId,
      widgetToken,
      features,
      toggleWidgetModal,
      isWidgetModalOpen,
      transactionGlanceInfo,
      isFetchingTxnGlanceData,
    } = staticSelector.select(this.props);

    const { user, kycStatus, isKYCVerified, isEmailVerified, isPhoneVerified } =
      auth;

    return (
      <div className="page mb-5 pb-3">
        <PageHead title={PAGE.DASHBOARD} />
        <section className="container">
          <div className="row justify-space-between mt-5 mb-3">
            <SidebarMenu
              menus={ACCOUNT_MENU}
              activeTab={ACCOUNT_MENU.DASHBOARD}
            />

            <div className="col-md-9">
              <div className="col-md-12 border rounded">
                <div className="row">
                  <UserProfile
                    user={user}
                    kycStatus={kycStatus}
                    isKYCVerified={isKYCVerified}
                    isEmailVerified={isEmailVerified}
                    isPhoneVerified={isPhoneVerified}
                    openKYCWidget={this.openKYCWidget}
                  />
                  <div
                    className={`col-lg-6 ${
                      user.imageUrl && 'transaction-glance'
                    }`}
                  >
                    <TransactionGlance
                      isDataFetching={isFetchingTxnGlanceData}
                      totalTransactions={transactionGlanceInfo.transactionCount}
                      totalBeneficiaries={
                        transactionGlanceInfo.beneficiaryCount
                      }
                      totalSent={abbreviateNumber(
                        transactionGlanceInfo.amountSent
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* <TransactionTable
                showTransactionInvoice={this.showTransactionInvoiceModal}
              />
              <TransactionInvoiceModal
                invoice={invoice}
                isModalOpen={isInvoiceModalOpen}
                closeModal={() => {
                  this.setState({
                    isInvoiceModalOpen: false,
                    invoice: '',
                  });
                }}
              /> */}
              <TransactionList
                openThreeDSWidget={this.openThreeDSWidget}
                showTransactionInvoice={this.openInvoice}
                isThreeDSEnabled={features.isThreeDSEnabled}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const RequestedMessage = (props) => {
  const { t } = useTranslation();
  const { openKYCWidget } = props;

  return (
    <div className="alert alert-info">
      <p className="small mb-0">
        <i className="icon mr-2 ion-md-information-circle-outline" />
        {t(
          'dashboard.We require additional information from you to process your transaction'
        )}{' '}
        <span
          className="btn-link cursor-pointer"
          onClick={() => {
            openKYCWidget();
          }}
        >
          Please click here to submit.
        </span>
      </p>
    </div>
  );
};

const staticSelector = sl.object({
  t: sl.func(),
  auth: sl.object({
    user: sl.object({
      fullName: sl.string(),
      imageUrl: sl.string(),
      email: sl.string(),
      address: sl.object({
        state: sl.string(null),
        stateCode: sl.string(null),
        country: sl.string(null),
      }),
    }),
    kycStatus: sl.string(''),
    isKYCVerified: sl.boolean(false),
    isEmailVerified: sl.boolean(false),
    isPhoneVerified: sl.boolean(false),
  }),

  transactionGlanceInfo: sl.object({
    amountSent: sl.number(0),
    transactionCount: sl.number(null),
    beneficiaryCount: sl.number(null),
  }),
  getSenderInfo: sl.func(),
  widgetToken: sl.string(''),
  referenceId: sl.string(''),
  toggleWidgetModal: sl.func(),

  isWidgetModalOpen: sl.boolean(false),
  isFetchingTxnGlanceData: sl.boolean(false),
  getSenderBanks: sl.func(),
  transactions: sl.list(
    sl.object({
      status: sl.string(''),
      referenceId: sl.string(''),
      fundingSource: sl.string(''),
      receiptNumber: sl.string(''),
      threeDSStatus: sl.string(''),
      referenceNumber: sl.string(''),
    })
  ),
  features: sl.object({
    isThreeDSEnabled: sl.boolean(false),
  }),
});

Dashboard.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.object,
  kycStatus: PropTypes.string,
  widgetToken: PropTypes.string,
  getSenderInfo: PropTypes.func,
  referenceId: PropTypes.string,
  isWidgetModalOpen: PropTypes.bool,

  transactionGlanceInfo: PropTypes.object,
  isFetchingTxnGlanceData: PropTypes.bool,
  getSenderBanks: PropTypes.func,
  transaction: PropTypes.object,
  features: PropTypes.object,
};

RequestedMessage.propTypes = {
  openKYCWidget: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    auth: getReduxState(['auth'], state),
    transactionGlanceInfo: getReduxState(
      ['dashboard', 'transactionGlanceInfo'],
      state
    ),
    isFetchingTxnGlanceData: getReduxState(
      ['dashboard', 'isFetchingTxnGlanceData'],
      state
    ),
    referenceId: getReduxState(['sender', 'referenceId'], state),
    widgetToken: getReduxState(['sender', 'widgetToken'], state),
    isWidgetModalOpen: getReduxState(['sender', 'isWidgetModalOpen'], state),
    transactions: getReduxState(['dashboard', 'transactions'], state),
    features: getReduxState(['home', 'features'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getSenderInfo,
      toggleWidgetModal,

      getSenderBanks,
    },
    dispatch
  );

export const DashboardView = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
