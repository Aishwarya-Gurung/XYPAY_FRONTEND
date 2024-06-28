import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { PAYOUT_METHOD } from 'app';
import sl from 'components/selector/selector';
import { getIconFor, toLocalDateTime } from 'utils';
import { DELIVERY_STATUS, TRANSACTION_STATUS } from 'dashboard';

const getTextClassName = (status) => {
  switch (status) {
    case DELIVERY_STATUS.DELIVERED:
    case TRANSACTION_STATUS.COMPLETED:
    case TRANSACTION_STATUS.PROCESSED:
      return 'text-success';

    case DELIVERY_STATUS.READY_FOR_PAYOUT:
      return 'text-info';

    case DELIVERY_STATUS.HOLD:
    case DELIVERY_STATUS.PENDING:
    case TRANSACTION_STATUS.HOLD:
    case TRANSACTION_STATUS.PENDING:
    case TRANSACTION_STATUS.INITIATED:
      return 'text-mute';

    case DELIVERY_STATUS.DELIVERY_REQUESTED:
      return 'text-warning';

    case TRANSACTION_STATUS.FAILED:
    case TRANSACTION_STATUS.CANCELED:
    case TRANSACTION_STATUS.RETURNED:
    case TRANSACTION_STATUS.REFUNDED:
    case DELIVERY_STATUS.DELIVERY_FAILED:
      return 'text-danger';

    default:
      return;
  }
};

const getIconClassName = (status) => {
  switch (status) {
    case DELIVERY_STATUS.DELIVERED:
    case TRANSACTION_STATUS.COMPLETED:
    case TRANSACTION_STATUS.PROCESSED:
      return 'dot bg-success';

    case DELIVERY_STATUS.READY_FOR_PAYOUT:
      return 'dot bg-info';

    case DELIVERY_STATUS.HOLD:
    case DELIVERY_STATUS.PENDING:
    case TRANSACTION_STATUS.HOLD:
    case TRANSACTION_STATUS.PENDING:
    case TRANSACTION_STATUS.INITIATED:
      return 'dot bg-dark';

    case DELIVERY_STATUS.DELIVERY_REQUESTED:
      return 'dot bg-warning';

    case TRANSACTION_STATUS.FAILED:
    case TRANSACTION_STATUS.CANCELED:
    case TRANSACTION_STATUS.RETURNED:
    case TRANSACTION_STATUS.REFUNDED:
    case DELIVERY_STATUS.DELIVERY_FAILED:
      return 'dot bg-danger';

    default:
      return;
  }
};

// Might be needed in future
// const isTxnCancelable = (createdAt) => {
//   const today = new Date();
//   const txnCreatedAt = new Date(`${createdAt} UTC`);
//   // in minutes
//   const cancelationTime = process.env.REACT_APP_TXN_CANCELATION_TIME;
//   const cancelableDate = new Date(
//     txnCreatedAt.getTime() + cancelationTime * 60000
//   );
//   const diffInMillisecond = Math.abs(today - cancelableDate);

//   if (Math.floor(diffInMillisecond / 1000 / 60) < cancelationTime) {
//     return true;
//   }

//   return false;
// };

export const showCancelButton = (transaction) => {
  return (
    transaction.status !== TRANSACTION_STATUS.CANCELED &&
    transaction.status !== TRANSACTION_STATUS.REFUNDED &&
    transaction.status !== TRANSACTION_STATUS.RETURNED &&
    transaction.deliveryStatus !== DELIVERY_STATUS.DELIVERED
  );
};

// All these commented codes are for recreate transaction feature

// const recreateTransaction = async ({
//   countries,
//   transaction,
//   storePaymentDetail,
//   saveSelectedCountry,
// }) => {
//   const paymentDetail = getPaymentDetail(transaction);
//   const country = getDestinationCountry(countries, transaction);

//   await Promise.all([
//     saveSelectedCountry(country),
//     storePaymentDetail(paymentDetail),
//   ]);

//   return history.push(ROUTES.REVIEW_DETAILS);
// };

// const getDestinationCountry = (countries, transaction) => {
//   return (
//     countries.find(
//       (country) =>
//         country.threeCharCode === transaction.beneficiary.address.country
//     ) || {}
//   );
// };

// const getPaymentDetail = (txn) => {
//   const paymentDetail = {
//     paymentCurrency: 'USD',
//     transactionFee: txn.feeAmount,
//     exchangeRate: txn.exchangeRate,
//     sendingAmount: txn.senderAmount,
//     receivingAmount: txn.recipientAmount,
//     receivingCurrency: txn.recipientCurrency,
//     bankId: txn.beneficiary.bank.referenceId,
//     remittancePurpose: txn.remittancePurpose,
//     beneficiaryId: txn.beneficiary.referenceId,
//     payerId: txn.beneficiary.payer.referenceId,
//     walletId: txn.beneficiary.wallet.referenceId,
//     payoutMethod: PAYOUT_METHOD[txn.payoutMethod],
//     destinationCountry: txn.beneficiary.address.country,
//     paymentMethod: PAYMENT_METHOD.getValueOf(txn.fundingSource),
//   };

//   if (
//     txn.fundingSource === PAYMENT_METHOD.getKeyOf(PAYMENT_METHOD.BANK_ACCOUNT)
//   ) {
//     paymentDetail.senderBank = txn.senderFundingSourceAccountId;
//   }

//   if (
//     txn.fundingSource === PAYMENT_METHOD.getKeyOf(PAYMENT_METHOD.DEBIT_CARD)
//   ) {
//     paymentDetail.senderDebitCard = txn.senderFundingSourceAccountId;
//   }

//   return paymentDetail;
// };

const TransactionRow = (props) => {
  const { t } = useTranslation();
  const {
    transactions,
    cancelTransaction,
    showTransactionInvoice,
  } = staticSelector.select(props);

  return transactions.map((transaction, key) => {
    return (
      <tr key={key}>
        <td>{toLocalDateTime(transaction.createdAt).split(',')[0]}</td>
        <td>{transaction.referenceNumber}</td>
        <td>{transaction.beneficiary.fullName}</td>
        <td>
          ${transaction.senderAmount.toFixed(2)}
          <span className="text-muted"> USD</span>
        </td>
        <td>
          <span className={getTextClassName(transaction.status)}>
            <span className={getIconClassName(transaction.status)} />
            {transaction.status}
          </span>
        </td>
        <td>
          <span className={getTextClassName(transaction.deliveryStatus)}>
            <span className={getIconClassName(transaction.deliveryStatus)} />
            {transaction.deliveryStatus}
          </span>
        </td>
        <td>
          <i
            className={`icon ion-md-${getIconFor(
              PAYOUT_METHOD[transaction.payoutMethod]
            )}`}
          ></i>{' '}
          {PAYOUT_METHOD[transaction.payoutMethod]}
        </td>
        <td>
          {/* <button
            onClick={() =>
              recreateTransaction({
                countries,
                transaction,
                storePaymentDetail,
                saveSelectedCountry,
                storeBeneficiaryDetails,
              })
            }
            className="shake btn btn-link p-0 mr-3"
            title={t('button.Resend')}
          >
            <i className="icon ion-md-refresh d-inline-block" />
          </button> */}
          {transaction.status && (
            <button
              className="shake btn btn-link p-0 mr-3"
              title={t('button.Show Receipt')}
              onClick={() => showTransactionInvoice(transaction.referenceId)}
            >
              <i className="icon ion-md-paper d-inline-block" />
            </button>
          )}
          {showCancelButton(transaction) && (
            <button
              className="shake btn btn-link p-0 text-danger"
              title={t('button.Cancel Transaction')}
              onClick={() => cancelTransaction(transaction.referenceId)}
            >
              <i className="icon ion-md-close-circle-outline d-inline-block" />
            </button>
          )}
        </td>
      </tr>
    );
  });
};

TransactionRow.propTypes = {
  transactions: PropTypes.array,
  cancelTransaction: PropTypes.func,
  showTransactionInvoice: PropTypes.func,

  storePaymentDetail: PropTypes.func,
};

const staticSelector = sl.object({
  showTransactionInvoice: sl.func(),
  cancelTransaction: sl.func(),

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
      receiptNumber: sl.string(''),
      fundingSource: sl.string(''),
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

  countries: sl.list(
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
  storePaymentDetail: sl.func(),
  saveSelectedCountry: sl.func(),
});

export default TransactionRow;
