export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CONTACT: '/contact',
  PRODUCTS: '/products',
  ABOUT_US: '/about-us',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transaction',
  OAUTH_REDIRECT: '/oauth2/redirect',
  VERIFY_EMAIL: '/user/verify-email',

  PAYMENT_DETAILS: '/payment/details',
  PAYMENT_INFORMATION: '/payment/information',

  BENEFICIARY_DETAILS: '/beneficiary',
  BENEFICIARY_LIST: '/beneficiary/list',
  ADD_BENEFICIARY: '/beneficiary/create',
  NEW_BENEFICIARY: '/user/beneficiary/create',
  BENEFICIARY_PAYOUT_METHOD: '/beneficiary/payout-method',
  BENEFICIARY_PAYOUT_METHOD_LIST: '/beneficiary/payout-method/list',
  ADD_BENEFICIARY_PAYOUT_METHOD: '/beneficiary/payout-method/create',

  SENDER_SIGN_IN: '/login',
  SENDER_SIGN_UP: '/registration',
  SENDER_ACCOUNT: '/user/account',
  SENDER_DETAILS: '/user/details',
  SENDER_PROFILE: '/user/profile',
  SENDER_SETTINGS: '/user/settings',
  SENDER_CARD_ACCOUNT: '/user/debit-card/',
  SENDER_BANK_ACCOUNT: '/user/bank-account',
  SENDER_ACCOUNT_SETUP: '/user/account-setup',
  SENDER_VERIFICATION: '/account/verification',
  SENDER_CONTACT_VERIFICATION: '/user/account/verification',
  SENDER_REGISTRATION_ON_FLOW: '/auth/registration',

  RESET_PASSWORD: '/user/reset-password',
  FORGOT_PASSWORD: '/user/forgot-password',

  TERMS_OF_SERVICE: '/terms-of-service',
  PRIVACY_POLICY: '/privacy-policy',
  GMT: '/gmt',

  // admin rotes
  ADMIN_SETTING: '/admin/settings',
  ADMIN_DASHBOARD: '/admin/dashboard',

  FEE_SET: '/admin/fee-sets',
  ADD_FEE_SET: '/admin/fee-set/create',
  FEES_PARAMETER: '/admin/fees/parameter',
  LOCKED_SENDERS: '/admin/senders/locked',
  DELETE_REQUESTS: '/admin/senders/delete-requests',
};
