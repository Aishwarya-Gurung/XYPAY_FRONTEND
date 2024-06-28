import i18n from 'i18next';

import {
  authMapper,
  adminMapper,
  senderMapper,
  kycStatusMapper,
} from './auth.mapper';
import {
  LOGIN,
  LOGOUT,
  RESET_ERROR,
  VERIFY_EMAIL,
  OAUTH2_LOGIN,
  PHONE_VERIFIED,
  RESET_PASSWORD,
  FORGOT_PASSWORD,
  RESEND_OTP_CODE,
  FETCH_GUEST_INFO,
  OTP_VERIFICATION,
  FETCH_ADMIN_INFO,
  FETCH_SENDER_INFO,
  UPDATE_KYC_STATUS,
  TOGGLE_LOGIN_MODAL,
  INITIALIZE_OTP_VERIFICATION,
  INITIALIZE_RESET_PASSWORD_MESSAGE,
} from './auth.type';
import { LS_KEY, FINGERPRINT } from './auth.constant';

import {
  securedLS,
  clearAuthData,
  getApiExceptionMsg,
  deleteSearchParameterCookie,
} from 'utils';
import {
  login,
  logout,
  verifyEmail,
  oauth2Signup,
  resendOTPCode,
  verifyOTPCode,
  resetPassword,
  forgotPassword,
  fetchGuestInfo,
  fetchAdminInfo,
  fetchSenderInfo,
  updateKYCStatus,
} from 'api';
import { getDestinationCountry } from 'landing-page';
import { ROLES, API_ERROR, ROUTES, history } from 'app';

export const authLogin = (signInCredentials) => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN.PENDING,
    });

    clearAuthData();
    const { data, error } = await login(signInCredentials);

    if (error) {
      if (error.error === FINGERPRINT.DEVICE_VERIFICATION_REQUIRED) {
        const { token, roles } = authMapper.select(error);

        securedLS.set(LS_KEY.TOKEN, token);
        await configureLogedInUser(dispatch, roles);

        dispatch({
          type: INITIALIZE_OTP_VERIFICATION,
          payload: { token },
        });

        return { deviceId: error.device_id, type: INITIALIZE_OTP_VERIFICATION };
      }

      return dispatch({
        type: LOGIN.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    const { token, roles } = authMapper.select(data);

    securedLS.set(LS_KEY.TOKEN, token);
    await configureLogedInUser(dispatch, roles);

    return dispatch({
      type: LOGIN.SUCCESS,
      payload: {
        token,
      },
    });
  };
};

export const verifyOTP = (credentials) => {
  return async (dispatch) => {
    dispatch({
      type: OTP_VERIFICATION.PENDING,
    });
    const { OTPCode, deviceId } = credentials;
    const { error } = await verifyOTPCode(OTPCode, deviceId);

    if (error) {
      return dispatch({
        type: OTP_VERIFICATION.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    return dispatch({
      type: OTP_VERIFICATION.SUCCESS,
    });
  };
};

export const resendOTP = (deviceId) => {
  return async (dispatch) => {
    dispatch({
      type: RESEND_OTP_CODE.PENDING,
    });
    const { error } = await resendOTPCode(deviceId);

    if (error) {
      return dispatch({
        type: RESEND_OTP_CODE.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    return dispatch({
      type: RESEND_OTP_CODE.SUCCESS,
    });
  };
};

const configureLogedInUser = async (dispatch, roles) => {
  if (roles.includes(ROLES.USER)) {
    await dispatch(getSenderInfo());

    // configureSardine(action);
  }

  if (roles.includes(ROLES.ADMIN)) {
    await dispatch(getAdminInfo());
  }
};

// Note: Sardine is disabled currently
/* const configureSardine = (action) => {
  if (action.type === FETCH_SENDER_INFO.SUCCESS) {
    sardine.updateUserId(action.payload.sender?.referenceId);
  }
}; */

export const getSenderInfo = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_SENDER_INFO.PENDING,
    });

    securedLS.clear(LS_KEY.CURRENT_USER);
    const { data, error } = await fetchSenderInfo();

    if (error) {
      return dispatch({
        type: FETCH_SENDER_INFO.ERROR,
        payload: API_ERROR.SOMETHING_WENT_WRONG,
      });
    }

    const {
      sender,
      status,
      provider,
      isPrivacyPolicyAccepted,
      isAccountDeleteRequested,
    } = senderMapper.select(data);

    return dispatch({
      type: FETCH_SENDER_INFO.SUCCESS,
      payload: {
        sender,
        status,
        provider,
        isPrivacyPolicyAccepted,
        isAccountDeleteRequested,
      },
    });
  };
};

export const getAdminInfo = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_ADMIN_INFO.PENDING,
    });

    const { data, error } = await fetchAdminInfo();
    const admin = adminMapper.select(data);

    if (error) {
      return dispatch({
        type: FETCH_ADMIN_INFO.ERROR,
        payload: API_ERROR.SOMETHING_WENT_WRONG,
      });
    }

    dispatch({
      type: FETCH_ADMIN_INFO.SUCCESS,
      payload: {
        admin,
      },
    });
  };
};

export const getGuestInfo = (token) => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_GUEST_INFO.PENDING,
    });

    await securedLS.set(LS_KEY.TOKEN, token);
    const { error, data } = await fetchGuestInfo();

    if (error) {
      dispatch({
        type: FETCH_GUEST_INFO.ERROR,
        payload: API_ERROR.SOMETHING_WENT_WRONG,
      });

      return false;
    }

    const { sender, status, provider } = senderMapper.select(data);

    if (sender.address.state && sender.phoneNumber) {
      return dispatch({
        type: OAUTH2_LOGIN.SUCCESS,
        payload: {
          token,
          sender,
          status,
          provider,
        },
      });
    }

    return dispatch({
      type: FETCH_GUEST_INFO.SUCCESS,
      payload: {
        sender,
      },
    });
  };
};

export const requestForgotPassword = (email) => {
  return async (dispatch) => {
    dispatch({
      type: FORGOT_PASSWORD.PENDING,
    });

    const { data, error } = await forgotPassword(email);

    if (error) {
      return dispatch({
        type: FORGOT_PASSWORD.ERROR,
        payload: error.message,
      });
    }

    return dispatch({
      type: FORGOT_PASSWORD.SUCCESS,
      payload:
        data.message ||
        i18n.t(
          'auth.Something went wrong. Please try again later or contact our customer support'
        ),
    });
  };
};

export const requestResetPassword = (requestBody) => {
  return async (dispatch) => {
    dispatch({
      type: RESET_PASSWORD.PENDING,
    });

    const { data, error } = await resetPassword(requestBody);

    if (error) {
      const messages = [];

      if (error.errors) {
        error.errors.forEach((err) => {
          messages.push(err.defaultMessage);
        });

        return dispatch({
          type: RESET_PASSWORD.ERROR,
          payload: messages.join(', '),
        });
      }

      return dispatch({
        type: RESET_PASSWORD.ERROR,
        payload: error.message,
      });
    }

    return dispatch({
      type: RESET_PASSWORD.SUCCESS,
      payload: data.message,
    });
  };
};

export const initializeResetPasswordMessage = () => {
  return (dispatch) => {
    dispatch({
      type: INITIALIZE_RESET_PASSWORD_MESSAGE,
    });
  };
};

export const authOAuth2Signup = (senderInfo) => {
  return async (dispatch) => {
    dispatch({
      type: OAUTH2_LOGIN.PENDING,
    });

    const { data, error } = await oauth2Signup(senderInfo);

    if (error) {
      return dispatch({
        type: OAUTH2_LOGIN.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    const { sender, status, provider } = senderMapper.select(data);

    dispatch({
      type: OAUTH2_LOGIN.SUCCESS,
      payload: {
        sender,
        status,
        provider,
      },
    });
  };
};

export const updateLoginState = (state) => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN.PENDING,
    });

    if (!Object.keys(state).length) {
      return dispatch({
        type: LOGIN.ERROR,
        payload: API_ERROR.SOMETHING_WENT_WRONG,
      });
    }

    const { token, roles } = authMapper.select(state);

    securedLS.set(LS_KEY.TOKEN, token);
    await configureLogedInUser(dispatch, roles);

    dispatch({
      type: LOGIN.SUCCESS,
      payload: {
        token,
      },
    });

    history.push(ROUTES.SENDER_ACCOUNT_SETUP);

    securedLS.clear(LS_KEY.SIGN_UP_DATA);
    securedLS.clear(LS_KEY.VERIFIED_PHONE_NUMBER);
    securedLS.clear(LS_KEY.VERIFIED_EMAIL_ADDRESS);

    return;
  };
};

export const authLogOut = () => {
  return async (dispatch) => {
    dispatch({
      type: LOGOUT.PENDING,
    });

    const { error } = await logout();

    if (error) {
      return dispatch({
        type: LOGOUT.ERROR,
        payload: error.message,
      });
    }

    dispatch({
      type: LOGOUT.SUCCESS,
    });
    dispatch(getDestinationCountry());
    // sardine.updateUserId(null);
    // sardine.init();
    deleteSearchParameterCookie();
  };
};

export const setPhoneVerified = () => {
  return (dispatch) => {
    dispatch({
      type: PHONE_VERIFIED,
    });
  };
};

export const toggleLoginModal = () => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_LOGIN_MODAL,
    });
  };
};

export const verifyEmailID = (verificationToken) => {
  return async (dispatch) => {
    dispatch({
      type: VERIFY_EMAIL.PENDING,
    });

    const { error, data } = await verifyEmail(verificationToken);

    if (error) {
      return dispatch({
        type: VERIFY_EMAIL.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    dispatch({
      type: VERIFY_EMAIL.SUCCESS,
      payload: data,
    });
  };
};

export const setKYCStatus = (status) => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_KYC_STATUS.PENDING,
    });

    const { data, error } = await updateKYCStatus(status);

    if (error) {
      return dispatch({
        type: UPDATE_KYC_STATUS.ERROR,
        payload: error.message,
      });
    }

    const { kycStatus, isKYCVerified } = kycStatusMapper.select(data);

    dispatch({
      type: UPDATE_KYC_STATUS.SUCCESS,
      payload: {
        kycStatus,
        isKYCVerified,
      },
    });
  };
};

export const resetError = () => {
  return {
    type: RESET_ERROR,
  };
};
