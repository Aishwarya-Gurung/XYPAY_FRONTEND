import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES, PAYOUT_METHOD } from 'app';

const ReviewDetail = (props) => {
  const {
    payer,
    beneficiary,
    paymentDetail,
    beneficiaryWallet,
    beneficiaryAccount,
  } = props;
  const { t } = useTranslation();

  return (
    <div className="row">
      <div className="col-md-12 p-0 clearfix">
        <div className="col-md-12">
          <p className="mt-4 mr-2 text-medium m-0">Sending money to</p>
          <div className="d-flex align-items-center mt-3">
            <div className="background-icon d-flex align-items-center justify-content-center">
              <i>
                <img
                  src={require('assets/img/profile-icon.svg').default}
                  className=""
                  alt="profile-icon"
                />
              </i>
            </div>

            <div className="ml-3">
              <p className="m-0 review-detail-amount lh-1">
                <span className="bold m-0">{beneficiary.fullName} </span>
                <Link
                  className="text-decoration-underline ml-2 small"
                  to={ROUTES.BENEFICIARY_DETAILS}
                >
                  {t('button.Change')}
                </Link>
              </p>
              <address className="text-muted mb-0">
                {beneficiary.address.city}, {beneficiary.address.country}
              </address>
            </div>
          </div>
          <div className="mt-3 d-flex align-items-center">
            <div className="background-icon d-flex align-items-center justify-content-center">
              {paymentDetail.payoutMethod === PAYOUT_METHOD.BANK_DEPOSIT && (
                <i className="icon ion-md-business" />
              )}
              {paymentDetail.payoutMethod === PAYOUT_METHOD.HOME_DELIVERY && (
                <i className="icon ion-md-home" />
              )}

              {paymentDetail.payoutMethod === PAYOUT_METHOD.CASH_PICKUP && (
                <i className="icon ion-md-cash" />
              )}
              {paymentDetail.payoutMethod === PAYOUT_METHOD.WALLET && (
                <i className="icon ion-md-phone-portrait" />
              )}
            </div>
            <div className="ml-3">
              {paymentDetail.payoutMethod === PAYOUT_METHOD.BANK_DEPOSIT && (
                <>
                  <h6 className="m-0 review-detail-name">
                    <strong>{beneficiaryAccount.bankName}</strong>
                  </h6>
                  <p className="m-0 text-muted text-medium">
                    {beneficiaryAccount.accountNumber}
                  </p>
                </>
              )}
              {paymentDetail.payoutMethod === PAYOUT_METHOD.WALLET && (
                <div className="">
                  <h6 className="m-0">
                    <strong>{beneficiaryWallet.payerName}</strong>
                  </h6>
                  <p className="m-0 text-muted">
                    {beneficiaryWallet.identificationValue}
                  </p>
                </div>
              )}

              {paymentDetail.payoutMethod === PAYOUT_METHOD.CASH_PICKUP && (
                <React.Fragment>
                  <p className="m-0">{t('review.Cash Pickup Location')}</p>
                  <p className="bold m-0">{payer.name}</p>
                  {paymentDetail.pickupLocation && (
                    <p>{paymentDetail.pickupLocation}</p>
                  )}
                </React.Fragment>
              )}
              {paymentDetail.payoutMethod === PAYOUT_METHOD.HOME_DELIVERY && (
                <p className="bold m-0">{payer.name}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12 mt-4">
        <div className="text-medium m-0 mb-2">
          <span>Payment Details</span>
        </div>

        <div className="d-flex justify-content-between">
          <p className="text-muted text-medium">
            {t('sidereceipt.Total Amount Debited')}
          </p>
          <p className="review-detail-name bold">
            <strong>{paymentDetail.totalAmount?.toLocaleString()} USD</strong>
          </p>
        </div>

        <div className="d-flex justify-content-between">
          <p className="text-muted text-medium">
            {t('sidereceipt.Transaction Fee')}
          </p>
          <p className="text-medium">
            {paymentDetail.transactionFee?.toLocaleString()} USD
          </p>
        </div>

        <div className="d-flex justify-content-between w-100">
          <p className="text-muted text-medium">
            {t('sidereceipt.Send Amount')}
          </p>
          <p className="text-medium">
            {paymentDetail.sendingAmount?.toLocaleString()}{' '}
            {paymentDetail.paymentCurrency}
          </p>
        </div>

        <div className="d-flex justify-content-between">
          <p className="text-muted text-medium">
            {t('sidereceipt.Exchange Rate')}
          </p>
          <p className="text-medium">
            1 USD = {paymentDetail.exchangeRate}{' '}
            {paymentDetail.receivingCurrency}
          </p>
        </div>

        <div className="d-flex justify-content-between">
          <p className="text-medium text-muted">
            {t('sidereceipt.Receive Amount')}
          </p>
          <p className="bold review-detail-name">
            {paymentDetail.receivingAmount?.toLocaleString()}{' '}
            {paymentDetail.receivingCurrency}
          </p>
        </div>
        <hr className="m-0 " />
      </div>
    </div>
  );
};

ReviewDetail.propTypes = {
  payer: PropTypes.object,
  sender: PropTypes.object,
  beneficiary: PropTypes.object,
  selectedCountry: PropTypes.object,
  senderAccount: PropTypes.object,
  paymentDetail: PropTypes.object,
  beneficiaryAccount: PropTypes.object,
  beneficiaryWallet: PropTypes.object,
};
export default ReviewDetail;
