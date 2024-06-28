import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { TXN_AMOUNT, PAYMENT_METHOD } from 'app';
import BlinkTextLoader from 'components/form/blink-loader-text';

import sl from 'components/selector/selector';

const updateSelectedCard = (cardId, cards, selectCard) => {
  let cardAccount = null;

  if (cards.length === 1) {
    cardAccount = cards[0];
  } else {
    cardAccount = cards.find((card) => card.id === cardId);
  }

  if (cardAccount) {
    return selectCard(cardAccount);
  }
};

const isCardAmountValid = (amount) => {
  return amount <= TXN_AMOUNT.MAX_CARD_SENDING_AMT;
};

const PaymentCard = (props) => {
  const { t } = useTranslation();
  const {
    cards,
    isFetching,
    defaultValue,
    sendingAmount,
    toggleWidgetModal,
    updatePaymentMethod,
    senderDebitCardError,
    isCurrentPaymentMethod,
  } = staticSelector.select(props);

  const [selectedCard, selectCard] = useState(null);
  const [isCardTxnValid, setCardTxnValid] = useState(null);

  if (!selectedCard && (defaultValue || cards.length === 1)) {
    updateSelectedCard(defaultValue, cards, selectCard);
  }

  useEffect(() => {
    if (isCardAmountValid(sendingAmount)) {
      setCardTxnValid(true);
    }
  }, [sendingAmount]);

  return (
    <React.Fragment>
      <div className="card mb-3">
        {!isCardTxnValid && <CardTxnLimitMessage />}
        <label
          className={
            isCurrentPaymentMethod
              ? 'card-top media p-3 active '
              : 'card-top media p-3'
          }
        >
          <i className="icon ion-md-card h3 mr-3 text-muted" />
          <div className="media-body">
            <h4 className={`m-0 ${!isCardTxnValid && 'text-muted'}`}>
              {t('payment.Use Debit Card')}
            </h4>
            <small className="text-muted">
              {t('payment.Your debit card will be charged')}
            </small>
          </div>
          {isCardTxnValid && (
            <div className="media-right">
              <div className="checkbox-wrapper">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PAYMENT_METHOD.DEBIT_CARD}
                  checked={isCurrentPaymentMethod}
                  onChange={(e) => updatePaymentMethod(e.target.value)}
                />

                <span />
              </div>
            </div>
          )}
        </label>

        {isCardTxnValid && (
          <div
            className={isCurrentPaymentMethod ? 'card-body border-top' : 'hide'}
          >
            <h5>{t('payment.Please select your debit card')}</h5>

            {isFetching ? (
              <BlinkTextLoader
                align="left"
                message={t(
                  'payment.Collecting your Card information Please wait'
                )}
              />
            ) : Object.keys(cards).length ? (
              <div className="form-group">
                <label>
                  <select
                    name="senderDebitCard"
                    className="custom-select"
                    defaultValue={defaultValue}
                    disabled={isCurrentPaymentMethod ? false : true}
                    onChange={(e) =>
                      updateSelectedCard(e.target.value, cards, selectCard)
                    }
                  >
                    {cards.length > 1 && (
                      <option value="">
                        {t('payment.Please select your debit card')}
                      </option>
                    )}
                    {cards.map((card, key) => (
                      <option value={card.id} key={key}>
                        {card.nickName} {card.fundingSourceName}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{senderDebitCardError}</div>
                </label>
                {selectedCard && (
                  <div className="col-md-12 m-0 alert alert-info">
                    <div>
                      {t(`payment.Nick Name`)}: <b>{selectedCard.nickName}</b>
                    </div>
                    <div>
                      {t(`payment.Card`)}:{' '}
                      <b>{selectedCard.fundingSourceName}</b>
                    </div>
                    <div>
                      {t(`payment.Network`)}:{' '}
                      <b>{selectedCard.institutionName}</b>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-info">
                <i className="icon ion-md-information-circle" />{' '}
                {t('payment.No cards are added yet')}
              </div>
            )}

            <span>{t('form.or,')}</span>
            <span
              onClick={() => toggleWidgetModal()}
              className="btn btn-sm btn-link p-0"
            >
              {t('payment.Add Debit Card')}
            </span>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

const CardTxnLimitMessage = () => {
  const { t } = useTranslation();

  return (
    <div className="alert alert-warning m-0 mb-2 p-1">
      <i className="icon ion-md-warning ml-2" />{' '}
      <span className="small">
        {t('payment.Transactions above $2000 cannot be made using debit card')}
      </span>
    </div>
  );
};

PaymentCard.prototypes = {
  cards: PropTypes.array,
  isFetching: PropTypes.bool,
  defaultValue: PropTypes.string,
  sendingAmount: PropTypes.number,
  toggleWidgetModal: PropTypes.func,
  updatePaymentMethod: PropTypes.func,
  isCurrentPaymentMethod: PropTypes.bool,
  senderDebitCardError: PropTypes.string,
};

const staticSelector = sl.object({
  cards: sl.list(
    sl.object({
      id: sl.string(''),
      nickName: sl.string(''),
      senderId: sl.string(''),
      institutionName: sl.string(''),
      fundingSourceName: sl.string(''),
    })
  ),
  sendingAmount: sl.number(),
  defaultValue: sl.string(''),
  toggleWidgetModal: sl.func(),
  isFetching: sl.boolean(false),
  updatePaymentMethod: sl.func(),
  senderDebitCardError: sl.string(''),
  isCurrentPaymentMethod: sl.boolean(false),
});

export default PaymentCard;
