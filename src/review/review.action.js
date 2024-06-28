import i18n from 'i18next';
import { API_ERROR, STATUS_CODE } from 'app';
import { getApiExceptionMsg } from 'utils';
import { TIER } from 'sender/sender.constant';
import { NOTIFY_BENEFICIARY, CREATE_TRANSACTION } from 'review';
import { sendNotificationToBeneficiary } from 'api';

export const notifyBeneficiary = (email) => {
  return async (dispatch) => {
    dispatch({
      type: NOTIFY_BENEFICIARY.PENDING,
    });

    const { data, error } = await sendNotificationToBeneficiary(email);

    if (error) {
      return dispatch({
        type: NOTIFY_BENEFICIARY.ERROR,
        payload: error.message,
      });
    }

    dispatch({
      type: NOTIFY_BENEFICIARY.SUCCESS,
      payload: data,
    });
  };
};

const getCustomErrorMessage = (ErrMessage, currentTier) => {
  const message = getApiExceptionMsg(ErrMessage);

  if (message.includes('amount exceed tier limit')) {
    return TIER.THREE === currentTier
      ? message
      : message +
          i18n.t(
            'validation.If you still need to send transaction with higher amount, please request for tier upgrade'
          );
  }

  if (message.includes('profile edit requested in pending')) {
    return message;
  }

  return API_ERROR.SOMETHING_WENT_WRONG;
};
