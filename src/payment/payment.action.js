import {
  fetchFeeSet,
  fetchSenderBanks,
  removeSenderBank,
  fetchExchangeRate,
  fetchSenderDebitCards,
  removeSenderDebitCard,
} from 'api';
import {
  FETCH_FEE_RANGE,
  FETCH_SENDER_BANKS,
  FETCH_EXCHANGE_RATE,
  SAVE_PAYMENT_DETAIL,
  RESET_PAYMENT_DETAILS,
  FETCH_SENDER_DEBIT_CARD,
  REMOVE_SENDER_FUNDING_SOURCE,
} from './payment.type';

import {
  feeSetMapper,
  senderBankMapper,
  senderCardMapper,
} from './payment.mapper';
import { securedLS, getApiExceptionMsg } from 'utils';

export const storePaymentDetail = (paymentDetail) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_PAYMENT_DETAIL.PENDING,
    });

    if (!Object.keys(paymentDetail).length) {
      return dispatch({
        type: SAVE_PAYMENT_DETAIL.ERROR,
        payload: 'Payment details are missing',
      });
    }

    return dispatch({
      type: SAVE_PAYMENT_DETAIL.SUCCESS,
      payload: paymentDetail,
    });
  };
};

export const getFeeRange = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_FEE_RANGE.PENDING,
    });
    const { data, error } = await fetchFeeSet();

    if (error) {
      return dispatch({
        type: FETCH_FEE_RANGE.ERROR,
        payload: error.message,
      });
    }

    const { result } = feeSetMapper.select(data);

    dispatch({
      type: FETCH_FEE_RANGE.SUCCESS,
      payload: result,
    });
  };
};

export const getExchangeRate = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_EXCHANGE_RATE.PENDING,
    });
    const { data, error } = await fetchExchangeRate();

    if (error) {
      return dispatch({
        type: FETCH_EXCHANGE_RATE.ERROR,
        payload: error.message,
      });
    }
    dispatch({
      type: FETCH_EXCHANGE_RATE.SUCCESS,
      payload: data.result,
    });
  };
};

export const getSenderBanks = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_SENDER_BANKS.PENDING,
    });

    const { data, error } = await fetchSenderBanks();

    if (error) {
      return dispatch({
        type: FETCH_SENDER_BANKS.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    const { result } = senderBankMapper.select(data);

    dispatch({
      type: FETCH_SENDER_BANKS.SUCCESS,
      payload: result,
    });

    return result;
  };
};

export const deleteSenderBank = (bankId) => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_SENDER_FUNDING_SOURCE.PENDING,
    });

    const { error } = await removeSenderBank(bankId);

    if (error) {
      dispatch({
        type: REMOVE_SENDER_FUNDING_SOURCE.ERROR,
        payload: getApiExceptionMsg(error.message),
      });

      return false;
    }

    dispatch({
      type: REMOVE_SENDER_FUNDING_SOURCE.SUCCESS,
    });

    return true;
  };
};

export const deleteSenderDebitCard = (cardId) => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_SENDER_FUNDING_SOURCE.PENDING,
    });

    const { error } = await removeSenderDebitCard(cardId);

    if (error) {
      dispatch({
        type: REMOVE_SENDER_FUNDING_SOURCE.ERROR,
        payload: getApiExceptionMsg(error.message),
      });

      return false;
    }

    dispatch({
      type: REMOVE_SENDER_FUNDING_SOURCE.SUCCESS,
    });

    return true;
  };
};

export const getSenderDebitCards = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_SENDER_DEBIT_CARD.PENDING,
    });

    const { data, error } = await fetchSenderDebitCards();

    if (error) {
      return dispatch({
        type: FETCH_SENDER_DEBIT_CARD.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    const { result } = senderCardMapper.select(data);

    dispatch({
      type: FETCH_SENDER_DEBIT_CARD.SUCCESS,
      payload: result,
    });
  };
};

export const resetPaymentDetails = () => {
  securedLS.clear('paymentDetail');

  return (dispatch) => {
    dispatch({
      type: RESET_PAYMENT_DETAILS,
    });
  };
};
