import { CANCEL_TRANSACTION } from './dashboard.type';
import { fetchCancelTransaction } from 'api';
import { API_ERROR } from 'app';

/**
 * Cancels transaction and returns true if cancelation succeeds.
 *
 * @param {String} transactionId
 */
export const cancelTransaction = (transactionId) => {
  return async (dispatch) => {
    dispatch({
      type: CANCEL_TRANSACTION.PENDING,
    });

    const { error } = await fetchCancelTransaction(transactionId);

    if (error) {
      dispatch({
        type: CANCEL_TRANSACTION.ERROR,
        payload: API_ERROR.SOMETHING_WENT_WRONG,
      });

      return false;
    }

    dispatch({
      type: CANCEL_TRANSACTION.SUCCESS,
    });

    return true;
  };
};
