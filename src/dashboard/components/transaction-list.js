import i18next from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation, useTranslation } from 'react-i18next';

import { cancelTransaction } from 'dashboard';
import Transaction from 'dashboard/components/transaction';
import { TRANSACTION_PAGING } from 'dashboard/dashboard.constant';

import sl from 'components/selector/selector';
import PopupAlert from 'components/form/popup-alert';
import toast from 'components/form/toast-message-container';
import BlinkTextLoader from 'components/form/blink-loader-text';

import { getReduxState } from 'utils';
import { isCurrentPath } from 'utils/routes-helper';

import { ROUTES } from 'app';
import { storePaymentDetail, getSenderBanks } from 'payment';
import { saveSelectedCountry, getDestinationCountry } from 'landing-page';

class Transactions extends Component {
  state = {
    filter: {
      transStatus: null,
      deliveryStatus: null,
    },
    transactionId: null,
    isConfirmBoxOpen: false,
  };

  componentDidMount = () => {
    const { destinationCountries, getDestinationCountry } =
      staticSelector.select(this.props);

    if (!destinationCountries.length) {
      getDestinationCountry();
    }

    this.getFilteredTransactions(true);
  };

  showTransactionInvoice = async (transactionId) => {
    const { toggleWidgetModal } = staticSelector.select(this.props);

    await this.setState(() => {
      return {
        transactionId,
      };
    });

    toggleWidgetModal();
  };

  cancelTransaction = async () => {
    const { cancelTransaction } = staticSelector.select(this.props);

    const isTxnCanceled = await cancelTransaction(this.state.transactionId);

    if (isTxnCanceled) {
      toast.success(
        i18next.t('dashboard.Your transaction has been canceled successfully')
      );

      this.getFilteredTransactions(true);
    } else {
      toast.error(i18next.t('dashboard.Transaction cannot be canceled'));
    }

    return true;
  };

  toggleConfirmationBox = (referenceId = null) => {
    this.setState((state) => {
      return {
        transactionId: referenceId,
        isConfirmBoxOpen: !state.isConfirmBoxOpen,
      };
    });
  };

  getFilteredTransactions = (isInitialPage = false) => {
    const { paging } = staticSelector.select(this.props);
    const { page, pageSize } = paging;
    const filter = {
      page: isInitialPage ? TRANSACTION_PAGING.PAGE : page + 1,
      pageSize,
    };
    const { transStatus, deliveryStatus } = this.state.filter;

    if (deliveryStatus) {
      filter.deliveryStatus = deliveryStatus;
    }
    if (transStatus) {
      filter.transStatus = transStatus;
    }
  };

  isTotalTransactionViewed = () => {
    const { paging } = staticSelector.select(this.props);
    const { page, pageSize, totalCount } = paging;
    const actualPage = page + 1;

    return actualPage * pageSize >= totalCount;
  };

  fetchTransactionList = (isAdditionalPage = false) => {
    const { paging } = staticSelector.select(this.props);
    const { page, pageSize } = paging;
    const { transStatus, deliveryStatus } = this.state.filter;
    const filter = { page: isAdditionalPage ? page + 1 : page, pageSize };

    if (deliveryStatus) {
      filter.deliveryStatus = deliveryStatus;
    }
    if (transStatus) {
      filter.transStatus = transStatus;
    }
  };

  openThreeDSWidget = async (transactionId) => {
    const { toggleWidgetModal } = staticSelector.select(this.props);

    await this.setState(() => {
      return {
        transactionId,
      };
    });

    toggleWidgetModal();
  };

  render() {
    const {
      t,
      transactions,
      getSenderBanks,
      openThreeDSWidget,
      isThreeDSEnabled,
      isFetchingTransaction,
      isCancelingTransaction,
      showTransactionInvoice,
      isFetchingFilteredTransaction,
    } = staticSelector.select(this.props);

    const lastFiveTransactions = transactions && transactions.slice(0, 5);

    return (
      <section className="container-fluid p-0 bg-white mt-2">
        {isFetchingTransaction || isFetchingFilteredTransaction ? (
          <BlinkTextLoader
            margin={5}
            align="left"
            message={t('dashboard.Fetching transactions')}
          />
        ) : transactions.length ? (
          <React.Fragment>
            {isCurrentPath(ROUTES.DASHBOARD) ? (
              <React.Fragment>
                <p className="bold lead mt-4 mb-2">Recent Transactions</p>
                <Transaction
                  transactions={lastFiveTransactions}
                  getSenderBanks={getSenderBanks}
                  showTransactionInvoice={showTransactionInvoice}
                  cancelTransaction={this.toggleConfirmationBox}
                  openThreeDSWidget={openThreeDSWidget}
                  isThreeDSEnabled={isThreeDSEnabled}
                />

                <PopupAlert
                  title={t('dashboard.Are you sure?')}
                  message={t(
                    'dashboard.Do you really want to cancel this transaction?'
                  )}
                  className="danger"
                  alert={this.state.isConfirmBoxOpen}
                  asyncAction={this.cancelTransaction}
                  isTakingAction={isCancelingTransaction}
                  toggleConfirmationBox={this.toggleConfirmationBox}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="container d-flex justify-content-between align-items-center flex-wrap">
                  <p className="bold lead mt-4 mb-2">Transactions</p>
                  <div className="right clearfix mt-3">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => toast.info('Coming soon!!!')}
                    >
                      {t('button.Statement')}
                      <i className="my-2">
                        <img
                          src={require('assets/img/download.svg').default}
                          className="h1 font-weight-bold m-0 ml-2"
                          alt="lock"
                        />
                      </i>
                    </button>
                  </div>
                </div>

                <Transaction
                  transactions={transactions}
                  getSenderBanks={getSenderBanks}
                  showTransactionInvoice={showTransactionInvoice}
                  cancelTransaction={this.toggleConfirmationBox}
                  openThreeDSWidget={openThreeDSWidget}
                  isThreeDSEnabled={isThreeDSEnabled}
                />

                <PopupAlert
                  title={t('dashboard.Are you sure?')}
                  message={t(
                    'dashboard.Do you really want to cancel this transaction?'
                  )}
                  className="danger"
                  alert={this.state.isConfirmBoxOpen}
                  asyncAction={this.cancelTransaction}
                  isTakingAction={isCancelingTransaction}
                  toggleConfirmationBox={this.toggleConfirmationBox}
                />

                <div className="bg-light border-top text-center">
                  <button
                    className="btn btn-link btn-sm p-2 text-muted"
                    onClick={() => this.fetchTransactionList(true)}
                    disabled={this.isTotalTransactionViewed()}
                  >
                    {t('dashboard.Show next 20 transactions')}{' '}
                    <i className="icon ion-md-dropdown" />
                  </button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <NoTransactions />
        )}
      </section>
    );
  }
}

const staticSelector = sl.object({
  t: sl.func(),
  cancelTransaction: sl.func(),

  showTransactionInvoice: sl.func(),
  openThreeDSWidget: sl.func(),
  isThreeDSEnabled: sl.boolean(false),

  transactions: sl.list(
    sl.object({
      status: sl.string(''),
      remarks: sl.string(''),
      feeAmount: sl.number(),
      createdAt: sl.string(''),
      senderAmount: sl.number(),
      exchangeRate: sl.number(),
      payoutMethod: sl.string(),
      referenceId: sl.string(''),
      recipientAmount: sl.number(),
      threeDSStatus: sl.string(''),
      receiptNumber: sl.string(''),
      fundingSource: sl.string(''),
      scheduled: sl.boolean(false),
      deliveryStatus: sl.string(''),
      referenceNumber: sl.string(''),
      remittancePurpose: sl.string(''),
      recipientCurrency: sl.string(''),
      senderFundingSourceAccountId: sl.string(''),
      beneficiary: sl.object({
        fullName: sl.string(''),
        referenceId: sl.string(''),
        address: sl.object({
          city: sl.string(''),
          state: sl.string(''),
          country: sl.string(''),
          postalCode: sl.string(''),
          addressLine2: sl.string(''),
          addressLine1: sl.string(''),
        }),
        bank: sl.object({
          bankName: sl.string(''),
          referenceId: sl.string(''),
          accountType: sl.string(''),
          accountNumber: sl.string(''),
        }),
        payer: sl.object({
          name: sl.string(''),
          code: sl.string(''),
          website: sl.string(''),
          country: sl.string(''),
          address: sl.string(''),
          referenceId: sl.number(),
          phoneNumber: sl.string(''),
          receivingCurrency: sl.string(''),
        }),
        wallet: sl.object({
          identificationType: sl.string(''),
          identificationValue: sl.string(''),
          referenceId: sl.string(''),
        }),
      }),
    })
  ),
  paging: sl.object({
    page: sl.number(TRANSACTION_PAGING.PAGE),
    pageSize: sl.number(TRANSACTION_PAGING.PAGE_SIZE),
    totalCount: sl.number(TRANSACTION_PAGING.TOTAL_COUNT),
  }),

  destinationCountries: sl.list(
    sl.object({
      flagUrl: sl.string(''),
      name: sl.string(''),
      phoneCode: sl.string(''),
      twoCharCode: sl.string(''),
      threeCharCode: sl.string(''),
      currency: sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      }),
    })
  ),
  getDestinationCountry: sl.func(),
  saveSelectedCountry: sl.func(),
  toggleWidgetModal: sl.func(),
  storePaymentDetail: sl.func(),
  getSenderBanks: sl.func(),

  isFetchingTransaction: sl.boolean(false),
  isCancelingTransaction: sl.boolean(false),

  isFetchingFilteredTransaction: sl.boolean(false),
});

Transactions.propTypes = {
  t: PropTypes.func,
  destinationCountries: PropTypes.array,
  transactions: PropTypes.array,
  cancelTransaction: PropTypes.func,
  getDestinationCountry: PropTypes.func,

  paging: PropTypes.object,
  getSenderBanks: PropTypes.func,

  toggleWidgetModal: PropTypes.func,
  storePaymentDetail: PropTypes.func,
  isCancelingTransaction: PropTypes.bool,
  isFetchingFilteredTransaction: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    isFetchingTransaction: getReduxState(
      ['dashboard', 'isFetchingTransaction'],
      state
    ),
    isFetchingFilteredTransaction: getReduxState(
      ['dashboard', 'isFetchingFilteredTransaction'],
      state
    ),

    destinationCountries: getReduxState(
      ['home', 'destinationCountries'],
      state
    ),
    paging: getReduxState(['dashboard', 'transactionPaging'], state),
    transactions: getReduxState(['dashboard', 'transactions'], state),
    isCancelingTransaction: getReduxState(
      ['dashboard', 'isCancelingTransaction'],
      state
    ),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      cancelTransaction,

      getSenderBanks,
      storePaymentDetail,
      saveSelectedCountry,
      getDestinationCountry,
    },
    dispatch
  );

const NoTransactions = () => {
  const { t } = useTranslation();

  return (
    <section className="container-fluid p-0">
      <div className="table-section border-top p-3 bg-light">
        <div className="row">
          <div className="col-12 my-5 text-center">
            <i className="icon ion-md-timer h1 text-muted my-5" />
            <p className="h2">{t('dashboard.No transactions')}</p>
            <p>
              {t(
                'dashboard.You currently have no transactions Once you make a transfer, it will show up here'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const TransactionList = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Transactions));

export default TransactionList;
