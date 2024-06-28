import { COUNTRY } from 'app/app.constant';
import { NUMBER_TYPE } from './utils.constant';
import { PASSWORD_RULE } from 'sender/sender.constant';

export const isInputEmpty = (input) => {
  if (!input.value) {
    return true;
  } else {
    unsetIsInvalidField(input);

    return false;
  }
};

export const setIsInvalidField = (input) => {
  input.classList.add('is-invalid');
};

export const unsetIsInvalidField = (input) => {
  input.classList.remove('is-invalid');
};

export const phoneValidator = () => {
  return {
    validate: function (phoneNumber, country) {
      switch (country) {
        case COUNTRY.ARMENIA:
        case COUNTRY.GUINEA:
          return /^\d{8}$/.test(phoneNumber);

        case COUNTRY.USA:
        case COUNTRY.RUSSIA:
          return /^\d{10}$/.test(phoneNumber);

        case COUNTRY.KENYA:
        case COUNTRY.NIGERIA:
        case COUNTRY.SIERRA_LEONE:
          return /^\d{9}$/.test(phoneNumber);

        default:
          return false;
      }
    },

    getMaxLength: function (country) {
      switch (country) {
        case COUNTRY.ARMENIA:
        case COUNTRY.GUINEA:
          return 8;

        case COUNTRY.KENYA:
        case COUNTRY.NIGERIA:
        case COUNTRY.SIERRA_LEONE:
          return 9;

        case COUNTRY.USA:
        case COUNTRY.RUSSIA:
          return 10;

        default:
          return 10;
      }
    },
  };
};

export const validatePassword = (password) => {
  const error = getInvalidPasswordRule(password);

  return error.length === 0;
};

export const hasSpecialCharacter = (str) => {
  return /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(str);
};

export const hasNumber = (str) => {
  return /\d/.test(str);
};

export const hasUpperCase = (str) => {
  return /[A-Z]/.test(str);
};

export const hasLowerCase = (str) => {
  return /[a-z]/.test(str);
};

export const hasMinSixChar = (str) => {
  return str.length >= 6;
};

export const getInvalidPasswordRule = (password) => {
  const error = [];

  if (!hasSpecialCharacter(password)) {
    error.push(PASSWORD_RULE.SPECIAL_CHAR);
  }

  if (!hasNumber(password)) {
    error.push(PASSWORD_RULE.NUMBER);
  }

  if (!hasLowerCase(password)) {
    error.push(PASSWORD_RULE.LOWER_CASE);
  }

  if (!hasUpperCase(password)) {
    error.push(PASSWORD_RULE.UPPER_CASE);
  }

  if (!hasMinSixChar(password)) {
    error.push(PASSWORD_RULE.MIN_CHAR);
  }

  return error;
};

export const validateName = (name) => {
  return /^[A-Za-zŞÖÓ]+(([',\- ])?[A-Za-zŞÖÓéöðóīñễấũł.])+$/.test(name);
};

export const validateEmail = (email) => {
  return /^([\w.\-_]+)?\w+@[\w-_]+(\.[\w]+){1,}$/.test(email);
};

export const validatePostalCode = (postalCode, country) => {
  switch (country) {
    case COUNTRY.RUSSIA:
    case COUNTRY.ARMENIA:
      return /^[0-9]{4}$/.test(postalCode);

    case COUNTRY.USA:
    case COUNTRY.KENYA:
    case COUNTRY.NIGERIA:
    case COUNTRY.SIERRA_LEONE:
      return /^[0-9]{5,9}$/.test(postalCode);

    default:
      return false;
  }
};

export const getPostalCodeLength = (country) => {
  switch (country) {
    case COUNTRY.ARMENIA:
      return 4;

    case COUNTRY.RUSSIA:
      return 6;

    case COUNTRY.KENYA:
    case COUNTRY.NIGERIA:
    case COUNTRY.SIERRA_LEONE:
      return 9;

    default:
      return 10;
  }
};

export const validateCountryCode = (country, code) => {
  return country.phoneCode === code;
};

export const validateDateOfBirth = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};

export const isDateValid = (date) => {
  const newDate = new Date(date);

  return newDate.toDateString() !== 'Invalid Date';
};

export const validateAddress = (address) => {
  return /^$|^[^*!#|":<>[\]{}`\\()';@&$%^]+$/.test(address);
};

export const validateString = (string) => {
  return /^[a-zA-ZÀ-ÖØ-öø-ÿ]+(\s[a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(string);
};

export const getYear = () => {
  let max = 100;
  const years = [];
  let year = new Date().getFullYear();

  do {
    years.push(year--);
    max--;
  } while (max > 0);

  return years;
};

export const getDaysInMonth = (year, month) => {
  const daysInMonth = [];

  if (month && year) {
    const numberOfDaysInMonth = new Date(
      parseInt(year),
      parseInt(month), // Jan value should be 0 instead of 1
      0
    ).getDate();

    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      daysInMonth.push(i);
    }
  }

  return daysInMonth;
};

export const serializeArray = (form) => {
  // Setup our serialized data
  const serialized = [];

  // Loop through each field in the form
  for (let i = 0; i < form.elements.length; i++) {
    const field = form.elements[i];

    // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
    if (
      !field.name ||
      field.disabled ||
      field.type === 'file' ||
      field.type === 'reset' ||
      field.type === 'submit' ||
      field.type === 'button'
    ) {
      continue;
    }

    // If a multi-select, get all selections
    if (field.type === 'select-multiple') {
      for (let n = 0; n < field.options.length; n++) {
        if (!field.options[n].selected) {
          continue;
        }
        serialized.push({
          name: field.name,
          value: field.options[n].value,
        });
      }

      // Convert field data to a query string
    } else if (
      (field.type !== 'checkbox' && field.type !== 'radio') ||
      field.checked
    ) {
      serialized.push({
        name: field.name,
        value: field.value,
      });
    }
  }

  return serialized;
};

export const validateNumber = (e, type = NUMBER_TYPE.INTEGER) => {
  const regex = type === NUMBER_TYPE.INTEGER ? /[0-9]/ : /[0-9]|\./;
  const theEvent = e || window.event;
  const excludedKeys = ['Backspace', 'Tab'];
  let key = null;

  if (theEvent.type === 'paste') {
    key = e.clipboardData.getData('text/plain');
  } else {
    key = theEvent.key || theEvent.which;
  }

  if (!excludedKeys.includes(key) && !regex.test(key)) {
    theEvent.returnValue = false;

    if (theEvent.preventDefault) {
      theEvent.preventDefault();
    }
  }
};

export const validateAlphabet = (e) => {
  const regex = /[A-Za-z ]/;
  const theEvent = e || window.event;
  let key = null;

  if (theEvent.type === 'paste') {
    key = e.clipboardData.getData('text/plain');
  } else {
    key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
  }

  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) {
      theEvent.preventDefault();
    }
  }
};

export const getYearsAfter2024 = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2024;

  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => currentYear - index
  );
};
