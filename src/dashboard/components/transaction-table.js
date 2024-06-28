import i18next from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation, useTranslation } from 'react-i18next';

import { ROUTES } from 'app';
import { PAGING } from 'app/app.constant';

import Table from 'components/form/table';
import sl from 'components/selector/selector';
import {
  ErrorMessage,
  SuccessMessage,
} from 'components/form/toast-message-container';
import PopupAlert from 'components/form/popup-alert';
import BlinkTextLoader from 'components/form/blink-loader-text';

import { cancelTransaction } from 'dashboard';
import TransactionRow from 'dashboard/components/transaction-row';

import { getReduxState } from 'utils';

import { storePaymentDetail } from 'payment';
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

    await cancelTransaction(this.state.transactionId).then((res) => {
      if (res) {
        this.transactionCanceled();
        this.getFilteredTransactions(true);
      } else {
        this.transactionNotCanceled();
      }
    });

    return true;
  };

  transactionCanceled = () => {
    toast.success(
      <SuccessMessage
        message={i18next.t(
          'dashboard.Your transaction has been canceled successfully'
        )}
      />
    );
  };

  transactionNotCanceled = () => {
    toast.error(
      <ErrorMessage
        message={i18next.t('dashboard.Transaction cannot be canceled')}
      />
    );
  };

  toggleConfirmationBox = (referenceId = null) => {
    this.setState((state) => {
      return {
        transactionId: referenceId,
        isConfirmBoxOpen: !state.isConfirmBoxOpen,
      };
    });
  };

  getFilteredTransactions = async (isInitialPage = false) => {
    const { paging } = staticSelector.select(this.props);
    const { page, pageSize } = paging;
    const filter = {
      page: isInitialPage ? PAGING.PAGE : page + 1,
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

  setFilter = (e) => {
    const { name, value } = e.target;

    this.setState(
      {
        filter: {
          ...this.state.filter,
          [name]: value,
        },
      },
      () => this.getFilteredTransactions()
    );
  };

  render() {
    const {
      t,
      transactions,
      storePaymentDetail,
      saveSelectedCountry,
      destinationCountries,
      isFetchingTransaction,
      isCancelingTransaction,
      showTransactionInvoice,
      isFetchingFilteredTransaction,
    } = staticSelector.select(this.props);

    const columnNames = [
      t('dashboard.Date'),
      t('dashboard.Receipt Number'),
      t('dashboard.Beneficiary'),
      t('dashboard.Amount'),
      t('dashboard.Transaction Status'),
      t('dashboard.Delivery Status'),
      t('dashboard.Service Requested'),
      t('dashboard.Actions'),
    ];

    return (
      <section className="container-fluid p-0">
        <div className="table-section border-top p-3 bg-light">
          <div className="row">
            <div className="col-12 col-lg-6 col-md-6 mb-3 mb-md-0">
              <h4 className="m-0">{t('dashboard.My Recent Transactions')}</h4>
            </div>
            {/* For now we will not show filter */}
            {/* <FilterTransaction setFilter={this.setFilter} /> */}
          </div>
        </div>
        {isFetchingTransaction || isFetchingFilteredTransaction ? (
          <BlinkTextLoader
            margin={5}
            message={t('dashboard.Fetching transactions')}
          />
        ) : transactions.length ? (
          <React.Fragment>
            <div className="table-wrapper">
              <Table columnNames={columnNames}>
                <TransactionRow
                  transactions={transactions}
                  cancelTransaction={this.toggleConfirmationBox}
                  showTransactionInvoice={showTransactionInvoice}
                  countries={destinationCountries}
                  storePaymentDetail={storePaymentDetail}
                  saveSelectedCountry={saveSelectedCountry}
                />
              </Table>
              <PopupAlert
                title={t('dashboard.Are you sure?')}
                message={t(
                  'dashboard.Do you really want to cancel this transaction?'
                )}
                className={'info'}
                alert={this.state.isConfirmBoxOpen}
                asyncAction={this.cancelTransaction}
                isTakingAction={isCancelingTransaction}
                toggleConfirmationBox={this.toggleConfirmationBox}
              />
            </div>

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
      fundingSource: sl.string(''),
      receiptNumber: sl.string(''),
      recipientAmount: sl.number(),
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
          currency: sl.string(''),
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
    page: sl.number(PAGING.PAGE),
    pageSize: sl.number(PAGING.PAGE_SIZE),
    totalCount: sl.number(PAGING.TOTAL_COUNT),
  }),

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
    })
  ),
  getDestinationCountry: sl.func(),
  saveSelectedCountry: sl.func(),

  toggleWidgetModal: sl.func(),
  storePaymentDetail: sl.func(),

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
      getDestinationCountry,

      storePaymentDetail,
      saveSelectedCountry,
    },
    dispatch
  );

const TransactionTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Transactions));

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

            <Link to={ROUTES.PAYMENT_DETAILS} className="btn btn-green btn-sm">
              {t('button.Send Money')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionTable;
