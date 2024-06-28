import { createActionSet } from 'utils';

export const RESET_ERROR = 'RESET_ERROR';
export const LOGIN = createActionSet('LOGIN');
export const PHONE_VERIFIED = 'PHONE_VERIFIED';
export const LOGOUT = createActionSet('LOGOUT');
export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODEL';
export const OAUTH2_LOGIN = createActionSet('OAUTH2_LOGIN');
export const VERIFY_EMAIL = createActionSet('VERIFY_EMAIL');
export const RESET_PASSWORD = createActionSet('RESET_PASSWORD');
export const FORGOT_PASSWORD = createActionSet('FORGOT_PASSWORD');
export const RESEND_OTP_CODE = createActionSet('RESEND_OTP_CODE');
export const OTP_VERIFICATION = createActionSet('OTP_VERIFICATION');
export const FETCH_GUEST_INFO = createActionSet('FETCH_GUEST_INFO');
export const FETCH_ADMIN_INFO = createActionSet('FETCH_ADMIN_INFO');
export const UPDATE_KYC_STATUS = createActionSet('UPDATE_KYC_STATUS');
export const FETCH_SENDER_INFO = createActionSet('FETCH_SENDER_INFO');
export const INITIALIZE_OTP_VERIFICATION = 'INITIALIZE_OTP_VERIFICATION';
export const INITIALIZE_RESET_PASSWORD_MESSAGE =
  'INITIALIZE_RESET_PASSWORD_MESSAGE';
