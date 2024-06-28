export const ADMIN_MENU = {
  DASHBOARD: 'Dashboard',
  ADD_FEE_SET: 'Add Fee Sets',
  FEE_SET: 'Fee Sets',
  UNLOCK_SENDERS: 'Unlock Senders',
  DELETE_REQUESTS: 'Account Delete Requests',
  SETTING: 'Setting',
};

export const MESSAGES = {
  FIELD_CANNOT_BE_EMPTY: 'This field cannot be empty',
  FEE_SET_NOT_CREATED: 'Unable to save new fee set',
  FEE_SET_CREATED: 'Fee set has been saved successfully',
};

export const LOCK_REASONS = [
  {
    name: 'MAX_LOGIN_LIMIT_EXCEEDED',
    value: 'Login attempt limit exceeded',
    label: 'Login limit exceeded',
  },
  {
    name: 'SPAM_ACCOUNT',
    value: 'Spam account. User is locked by Admin.',
    label: 'Spam account',
  },
  {
    name: 'DEVICE_VERIFICATION_CODE_RESEND_LIMIT_EXCEEDED',
    value: 'Device verification code resend limit exceeded',
    label: 'Device verification code resend limit exceeded',
  },
  {
    name: 'DEVICE_VERIFICATION_ATTEMPT_LIMIT_EXCEEDED',
    value: 'Device verification attempt limit exceeded',
    label: 'Device verification attempt limit exceeded',
  },
  {
    name: 'PHONE_VERIFICATION_CODE_RESEND_LIMIT_EXCEEDED',
    value: 'Phone verification code resend limit exceeded',
    label: 'Phone verification code resend limit exceeded',
  },
  {
    name: 'PHONE_VERIFICATION_ATTEMPT_LIMIT_EXCEEDED',
    value: 'Phone verification attempt limit exceeded',
    label: 'Phone verification attempt limit exceeded',
  },
  {
    name: 'EMAIL_VERIFICATION_CODE_RESEND_LIMIT_EXCEEDED',
    value: 'Email verification code resend limit exceeded',
    label: 'Email verification code resend limit exceeded',
  },
  {
    name: 'EMAIL_VERIFICATION_ATTEMPT_LIMIT_EXCEEDED',
    value: 'Email verification attempt limit exceeded',
    label: 'Email verification attempt limit exceeded',
  },
];

export const SENDER_SEARCH_OPTION = {
  EMAIL: 'email',
  LOCK_REASON: 'lock_reason',
};
