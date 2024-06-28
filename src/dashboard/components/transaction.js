import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import {
  isEmpty,
  getIconFor,
  getLocalDate,
  toLocalDateTime,
  isPaymentMethodCard,
} from 'utils';
import {
  DELIVERY_STATUS,
  FILTERED_STATUS,
  TRANSACTION_STATUS,
} from 'dashboard';
import { PAYOUT_METHOD, COUNTRY, THREE_DS_STATUS } from 'app';
import sl from 'components/selector/selector';
import { showCancelButton } from './transaction-row';

const getTextClassName = (status) => {
  const css = {
    [DELIVERY_STATUS.HOLD]: 'text-danger',
    [DELIVERY_STATUS.PENDING]: 'text-primary',
    [DELIVERY_STATUS.DELIVERED]: 'text-success',
    [DELIVERY_STATUS.DELIVERY_FAILED]: 'text-danger',
    [FILTERED_STATUS.READY_FOR_PAYOUT]: 'text-success',
    [DELIVERY_STATUS.DELIVERY_REQUESTED]: 'text-warning',
    [TRANSACTION_STATUS.PROCESSED]: 'text-success',
    [DELIVERY_STATUS.DELIVERY_PAYOUT_READY]: 'text-success',
    [TRANSACTION_STATUS.INITIATED]: 'text-primary',
    [FILTERED_STATUS.CANCELED]: 'text-danger',
  };

  return css[status] || '';
};

const getIconClassName = (status) => {
  const icons = {
    [DELIVERY_STATUS.HOLD]: 'dot bg-danger',
    [DELIVERY_STATUS.PENDING]: 'dot bg-primary',
    [DELIVERY_STATUS.DELIVERED]: 'dot bg-success',
    [FILTERED_STATUS.CANCELED]: 'dot bg-danger',
    [FILTERED_STATUS.READY_FOR_PAYOUT]: 'dot bg-success',
    [DELIVERY_STATUS.DELIVERY_REQUESTED]: 'dot bg-warning',
    [TRANSACTION_STATUS.PROCESSED]: 'dot bg-success',
    [DELIVERY_STATUS.DELIVERY_PAYOUT_READY]: 'dot bg-success',
    [TRANSACTION_STATUS.INITIATED]: 'dot bg-primary',
  };

  return icons[status] || '';
};

const Transaction = (props) => {
  const { t } = useTranslation();

  const [active, setActive] = useState([]);
  const [bankNames, setBankNames] = useState({});
  const [isOverViewOpen, setIsOverViewOpen] = useState(true);

  const {
    transactions,
    cancelTransaction,
    getSenderBanks,

    openThreeDSWidget,
    isThreeDSEnabled,
  } = staticSelector.select(props);

  const showThreeDSIcon = (transaction) => {
    return (
      !isEmpty(transaction.threeDSStatus) &&
      isThreeDSEnabled &&
      isPaymentMethodCard(transaction.fundingSource) &&
      transaction.status !== TRANSACTION_STATUS.CANCELED &&
      transaction.threeDSStatus !== THREE_DS_STATUS.SUBMITTED &&
      transaction.threeDSStatus !== THREE_DS_STATUS.VERIFIED &&
      transaction.threeDSStatus !== THREE_DS_STATUS.FAILED
    );
  };

  const showDetails = (id) => {
    if (active.includes(id)) {
      const activeIds = active.filter((activeId) => activeId !== id);

      return setActive(activeIds);
    }

    setActive([id, ...active]);
    setIsOverViewOpen(true);
  };

  useEffect(() => {
    const fetchBankNames = async () => {
      const banks = await getSenderBanks();

      const namesMap = banks.reduce((acc, bank) => {
        acc[bank.id] = bank.institutionName;

        return acc;
      }, {});

      setBankNames(namesMap);
    };

    fetchBankNames();
  }, [getSenderBanks]);

  const getSenderBankName = (bankId) => bankNames[bankId] || 'N/A';

  return (
    <>
      {transactions.map((transaction, key) => {
        return (
          <div key={key}>
            <div
              onClick={() => showDetails(transaction.referenceId)}
              className={`d-flex transaction-row align-items-center justify-content-between border-top py-3 px-2 cursor-pointer ${
                showThreeDSIcon(transaction)
                  ? 'alert alert-danger rounded-0 m-0'
                  : ''
              }`}
            >
              <div className="d-flex align-items-center">
                {showThreeDSIcon(transaction) ? (
                  <div className="threeDS-dashboard d-none d-md-block mr-3">
                    <i className="icon ion-md-alert overlay-icon"></i>
                  </div>
                ) : (
                  <div
                    className="fundingsource-icon mr-3 d-none d-md-block"
                    title={PAYOUT_METHOD[transaction.payoutMethod]}
                  >
                    <i
                      className={`icon ion-md-${getIconFor(
                        PAYOUT_METHOD[transaction.payoutMethod]
                      )}`}
                    />
                  </div>
                )}
                <div>
                  <div className="d-flex align-items-center">
                    <p className="text-muted small">
                      {transaction.referenceNumber}
                    </p>
                  </div>
                  <p className="bold">
                    Fund transfer to {transaction.beneficiary.fullName}
                  </p>
                  <p className="text-muted small">
                    {toLocalDateTime(transaction.createdAt).split(',')[0]}
                  </p>
                  {showThreeDSIcon(transaction) && (
                    <div className="d-flex align-items-start">
                      <div className="mt-1">
                        {t(
                          'validation.Additional verification is needed to proceed with your transaction'
                        )}
                      </div>
                      <button
                        className="btn btn-sm btn-danger ml-2"
                        onClick={() =>
                          openThreeDSWidget(transaction.referenceId)
                        }
                      >
                        <i className="icon ion-md-refresh mr-1 mt-1"></i>
                        {t('sender.verify')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div>
                  <p className="bold lead text-right d-none d-md-block">
                    {transaction.senderAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    <strong className="ml-1 text-muted">USD</strong>
                  </p>
                  <p className="bold text-right d-block d-md-none">
                    {transaction.senderAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    <strong className="ml-1 text-muted">USD</strong>
                  </p>
                  <p className="small text-right">
                    {
                      <span
                        className={getTextClassName(transaction.deliveryStatus)}
                      >
                        <span
                          className={getIconClassName(
                            transaction.deliveryStatus
                          )}
                        />
                        {transaction.deliveryStatus.replaceAll('_', ' ')}
                      </span>
                    }
                  </p>
                </div>
                <p className="d-none d-md-block">
                  <i
                    className={`icon ion-ios-${
                      active.includes(transaction.referenceId)
                        ? 'arrow-up'
                        : 'arrow-down'
                    } lead bold ml-3`}
                  />
                </p>
              </div>
            </div>

            <div
              className={`transaction-detail col-md-12 border mb-3 pb-4 px-0 row m-0 
            ${active.includes(transaction.referenceId) ? 'show' : 'hide'}
            `}
            >
              <div className="col-md-12 p-0">
                <ul className="transaction-navbar nav nav-tabs pt-2">
                  <li
                    className="nav-item ml-2"
                    onClick={() => setIsOverViewOpen(true)}
                  >
                    <a
                      className={`nav-link ${
                        isOverViewOpen && 'active'
                      } cursor-pointer`}
                    >
                      Overview
                    </a>
                  </li>
                </ul>
              </div>
              {isOverViewOpen && (
                <>
                  <div className="col-md-6 p-3">
                    <div className="d-flex justify-content-between w-100">
                      <p className="text-muted small">Send Amount</p>
                      <p>
                        <strong>
                          {transaction.senderAmount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          USD
                        </strong>
                      </p>
                    </div>

                    <div className="d-flex justify-content-between">
                      <p className="text-muted small">Transaction Fee</p>
                      <p>
                        <strong>
                          {transaction.feeAmount.toLocaleString()} USD
                        </strong>
                      </p>
                    </div>

                    <div className="d-flex justify-content-between">
                      <p className="text-muted small">Total amount debited</p>
                      <p className="bold text-danger">
                        {(
                          transaction.senderAmount + transaction.feeAmount
                        ).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        USD
                      </p>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <p className="text-muted small">Exchange Rate</p>
                      <p>
                        <strong>
                          1 USD = {transaction.exchangeRate.toLocaleString()}{' '}
                          {transaction.recipientCurrency}
                        </strong>
                      </p>
                    </div>

                    <div className="d-flex justify-content-between">
                      <p className="text-muted small">
                        <strong>{transaction.beneficiary.fullName}</strong> will
                        receive
                      </p>
                      <p className="bold text-danger">
                        {transaction.recipientAmount.toLocaleString()}{' '}
                        {transaction.recipientCurrency}
                      </p>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <p className="text-muted small">Transaction Status</p>
                      <p className={`${getTextClassName(transaction.status)}`}>
                        <span
                          className={getIconClassName(transaction.status)}
                        />
                        <strong>{transaction.status}</strong>
                      </p>
                    </div>

                    <div className="d-flex justify-content-between">
                      <p className="text-muted small">Delivery Status</p>
                      <p
                        className={`${getTextClassName(
                          transaction.deliveryStatus
                        )}`}
                      >
                        <span
                          className={getIconClassName(
                            transaction.deliveryStatus
                          )}
                        />
                        <strong>
                          {transaction.deliveryStatus.replaceAll('_', ' ')}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="offset-md-1 col-md-5 p-3">
                    <p className="text-muted small">Receiver</p>
                    <p className="">
                      <strong>{transaction.beneficiary.fullName}</strong>
                    </p>
                    <p className="text-muted">
                      {transaction.beneficiary.address.state},{' '}
                      {COUNTRY[transaction.beneficiary.address.country]}
                    </p>

                    {PAYOUT_METHOD.BANK_DEPOSIT ===
                      PAYOUT_METHOD[transaction.payoutMethod] && (
                      <>
                        <div className="mt-3">
                          <p className="text-muted mt-3 small">
                            Receiver Bank Account
                          </p>
                          <p>
                            <strong>
                              {transaction.beneficiary.bank.bankName}
                            </strong>
                          </p>
                          <p className="text-muted">
                            {transaction.beneficiary.bank.accountNumber}
                          </p>
                        </div>
                      </>
                    )}

                    {PAYOUT_METHOD.WALLET ===
                      PAYOUT_METHOD[transaction.payoutMethod] && (
                      <>
                        <div className="mt-3">
                          <p className="text-muted mt-3">Mobile Wallet</p>
                          <p>
                            <strong>
                              {
                                transaction.beneficiary.wallet
                                  .identificationValue
                              }
                            </strong>
                          </p>
                        </div>
                      </>
                    )}

                    {PAYOUT_METHOD.CASH_PICKUP ===
                      PAYOUT_METHOD[transaction.payoutMethod] && (
                      <>
                        <div className="mt-3">
                          <p className="text-muted mt-3 small">Cash Pickup</p>
                          <p>
                            <span className="text-muted mr-1 small">
                              Payer Name:
                            </span>
                            <strong>
                              {transaction.beneficiary.payer.name}
                            </strong>
                          </p>
                          {transaction.beneficiary.payer.phoneNumber && (
                            <p>
                              <span className="text-muted mr-1 small">
                                Phone Number:
                              </span>
                              <strong>
                                {transaction.beneficiary.payer.phoneNumber}
                              </strong>
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="col-md-12 d-flex justify-content-end mt-5">
                    <button
                      title={t('button.Cancel Transaction')}
                      onClick={() => cancelTransaction(transaction.referenceId)}
                      className="btn btn-md btn-outline-danger px-3 py-1 ml-2"
                      disabled={!showCancelButton(transaction)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
              {!isOverViewOpen && (
                <div className="col-md-12 mt-5">
                  <div className="col-12 d-flex align-items-center p-0">
                    <h6 className="col-2 d-flex align-items-center p-0 pl-4 transaction-history text-muted m-0">
                      {getLocalDate(transaction.createdAt)}
                    </h6>
                    <div className="col-8 ml-4 pl-4 transaction-history-bottom">
                      <p className="text-success">
                        +${transaction.senderAmount.toFixed(2)}
                      </p>
                      <p>
                        Account funding via{' '}
                        <span className="bold">
                          {getSenderBankName(
                            transaction.senderFundingSourceAccountId
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="col-12 d-flex align-items-center pt-3 p-0">
                    <h6 className="col-2 d-flex align-items-center transaction-history text-muted m-0 p-0 pl-4">
                      {getLocalDate(transaction.createdAt)}
                    </h6>
                    <div className=" col-8 ml-4 pl-4 transaction-history-up p-0">
                      <p className="text-danger">
                        -${transaction.senderAmount.toFixed(2)}
                      </p>
                      <p>
                        Transfer to{' '}
                        <span className="bold">
                          {transaction.beneficiary.fullName}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

const staticSelector = sl.object({
  showInvoice: sl.func(),
  getSenderBanks: sl.func(),
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
      receiptNumber: sl.string(''),
      threeDSStatus: sl.string(''),
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
          phoneNumber: sl.string('N/A'),
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
});

Transaction.propTypes = {
  transactions: PropTypes.array,
  showInvoice: PropTypes.func,
  cancelTransaction: PropTypes.func,
  getSenderBanks: PropTypes.func,
  showTransactionInvoice: PropTypes.func,
  isThreeDSEnabled: PropTypes.bool,
};

export default Transaction;
