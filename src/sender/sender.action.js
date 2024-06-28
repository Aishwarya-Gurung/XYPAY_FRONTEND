import {
  signup,
  verifyPNumber,
  resendPVerificationCode,
  resendEVerificationLink,
} from 'api';
import {
  SIGNUP,
  PHONE_VERIFICATION,
  TOGGLE_WIDGET_MODAL,
  TOGGLE_PVERIFICATION_FORM,
  RESEND_PVERIFICATION_CODE,
  RESEND_EVERIFICATION_LINK,
} from './sender.type';
import { updateLoginState, setPhoneVerified } from 'auth';
import { getErrorMessage, getApiExceptionMsg } from 'utils';

/**
 * Handles sender signup actions.
 *
 * @param {Object} sender
 */
export const signupSender = (sender) => {
  return async (dispatch) => {
    dispatch({
      type: SIGNUP.PENDING,
    });

    const { data, error } = await signup(sender);

    if (error) {
      return dispatch({
        type: SIGNUP.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    dispatch({
      type: SIGNUP.SUCCESS,
      payload: sender,
    });

    dispatch(updateLoginState(data));
  };
};

/**
 * Toggles phone verification form.
 *
 */
export const togglePVerificationForm = () => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_PVERIFICATION_FORM,
    });
  };
};

/**
 * Sets phone verified.
 *
 * @param {Number} verificationCode
 */
export const verifyPhoneNumber = (verificationCode) => {
  return async (dispatch) => {
    dispatch({
      type: PHONE_VERIFICATION.PENDING,
    });

    const { data, error } = await verifyPNumber(verificationCode);

    if (error) {
      return dispatch({
        type: PHONE_VERIFICATION.ERROR,
        payload: getErrorMessage(error.status, error.message),
      });
    }

    dispatch({
      type: PHONE_VERIFICATION.SUCCESS,
      payload: {
        isPhoneVerified: data.isPhoneVerified,
      },
    });

    dispatch(setPhoneVerified());
  };
};

/**
 * Resends verification code.
 *
 */
export const resendVerificationCode = () => {
  return async (dispatch) => {
    dispatch({
      type: RESEND_PVERIFICATION_CODE.PENDING,
    });

    const { data, error } = await resendPVerificationCode();

    if (error) {
      return dispatch({
        type: RESEND_PVERIFICATION_CODE.ERROR,
        payload: error.message,
      });
    }

    return dispatch({
      type: RESEND_PVERIFICATION_CODE.SUCCESS,
      payload: data,
    });
  };
};

/**
 * Resends verification link.
 *
 */
export const resendVerificationLink = () => {
  return async (dispatch) => {
    dispatch({
      type: RESEND_EVERIFICATION_LINK.PENDING,
    });

    const { data, error } = await resendEVerificationLink();

    if (error) {
      return dispatch({
        type: RESEND_EVERIFICATION_LINK.ERROR,
        payload: error.message,
      });
    }

    return dispatch({
      type: RESEND_EVERIFICATION_LINK.SUCCESS,
      payload: data,
    });
  };
};

/**
 * Toggles login modal box.
 *
 * @param {Any} status
 */
export const toggleWidgetModal = (status = 'default') => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_WIDGET_MODAL,
      payload: status,
    });
  };
};
