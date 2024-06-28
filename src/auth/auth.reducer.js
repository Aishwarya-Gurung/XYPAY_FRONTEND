import {
  LOGIN,
  LOGOUT,
  RESET_ERROR,
  VERIFY_EMAIL,
  OAUTH2_LOGIN,
  RESET_PASSWORD,
  PHONE_VERIFIED,
  FORGOT_PASSWORD,
  RESEND_OTP_CODE,
  FETCH_GUEST_INFO,
  OTP_VERIFICATION,
  FETCH_ADMIN_INFO,
  UPDATE_KYC_STATUS,
  FETCH_SENDER_INFO,
  TOGGLE_LOGIN_MODAL,
  INITIALIZE_OTP_VERIFICATION,
  INITIALIZE_RESET_PASSWORD_MESSAGE,
} from './auth.type';
import { updateObject, createReducer } from 'utils';

const initialState = {
  // data
  user: {},
  error: '',
  token: null,
  provider: '',
  kycStatus: null,
  currentTier: null,
  resetPasswordMessage: null,
  forgotPasswordMessage: null,
  isPrivacyPolicyAccepted: false,
  isAccountDeleteRequested: false,

  // UI
  isModalOpen: false,
  isLoggingIn: false,
  isSigningOut: false,

  isKYCVerified: false,
  isUpdatingKycStatus: false,

  isAuthenticated: false,

  isEmailVerified: false,
  isVerifyingEmail: false,

  isPhoneVerified: false,

  isOTPResent: false,
  isResendingOTP: false,
  isFetchingGuestInfo: false,
  isFetchingAdminInfo: false,
  isFetchingSenderInfo: false,

  isRequestingResetPassword: false,
  isRequestingForgotPassword: false,
};

export const authReducer = createReducer(initialState);

authReducer.case(LOGIN.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isLoggingIn: true,
    isAuthenticated: false,
  })
);

authReducer.case(LOGIN.SUCCESS).register((state, action) =>
  updateObject(state, {
    error: '',
    isLoggingIn: false,
    isAuthenticated: true,
    token: action.payload.token,
  })
);

authReducer.case(LOGIN.ERROR).register((state, action) =>
  updateObject(state, {
    isLoggingIn: false,
    isAuthenticated: false,
    error: action.payload,
  })
);

authReducer.case(INITIALIZE_OTP_VERIFICATION).register((state, action) =>
  updateObject(state, {
    isLoggingIn: false,
    token: action.payload.token,
    isOTPResent: true,
    isResendingOTP: false,
  })
);

authReducer.case(OTP_VERIFICATION.PENDING).register((state) =>
  updateObject(state, {
    isLoggingIn: true,
  })
);

authReducer.case(OTP_VERIFICATION.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isLoggingIn: false,
  })
);

authReducer.case(OTP_VERIFICATION.SUCCESS).register((state) =>
  updateObject(state, {
    error: ' ',
    isLoggingIn: false,
    isAuthenticated: true,
  })
);

authReducer.case(RESEND_OTP_CODE.PENDING).register((state) =>
  updateObject(state, {
    isResendingOTP: true,
  })
);

authReducer.case(RESEND_OTP_CODE.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isResendingOTP: false,
    isOTPResent: false,
  })
);

authReducer.case(RESEND_OTP_CODE.SUCCESS).register((state) =>
  updateObject(state, {
    error: ' ',
    isResendingOTP: false,
    isOTPResent: true,
  })
);

authReducer.case(FETCH_SENDER_INFO.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isFetchingSenderInfo: true,
  })
);

authReducer.case(FETCH_SENDER_INFO.SUCCESS).register((state, action) =>
  updateObject(state, {
    error: '',
    isFetchingSenderInfo: false,
    user: action.payload.sender,
    provider: action.payload.provider,
    kycStatus: action.payload.status.kycStatus,
    currentTier: action.payload.status.currentTier,
    isKYCVerified: action.payload.status.isKYCVerified,
    isEmailVerified: action.payload.status.isEmailVerified,
    isPhoneVerified: action.payload.status.isPhoneNumberVerified,
    isPrivacyPolicyAccepted: action.payload.isPrivacyPolicyAccepted,
    isAccountDeleteRequested: action.payload.isAccountDeleteRequested,
  })
);

authReducer.case(FETCH_SENDER_INFO.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isFetchingSenderInfo: false,
  })
);

authReducer.case(FETCH_ADMIN_INFO.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isFetchingAdminInfo: true,
  })
);

authReducer.case(FETCH_ADMIN_INFO.SUCCESS).register((state, action) =>
  updateObject(state, {
    error: '',
    isFetchingAdminInfo: false,
    user: action.payload.admin,
  })
);

authReducer.case(FETCH_ADMIN_INFO.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isFetchingAdminInfo: false,
  })
);

authReducer.case(OAUTH2_LOGIN.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isLoggingIn: true,
  })
);

authReducer.case(OAUTH2_LOGIN.SUCCESS).register((state, action) =>
  updateObject(state, {
    error: '',
    isLoggingIn: false,
    isAuthenticated: true,
    isFetchingGuestInfo: false,
    user: action.payload.sender,
    kycStatus: action.payload.status.kycStatus,
    currentTier: action.payload.status.currentTier,
    isKYCVerified: action.payload.status.isKYCVerified,
    isEmailVerified: action.payload.status.isEmailVerified,
    isPhoneVerified: action.payload.status.isPhoneNumberVerified,
  })
);

authReducer.case(OAUTH2_LOGIN.ERROR).register((state, action) =>
  updateObject(state, {
    isLoggingIn: false,
    isAuthenticated: false,
    error: action.payload,
  })
);

authReducer.case(LOGOUT.PENDING).register((state) =>
  updateObject(state, {
    isSigningOut: true,
  })
);

authReducer.case(LOGOUT.SUCCESS).register(() => initialState);

authReducer.case(LOGOUT.ERROR).register((state, action) =>
  updateObject(state, {
    isSigningOut: false,
    error: action.payload,
  })
);

authReducer.case(TOGGLE_LOGIN_MODAL).register((state) =>
  updateObject(state, {
    isModalOpen: !state.isModalOpen,
  })
);

authReducer.case(PHONE_VERIFIED).register((state) =>
  updateObject(state, {
    isPhoneVerified: true,
  })
);

authReducer.case(VERIFY_EMAIL.PENDING).register((state) =>
  updateObject(state, {
    isVerifyingEmail: true,
  })
);

authReducer.case(VERIFY_EMAIL.SUCCESS).register((state) =>
  updateObject(state, {
    isVerifyingEmail: false,
    isEmailVerified: true,
  })
);

authReducer.case(VERIFY_EMAIL.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isEmailVerified: false,
    isVerifyingEmail: false,
  })
);

authReducer.case(UPDATE_KYC_STATUS.PENDING).register((state) =>
  updateObject(state, {
    isUpdatingKycStatus: true,
  })
);

authReducer.case(UPDATE_KYC_STATUS.SUCCESS).register((state, action) =>
  updateObject(state, {
    isUpdatingKycStatus: false,
    kycStatus: action.payload.kycStatus,
    isKYCVerified: action.payload.isKYCVerified,
  })
);

authReducer.case(UPDATE_KYC_STATUS.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isUpdatingKycStatus: false,
  })
);

authReducer.case(FETCH_GUEST_INFO.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isFetchingGuestInfo: true,
  })
);

authReducer.case(FETCH_GUEST_INFO.SUCCESS).register((state, action) =>
  updateObject(state, {
    user: action.payload.sender,
    isFetchingGuestInfo: false,
  })
);

authReducer.case(FETCH_GUEST_INFO.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isFetchingGuestInfo: false,
  })
);

authReducer.case(FORGOT_PASSWORD.PENDING).register((state) =>
  updateObject(state, {
    isRequestingForgotPassword: true,
    forgotPasswordMessage: '',
    error: '',
  })
);

authReducer.case(FORGOT_PASSWORD.SUCCESS).register((state, action) =>
  updateObject(state, {
    isRequestingForgotPassword: false,
    forgotPasswordMessage: action.payload,
  })
);

authReducer.case(FORGOT_PASSWORD.ERROR).register((state, action) =>
  updateObject(state, {
    isRequestingForgotPassword: false,
    error: action.payload,
  })
);

authReducer.case(INITIALIZE_RESET_PASSWORD_MESSAGE).register((state) =>
  updateObject(state, {
    isRequestingResetPassword: false,
    resetPasswordMessage: '',
    error: '',
  })
);

authReducer.case(RESET_PASSWORD.PENDING).register((state) =>
  updateObject(state, {
    isRequestingResetPassword: true,
    resetPasswordMessage: '',
    error: '',
  })
);

authReducer.case(RESET_PASSWORD.SUCCESS).register((state, action) =>
  updateObject(state, {
    isRequestingResetPassword: false,
    resetPasswordMessage: action.payload,
  })
);

authReducer.case(RESET_PASSWORD.ERROR).register((state, action) =>
  updateObject(state, {
    isRequestingResetPassword: false,
    error: action.payload,
  })
);

authReducer.case(RESET_ERROR).register((state) =>
  updateObject(state, {
    error: '',
  })
);
