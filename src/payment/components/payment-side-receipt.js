import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';

import sl from 'components/selector/selector';

import { withTranslation } from 'react-i18next';

import { ROUTES } from 'app';
import { getReduxState } from 'utils';

class SideReceipt extends Component {
  state = {
    glow: false,
    isSideReceiptOpen: false,
  };
  hasUnmounted = false;

  updateState = (state, value) => {
    if (!this.hasUnmounted) {
      return this.setState(() => ({
        [state]: value,
      }));
    }
  };

  toggleSideReceipt = () => {
    this.updateState('isSideReceiptOpen', !this.state.isSideReceiptOpen);
  };

  componentDidUpdate = (prevProps) => {
    this.hasUnmounted = false;

    if (
      prevProps.paymentDetail.transactionFee !==
        this.props.paymentDetail.transactionFee &&
      prevProps.paymentDetail.totalAmount !==
        this.props.paymentDetail.totalAmount
    ) {
      this.glowText();
    }
  };

  componentWillUnmount = () => {
    this.hasUnmounted = true;
  };

  glowText = () => {
    this.updateState('glow', true);
    setTimeout(() => this.updateState('glow', false), 3000);
  };

  render() {
    const { t, paymentDetail, selectedCountry } = staticSelector.select(
      this.props
    );

    return (
      <div className="p-sticky to-front">
        <div
          className={
            this.state.isSideReceiptOpen
              ? 'card receipt p-4 open'
              : 'card receipt p-4'
          }
        >
          <div className="summary d-block d-md-none">
            <button
              className="triggerbutton   btn btn-block btn-link bold"
              onClick={this.toggleSideReceipt}
            >
              <img
                src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/us.svg"
                height="16"
                className="flag mr-2"
                alt="flag-icon"
              />
              {paymentDetail.paymentCurrency} {paymentDetail.sendingAmount}
              <i className="icon ion-md-arrow-forward mx-3" />
              {selectedCountry.flagUrl && (
                <img
                  src={selectedCountry.flagUrl}
                  height="16"
                  className="flag mr-2"
                  alt="flag-icon"
                />
              )}
              {paymentDetail.receivingCurrency} {paymentDetail.receivingAmount}
            </button>
          </div>
          <div className="box mt-3 mt-md-0">
            <small className="text-muted">
              {t('sidereceipt.Sending money to')}
            </small>
            <p
              className="lead m-0 triggerbutton"
              onClick={this.toggleSideReceipt}
            >
              {selectedCountry.flagUrl && (
                <img
                  src={selectedCountry.flagUrl}
                  height="20"
                  alt="flag-icon"
                  className="flag mr-2"
                />
              )}
              {selectedCountry.name}
              <i className="icon ion-md-arrow-dropdown d-inline d-md-none ml-2" />
            </p>
          </div>
          <hr />
          <dl className="m-0 receipt-list">
            <dt className="text-muted">
              {t('sidereceipt.Send Amount')}{' '}
              <Link className="small" to={ROUTES.PAYMENT_DETAILS}>
                ({t('button.edit')})
              </Link>
            </dt>
            <dd>
              {paymentDetail.paymentCurrency} {paymentDetail.sendingAmount}
            </dd>
            <dt className={`${this.state.glow ? 'glow' : ''} text-muted`}>
              {t('sidereceipt.Transaction Fee')}
            </dt>
            <dd className={`${this.state.glow ? 'glow' : ''}`}>
              {paymentDetail.paymentCurrency} {paymentDetail.transactionFee}
            </dd>
            <dt className={`${this.state.glow ? 'glow' : ''} text-muted`}>
              {t('sidereceipt.Total Amount')}
            </dt>
            <dd className={`${this.state.glow ? 'glow' : ''} text-blue`}>
              USD {paymentDetail.totalAmount}
            </dd>
          </dl>

          <div className="hr-wrapper">
            <hr />
          </div>
          <dl className="m-0">
            <dt className="text-muted">{t('sidereceipt.Receive Amount')}</dt>
            <dd>
              {paymentDetail.receivingCurrency} {paymentDetail.receivingAmount}
            </dd>
            <dt className="text-muted">{t('sidereceipt.Exchange Rate')}</dt>
            <dd>
              {paymentDetail.paymentCurrency} 1=
              {paymentDetail.receivingCurrency} {paymentDetail.exchangeRate}
            </dd>
            <dt className="text-muted">{t('sidereceipt.Payment Type')}</dt>
            <dd>{paymentDetail.paymentMethod}</dd>
            <dt className="text-muted">{t('sidereceipt.Receive Type')}</dt>
            <dd>{paymentDetail.payoutMethod}</dd>
          </dl>
        </div>
      </div>
    );
  }
}

SideReceipt.propTypes = {
  t: PropTypes.func,
  paymentDetail: PropTypes.object,
  selectedCountry: PropTypes.object,
  beneficiaryDetail: PropTypes.object,
};

const staticSelector = sl.object({
  t: sl.func(),

  paymentDetail: sl.object({
    totalAmount: sl.number(),
    exchangeRate: sl.number(),
    sendingAmount: sl.number(),
    transactionFee: sl.number(),
    receivingAmount: sl.number(),
    paymentMethod: sl.string('TBD'),
    receivingCurrency: sl.string(''),
    paymentCurrency: sl.string('USD'),
    payoutMethod: sl.string('TBD'),
  }),

  selectedCountry: sl.object({
    flagUrl: sl.string(null),
    name: sl.string('No country selected'),
    currency: sl.list(
      sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      })
    ),
  }),
});

const mapStateToProps = (state) => {
  return {
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),
  };
};

const PaymentSideReceipt = withTranslation()(
  connect(mapStateToProps)(SideReceipt)
);

export default PaymentSideReceipt;
