


export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  PUBLIC: 'PUBLIC',

  getAdminGroup: function () {
    return [this.ADMIN];
  },

  getUserGroup: function () {
    return [this.USER];
  },

  getPublicGroup: function () {
    return [this.PUBLIC];
  },

  isAdmin: function (roles) {
    return roles.includes(this.ADMIN);
  },
};

export const TXN_AMOUNT = {
  MIN: 10,
  MAX: 10000,
  MAX_WALLET_SENDING_AMT: 700,
  MAX_CARD_SENDING_AMT: 2000,
  CARD_LIMIT_INCLUDING_FEES: 2100,
};

export const PAYMENT_METHOD = {
  DEBIT_CARD: 'Debit Card',
  BANK_ACCOUNT: 'Bank Account',
  KHALTI: 'Khalti',

  getValueOf: function (paymentMethod) {
    switch (paymentMethod) {
      case 'CARD':
        return this.DEBIT_CARD;

      case 'BANK':
        return this.BANK_ACCOUNT;

      default:
        return;
    }
  },

  getKeyOf: function (paymentMethod) {
    switch (paymentMethod) {
      case this.DEBIT_CARD:
        return 'CARD';

      case this.BANK_ACCOUNT:
        return 'BANK';

      default:
        return '';
    }
  },
};

export const PAYOUT_METHOD = {
  //  Note: Just change the right side value of payout methods if needed to change the text in display.

  WALLET: 'Mobile Money',
  CASH_PICKUP: 'Pickup Cash',
  BANK_DEPOSIT: 'Bank Deposit',
  HOME_DELIVERY: 'Home Delivery',

  getKeyOf: function (payoutMethod) {
    return Object.keys(PAYOUT_METHOD).find(
      (key) => PAYOUT_METHOD[key] === payoutMethod
    );
  },
};

const API_BASE_URL = process.env.REACT_APP_BASE_URL;
const OAUTH2_REDIRECT_URI = process.env.REACT_APP_OAUTH2_REDIRECT_URI;

export const AUTH_URL = {
  GOOGLE: `${API_BASE_URL}/oauth2/authorize/google?redirect_uri=${OAUTH2_REDIRECT_URI}`,
  FACEBOOK: `${API_BASE_URL}/oauth2/authorize/facebook?redirect_uri=${OAUTH2_REDIRECT_URI}`,
};

export const API_ERROR = {
  LOGIN: 'Your email and password does not match',
  VERIFICATION_CODE_EXPIRED: 'Verification code has expired',
  VERIFICATION_CODE_DOES_NOT_MATCH: 'Verification code does not match.',
  SOMETHING_WENT_WRONG:
    'Something went wrong. Please try again later or contact our customer support',
};

export const PAYMENT_RECEIVE_TYPE = {
  WALLET: 'Mobile Money',
  CASH_PICKUP: 'Pickup Cash',
  BANK_DEPOSIT: 'Bank Deposit',
  HOME_DELIVERY: 'Home Delivery',
  PRABHU_COOPERATIVE: 'Prabhu Cooperative',
};

export const RECIPIENT_BANK_INSTRUCTION = {
  WALLET: 'Pay to Wallet',
  BANK_DEPOSIT: 'Account Deposit',
  CASH_PICKUP: 'CASH PICKUP',
};

export const PAYMENT_SOURCE_TYPE = {
  DEBIT_CARD: 'Debit Card',
  BANK_ACCOUNT: 'Bank Account',
};

export const COUNTRY = {
  USA: 'USA',
  RUSSIA: 'RUS',
  ARMENIA: 'ARM',
  KENYA: 'KEN',
  NIGERIA: 'NGA',
  SIERRA_LEONE: 'SLE',
  GUINEA: 'GIN',
};

export const MSB = {
  PRABHU: {
    NAME: 'PRABHU',
    STATES: [],
  },

  GMT: {
    NAME: 'GMT',
    STATES: [],
  },
};

export const CURRENCY = {
  USD: 'USD',
  SLE: 'SLE',
  GIN: 'GIN',
};

export const RELATIONSHIP = [
  'Aunt',
  'Brother',
  'Brother in Law',
  'Cousin',
  'Daughter',
  'Father',
  'Father in Law',
  'Friends',
  'Grand Father',
  'Grand Mother',
  'Husband',
  'Mother',
  'Mother in law',
  'Nephew',
  'Niece',
  'Self',
  'Sister',
  'Sister in Law',
  'Son',
  'Uncle',
  'Wife',
];

export const REMITTANCE_PURPOSE = [
  {
    name: 'Land Purchase',
    icon: 'map',
  },
  {
    name: 'House Purchase',
    icon: 'home',
  },
  {
    name: 'House Building',
    icon: 'business',
  },
  {
    name: 'Loan Repayment',
    icon: 'repeat',
  },
  {
    name: 'Education Expenses',
    icon: 'school',
  },
  {
    name: 'Medical Expenses',
    icon: 'medkit',
  },
  {
    name: 'Family Expenses',
    icon: 'contacts',
  },
  {
    name: 'Savings Deposits',
    icon: 'save',
  },
  {
    name: 'Marriage Expenses',
    icon: 'ribbon',
  },
  {
    name: 'Travelling Expenses',
    icon: 'train',
  },
  {
    name: 'Gifts',
    icon: 'gift',
  },
];
export const COOKIE_KEY = {
  TOKEN: '_token',
  ACCEPT_COOKIE: '_ac',
  SEARCH_PARAMETER: '_sp',
  SESSION_ID: 'sessionId',
  ACCEPT_PRIVACY_POLICY: '_app',
  BANK_RELOGIN: '_bank-relogin',
  PAYMENT_METHOD: '_payment-method',
  PAYMENT_DETAIL: '_payment-detail',
};

export const VERIFICATION_TYPE = {
  EMAIL_VERIFICATION: 'email-verification',
  PHONE_VERIFICATION: 'phone-verification',
};

export const PROVIDER = Object.freeze({
  SYSTEM: 'SYSTEM',
  MIGRATED: 'MIGRATED',
});

export const PAGING = {
  PAGE: 0,
  PAGE_SIZE: 20,
  TOTAL_COUNT: 0,
};

export const THREE_DS_STATUS = Object.freeze({
  HOLD: 'HOLD',
  FAILED: 'FAILED',
  VERIFIED: 'VERIFIED',
  SUBMITTED: 'SUBMITTED',
  UNVERIFIED: 'UNVERIFIED',
  IN_PROGRESS: 'IN_PROGRESS',
});

export const THREE_DS_EVENT = Object.freeze({
  THREE_DS_VERIFIED: 'THREE_DS_VERIFIED',
  THREE_DS_HOLD: 'THREE_DS_HOLD',
  THREE_DS_FAILED: 'THREE_DS_FAILED',
  THREE_DS_IN_PROGRESS: 'THREE_DS_IN_PROGRESS',
  THREE_DS_UNVERIFIED: 'THREE_DS_UNVERIFIED',
});
