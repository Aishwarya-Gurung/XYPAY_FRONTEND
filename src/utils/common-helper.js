import {
  ROUTES,
  API_ERROR,
  STATUS_CODE,
  PAYOUT_METHOD,
  PAYMENT_METHOD,
} from 'app';
import { ADMIN_MENU } from 'admin';
import { ACCOUNT_MENU } from 'sender';

const toString = Object.prototype.toString;

export const isObject = (arg) => {
  return toString.call(arg) === '[object Object]';
};

export const withError = (arg) => {
  if (isObject(arg)) {
    const { message = '', ...rest } = arg;

    return {
      data: null,
      error: {
        status: true,
        message,
        ...rest,
      },
    };
  }

  return {
    data: null,
    error: {
      status: true,
      message: arg,
    },
  };
};

export const withData = (data) => {
  return {
    error: false,
    data,
  };
};

export const serialize = (data) => {
  return JSON.stringify(data);
};

export const parse = (data) => {
  try {
    const parsedData = JSON.parse(data);

    return withData(parsedData);
  } catch (error) {
    return withError(error);
  }
};

export const scrollToTop = () => window.scrollTo(0, 0);

export const isEmpty = (value) =>
  !value ||
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export const getValueOfParam = (props, name) => {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

  const results = regex.exec(props.location.search);

  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export const abbreviateNumber = (num, decimalDigit = 1) => {
  let numLength = ('' + num.toFixed()).length;

  decimalDigit = Math.pow(10, decimalDigit);
  numLength -= numLength % 3;

  return (
    Math.round((num * decimalDigit) / Math.pow(10, numLength)) / decimalDigit +
    ' KMGTPE'[numLength / 3]
  );
};

export const getProperCaseOf = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};

export const hasOwnProperties = (keys, obj) => {
  for (let i = 0; i < keys.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(obj, keys[i])) {
      return false;
    }
  }

  return true;
};

export const getEmptyKey = (obj) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === '') {
      return key;
    }
  }

  return true;
};

export const hasValue = (obj) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === '') {
      return false;
    }
  }

  return true;
};

export const toLocalDateTime = (UTCDateTime) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  };

  return new Date(`${UTCDateTime} UTC`).toLocaleDateString('en', options);
};

export const addPadding = (number, pad) => {
  return String(number).padStart(2, pad);
};

export const checkObjectDepth = (object) => {
  let level = 1;

  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) {
      continue;
    }

    if (isObject(object[key])) {
      const depth = checkObjectDepth(object[key]) + 1;

      level = Math.max(depth, level);
    }
  }

  return level;
};

export const initializeCounter = () => {
  let counter = 0;

  return {
    count: function () {
      return ++counter;
    },

    reset: function () {
      return (counter = 0);
    },
  };
};

export const serializeObjectToQuery = (object) => {
  const string =
    '?' +
    Object.keys(object)
      .reduce((array, key) => {
        array.push(key + '=' + encodeURIComponent(object[key]));

        return array;
      }, [])
      .join('&');

  return string;
};

export const getMinValueFrom = (arr) => {
  return Math.min.apply(Math, arr);
};

export const getErrorMessage = (status, message) => {
  switch (status) {
    case STATUS_CODE.BAD_REQUEST:
      return message;

    case STATUS_CODE.GONE:
      return API_ERROR.VERIFICATION_CODE_EXPIRED;

    default:
      return API_ERROR.SOMETHING_WENT_WRONG;
  }
};

export const getIconFor = (type) => {
  switch (type) {
    case ACCOUNT_MENU.PROFILE:
      return 'contact';

    case ACCOUNT_MENU.CARD:
      return 'card';

    case ACCOUNT_MENU.SETTINGS:
      return 'construct';

    case ACCOUNT_MENU.BANK:
      return 'business';

    case ACCOUNT_MENU.TRANSACTIONS:
      return 'swap';

    case ACCOUNT_MENU.BENEFICIARY:
      return 'contacts';

    case PAYOUT_METHOD.CASH_PICKUP:
      return 'cash';

    case PAYOUT_METHOD.BANK_DEPOSIT:
      return 'business';

    case PAYOUT_METHOD.WALLET:
      return 'phone-portrait';

    case PAYOUT_METHOD.HOME_DELIVERY:
      return 'home';

    case PAYMENT_METHOD.DEBIT_CARD:
      return 'card';

    case PAYMENT_METHOD.BANK_ACCOUNT:
      return 'business';

    case ADMIN_MENU.DASHBOARD:
      return 'speedometer';

    case ADMIN_MENU.FEE_SET:
      return 'cash';

    case ADMIN_MENU.ADD_FEE_SET:
      return 'add-circle-outline';

    case ADMIN_MENU.UNLOCK_SENDERS:
      return 'contacts';

    case ADMIN_MENU.DELETE_REQUESTS:
      return 'trash';

    case ADMIN_MENU.SETTING:
      return 'construct';

    default:
      return '';
  }
};

export const getRouteFor = (menu) => {
  switch (menu) {
    case ACCOUNT_MENU.PROFILE:
      return ROUTES.SENDER_PROFILE;

    case ACCOUNT_MENU.CARD:
      return ROUTES.SENDER_CARD_ACCOUNT;

    case ACCOUNT_MENU.DASHBOARD:
      return ROUTES.DASHBOARD;

    case ACCOUNT_MENU.SETTINGS:
      return ROUTES.SENDER_SETTINGS;

    case ACCOUNT_MENU.BANK:
      return ROUTES.SENDER_BANK_ACCOUNT;

    case ACCOUNT_MENU.BENEFICIARY:
      return ROUTES.BENEFICIARY_LIST;

    case ACCOUNT_MENU.TRANSACTIONS:
      return ROUTES.TRANSACTIONS;

    case ADMIN_MENU.DASHBOARD:
      return ROUTES.ADMIN_DASHBOARD;

    case ADMIN_MENU.FEE_SET:
      return ROUTES.FEE_SET;

    case ADMIN_MENU.ADD_FEE_SET:
      return ROUTES.ADD_FEE_SET;

    case ADMIN_MENU.UNLOCK_SENDERS:
      return ROUTES.LOCKED_SENDERS;

    case ADMIN_MENU.SETTING:
      return ROUTES.ADMIN_SETTING;

    case ADMIN_MENU.DELETE_REQUESTS:
      return ROUTES.DELETE_REQUESTS;

    default:
      return '';
  }
};

export const dynamicSort = (property) => {
  let sortOrder = 1;

  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder === -1) {
      return b[property].localeCompare(a[property]);
    }

    return a[property].localeCompare(b[property]);
  };
};

export const getObjectKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const convertUTCtoPST = (date) => {
  const pst = new Date(`${date} UTC`).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles', //  Los angeles has the same time as PST and also considers daylight saving.
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: 'true',
  });

  function isPDTorPST() {
    const utcTime = Date.parse(date);
    const pstTime = Date.parse(pst);
    const diff = (utcTime - pstTime) / 3600000;

    if (diff === 7) {
      return 'PDT';
    }

    return 'PST';
  }

  return `${pst} ${isPDTorPST(date, pst)}`;
};

export const formatExchangeRate = (
  receivingCurrency,
  paymentCurrency,
  exchangeRate
) => {
  return `${withCurrency('1', paymentCurrency)} = ${withCurrency(
    exchangeRate,
    receivingCurrency
  )}`;
};

export const withCurrency = (value, currencyType) => {
  if (Number.isInteger(parseFloat(value))) {
    value = `${value}.00`;
  }

  return `${value} (${currencyType})`;
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toISOFormattedDate = (dateString) => {
  const dateObj = new Date(dateString);

  return dateObj.toISOString().slice(0, 10);
};

export const maskPhoneNumber = (phoneNumber) => {
  const phoneReg = /(\d{1})(\d{3})(\d{3})(\d{4})/;
  const maskedPhoneNumber = phoneNumber.replace(
    phoneReg,
    (_, countryCode, areaCode, exchangeCode, lineNumber) => {
      return countryCode + '-XXX-XXX-' + lineNumber;
    }
  );

  return maskedPhoneNumber;
};

export const maskEmail = (email) => {
  const emailSplits = email.split('@');
  const username = emailSplits[0];
  const domain = emailSplits[1];
  let maskedUsername;

  if (username.length <= 2) {
    maskedUsername = '*'.repeat(4);
  } else {
    maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
  }

  return maskedUsername + '@' + domain;
};

export function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);

  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i);

    bytes[i] = ascii;
  }

  return bytes;
}

export const getLocalDate = (dtString) => {
  const dateObj = new Date(dtString);

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

export const isPaymentMethodCard = (paymentMethod) => {
  return paymentMethod === PAYMENT_METHOD.getKeyOf(PAYMENT_METHOD.DEBIT_CARD);
};
