import { senderMapper } from './admin.mapper';
import { getApiExceptionMsg } from '../utils';
import { fetchUnlockSender, fetchLockedSenders } from '../api';
import { UNLOCK_SENDER, FETCH_LOCKED_SENDER } from './admin.type';

export const getLockedSenders = (filter) => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_LOCKED_SENDER.PENDING,
    });

    const requestPayload = { ...filter };

    delete requestPayload.reload;

    const { data, error } = await fetchLockedSenders(requestPayload);

    if (error) {
      return dispatch({
        type: FETCH_LOCKED_SENDER.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    const { result, paging } = senderMapper.select(data);

    return dispatch({
      type: FETCH_LOCKED_SENDER.SUCCESS,
      payload: {
        senders: result,
        paging: paging,
        reload: filter.reload,
      },
    });
  };
};

/**
 * Unlock senders.
 *
 * @param {String} senderReferenceId
 *
 */
export const unlockSender = (senderReferenceId) => {
  return async (dispatch) => {
    dispatch({
      type: UNLOCK_SENDER.PENDING,
    });

    const { error } = await fetchUnlockSender(senderReferenceId);

    if (error) {
      return dispatch({
        type: UNLOCK_SENDER.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    return dispatch({
      type: UNLOCK_SENDER.SUCCESS,
    });
  };
};
