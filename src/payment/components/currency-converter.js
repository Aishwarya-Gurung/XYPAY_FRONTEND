import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { Fragment, useState, useEffect } from 'react';

import { isCurrentPath } from 'utils/routes-helper';
import { getIconFor, NUMBER_TYPE, validateNumber } from 'utils';

import { ROUTES, TXN_AMOUNT, PAYOUT_METHOD, PAYMENT_METHOD } from 'app';

const INPUT = {
  SENDING_AMOUNT: 'sendingAmount',
  RECEIVING_AMOUNT: 'receivingAmount',
};

const resetInitialInput = (e) => {
  if (e.target.value === '0') {
    e.target.value = null;
  }

  diableScrollAndArrowEffect(e);
};

const isCardSendAmountValid = (amount) => {
  return amount <= TXN_AMOUNT.MAX_CARD_SENDING_AMT;
};

const diableScrollAndArrowEffect = (e) => {
  // These lines below disables scroll and arrow key
  // event to increase and decrease value
  e.target.addEventListener('mousewheel', function (e) {
    e.preventDefault();
  });

  e.target.addEventListener('keydown', function (e) {
    if (e.keyCode === 38) {
      e.preventDefault();
    } else if (e.keyCode === 40) {
      e.preventDefault();
    }
  });
};

const roundOff = (amount) => {
  if (amount < 0.01) {
    return amount;
  }

  return parseFloat(Math.round(amount * 100) / 100);
};

const CurrencyConverter = (props) => {
  const {
    currency,
    transferFee,
    sendingAmount,
    isAuthenticated,
    receivingAmount,
    selectedCountry,
    handleValidation,
    sendingAmountError,
    transferFeesDetail,
    updateSendingAmount,
    handleCurrencyChange,
    receivingAmountError,
    getExchangeRateMessage,
  } = props;
  const { t } = useTranslation();
  const [scale, setScale] = useState(0);
  const [sendAmt, setSendAmt] = useState(0);
  const [feesHeight, setFeesHeight] = useState(0);
  const [receiveAmt, setReceiveAmt] = useState(0);
  const [currentCurrency, setCurrentCurrency] = useState('');

  useEffect(() => {
    setSendAmt(roundOff(sendingAmount));
  }, [sendingAmount]);

  useEffect(() => {
    setReceiveAmt(roundOff(receivingAmount));
  }, [receivingAmount]);

  useEffect(() => {
    setCurrentCurrency(currency);
  }, [currency]);

  const updateAmount = (input) => {
    if (input.target.name === INPUT.SENDING_AMOUNT) {
      setSendAmt(input.target.value);
    } else {
      setReceiveAmt(input.target.value);
    }

    updateSendingAmount(input);
  };

  return (
    <Fragment>
      <div className="row p-3">
        <div className="col-6">
          <small
            className={`${
              isCurrentPath(ROUTES.HOME) ? 'text-white' : 'text-muted'
            }`}
          >
            {t('payment.Exchange rate')}
          </small>
          <p
            className={`m-0 bold ${isCurrentPath(ROUTES.HOME) && 'text-white'}`}
          >
            {getExchangeRateMessage() || 'No exchange found.'}
          </p>
        </div>
        <div className="col-6">
          <small
            className={`${
              isCurrentPath(ROUTES.HOME) ? 'text-white' : 'text-muted'
            }`}
          >
            {t('payment.Estimated Transfer Fee')}
          </small>
          <p
            className={`m-0 bold ${isCurrentPath(ROUTES.HOME) && 'text-white'}`}
          >
            {`${transferFee} USD `}
            <label
              id="toggle-label"
              title="fee ranges"
              className="text-info cursor-pointer p-0 m-0"
              onClick={() => {
                setScale(scale < 1 ? 1 : 0);
                setTimeout(() => {
                  setFeesHeight(feesHeight === 0 ? 'auto' : 0);
                }, 150);
              }}
            >
              <i
                className={`icon ion-md-information-circle-outline ${
                  isCurrentPath(ROUTES.HOME) && 'text-white'
                }`}
              />
            </label>
          </p>
        </div>
        <FeesDetails
          scale={scale}
          height={feesHeight}
          transferFeesDetail={transferFeesDetail}
        />
      </div>

      {!sendingAmountError &&
        !isCardSendAmountValid(sendingAmount) &&
        isAuthenticated && <CardTxnLimitMessage />}

      <div
        className={`currency-converter ${
          sendingAmountError ? 'is-invalid' : ''
        }`}
      >
        <label className="text-muted small" htmlFor="sending">
          {t('payment.Sending amount')}
        </label>
        <div className="col-8 p-0">
          <input
            name={INPUT.SENDING_AMOUNT}
            type="number"
            step="any"
            placeholder="0.00"
            id="sending"
            value={sendAmt === 0 ? '' : sendAmt}
            onChange={updateAmount}
            onBlur={(e) => handleValidation(e.target)}
            onClick={(e) => resetInitialInput(e)}
            onKeyPress={(e) => validateNumber(e, NUMBER_TYPE.FLOAT)}
          />
        </div>
        <div className="select-wrapper">
          <select className="skinny" name="paymentCurrency">
            <option>USD</option>
          </select>
          <i className="icon ion-md-arrow-dropdown" />
        </div>
        <label className="text-danger small">{sendingAmountError}</label>
      </div>

      <div
        className={`currency-converter ${
          receivingAmountError ? 'is-invalid' : ''
        }`}
      >
        <label className="text-muted small" htmlFor="receiving">
          {t('payment.Receiving amount')}
        </label>
        <div className="col-8 p-0">
          <input
            name={INPUT.RECEIVING_AMOUNT}
            type="number"
            step="any"
            placeholder="0.00"
            value={receiveAmt === 0 ? '' : receiveAmt}
            onChange={updateAmount}
            onBlur={(e) => handleValidation(e.target)}
            onClick={(e) => resetInitialInput(e)}
            onKeyPress={(e) => validateNumber(e, NUMBER_TYPE.FLOAT)}
          />
        </div>
        <div className="select-wrapper">
          <select
            className="skinny"
            id="receiving"
            name="receivingCurrency"
            value={currentCurrency}
            onChange={(e) => handleCurrencyChange(e)}
          >
            {selectedCountry.currency.map((singleCurrency, key) => (
              <option key={key}>{singleCurrency.code}</option>
            ))}
          </select>
          <i className="icon ion-md-arrow-dropdown" />
        </div>
        <label className="text-danger small">{receivingAmountError}</label>
      </div>
      <p className={`px-3 small ${isCurrentPath(ROUTES.HOME) && 'text-white'}`}>
        {t('payment.The exchange rate guaranteed for 30 minutes only')}
      </p>
    </Fragment>
  );
};

const CardTxnLimitMessage = () => {
  const { t } = useTranslation();

  return (
    <div className="alert alert-warning m-0 mb-2 p-1 d-flex small">
      <i className="icon ion-md-warning ml-2 mr-2" />{' '}
      <span>
        {t('payment.Transactions above $2000 cannot be made using debit card')}
      </span>
    </div>
  );
};

const FeesDetails = ({ scale, height, transferFeesDetail }) => {
  if (!transferFeesDetail.length) {
    return null;
  }

  return (
    <div
      id="expand"
      className="col-md-12 p-0"
      style={{ height: height, transform: `scaleY(${scale})` }}
    >
      <div className="p-1"></div>
      <div className="small fees-list text-primary p-3 pl-md-4 pr-md-4 pl-md-4 pb-md-2">
        {transferFeesDetail.map((feeDetail, key) => (
          <div className="pb-1" key={key}>
            <div className="col-4 col-md-4 p-0 d-inline-block">
              <i
                className={`icon ion-md-${getIconFor(
                  PAYMENT_METHOD[feeDetail.paymentMethod]
                )}`}
              ></i>{' '}
              {PAYMENT_METHOD[feeDetail.paymentMethod]}
            </div>
            <div className="col-6 col-md-6 p-0 d-inline-block">
              <i className="icon ion-md-arrow-forward mr-3"></i>
              <i
                className={`icon ion-md-${getIconFor(
                  PAYOUT_METHOD[feeDetail.payoutMethod]
                )}`}
              ></i>{' '}
              {PAYOUT_METHOD[feeDetail.payoutMethod]} ({feeDetail.currency})
            </div>
            <div className="col-2 p-0 d-inline-block">
              {feeDetail.fee}
              <span className="bold ml-1">USD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

FeesDetails.propTypes = {
  height: PropTypes.any,
  scale: PropTypes.number,
  transferFeesDetail: PropTypes.array,
};

CurrencyConverter.propTypes = {
  currency: PropTypes.string,
  transferFee: PropTypes.number,
  sendingAmount: PropTypes.number,
  isAuthenticated: PropTypes.bool,
  handleValidation: PropTypes.func,
  receivingAmount: PropTypes.number,
  selectedCountry: PropTypes.object,
  transferFeesDetail: PropTypes.array,
  updateSendingAmount: PropTypes.func,
  handleCurrencyChange: PropTypes.func,
  sendingAmountError: PropTypes.string,
  receivingAmountError: PropTypes.string,
  getExchangeRateMessage: PropTypes.func,
};

export default CurrencyConverter;
