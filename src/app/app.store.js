import thunk from 'redux-thunk';
import reducer from './app.reducer';
import { createStore, applyMiddleware, compose } from 'redux';

import { LS_KEY } from 'auth';
import { isLocalEnvironment } from './app.env';
import { securedLS, isObject, getReduxState, isEmpty } from 'utils';

/**
 * Returns available states from local storage.
 *
 */
function getAvailableState() {
  const { auth } = getAuthState();
  const features = getFeatures();
  const paymentDetail = getPaymentDetailsState();
  const selectedCountry = getSelectedCountryState();

  return {
    auth: { ...auth },
    payment: {
      paymentDetail: paymentDetail || {},
    },
    home: {
      features: features || {},
      selectedCountry: selectedCountry || {},
      isSendButtonDisabled: !Object.keys(selectedCountry).length,
    },
  };
}

/**
 * Returns available auth state from local storage.
 *
 */
function getAuthState() {
  const { data, error } = securedLS.get(LS_KEY.CURRENT_USER);

  if (error) {
    window.location.reload();

    return {};
  }

  return data;
}

/**
 * Returns available payment details state from local storage.
 *
 */
function getPaymentDetailsState() {
  const { data, error } = securedLS.get('paymentDetail');

  if (error) {
    return {};
  }

  return data;
}

/**
 * Returns available selected country state from local storage.
 *
 */
function getSelectedCountryState() {
  const { data, error } = securedLS.get('selectedCountry');

  if (error) {
    return {};
  }

  return data;
}

function getFeatures() {
  const { data, error } = securedLS.get('features');

  if (isEmpty(error)) {
    return data;
  }
}

const middleWare = applyMiddleware(thunk);

const store = createStore(
  reducer,
  getAvailableState(),
  isLocalEnvironment()
    ? compose(middleWare, getDevToolConfig())
    : compose(middleWare)
);

function getDevToolConfig() {
  return (
    window.__REDUX_DEVTOOLS_EXTENSION__.call &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

/**
 * Observes the states changing.
 *
 * @param {Object} store
 * @param {Function} select
 * @param {Function} onChange
 */
function observeStore(store, select, onChange) {
  let currentState;

  /**
   * Handles onchange method while states
   * are changed in redux state.
   *
   */
  function handleChange() {
    const nextState = select(store.getState());

    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);

  handleChange();

  return unsubscribe;
}

/**
 * Return selected state.
 *
 * @param {Object} state
 */
function selectAuthState(state) {
  return getReduxState(['auth'], state);
}

/**
 * Persist states on change in redux state.
 *
 * @param {Object} currentState
 */
function onChange(currentState) {
  if (!currentState.isEmailVerified || !currentState.isPhoneVerified) {
    currentState = validateUserVerification(currentState);
  }

  const isSignedIn = securedLS.get(LS_KEY.TOKEN);
  const currentAuth = { auth: currentState };

  if (isSignedIn.data) {
    currentAuth.auth = filterState(currentAuth.auth);

    return securedLS.set(LS_KEY.CURRENT_USER, currentAuth);
  }
}

/**
 * Updates verification status from previous states.
 *
 * @param {Object} currentState
 */
function validateUserVerification(currentState) {
  const { auth } = securedLS.get(LS_KEY.CURRENT_USER).data;

  if (isObject(auth)) {
    if (!currentState.isEmailVerified) {
      currentState.isEmailVerified = auth.isEmailVerified;
    }

    if (!currentState.isPhoneVerified) {
      currentState.isPhoneVerified = auth.isPhoneVerified;
    }
  }

  return currentState;
}

observeStore(store, selectAuthState, onChange);

/**
 * Filters required state from whole auth state.
 *
 * @param {Object} state
 */
function filterState(state) {
  const requiredState = [
    'user',
    'token',
    'provider',
    'kycStatus',
    'currentTier',
    'isKYCVerified',
    'isAuthenticated',
    'isEmailVerified',
    'isPhoneVerified',
    'isPrivacyPolicyAccepted',
    'isAccountDeleteRequested',
  ];

  const auth = {};

  for (const key in state) {
    if (
      Object.prototype.hasOwnProperty.call(state, key) &&
      requiredState.includes(key)
    ) {
      auth[key] = state[key];
    }
  }

  return auth;
}

export default store;
