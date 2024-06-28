import { adminReducer } from 'admin';
import { senderReducer } from 'sender';
import { reviewReducer } from 'review';
import { combineReducers } from 'redux';
import { paymentReducer } from 'payment';
import { landingPageReducer } from 'landing-page';
import { authReducer, LOGOUT } from 'auth';
import { dashboardReducer } from 'dashboard';
import { beneficiaryReducer } from 'beneficiary';

import { securedLS } from 'utils';

const reducer = combineReducers({
  auth: authReducer,
  home: landingPageReducer,
  admin: adminReducer,
  review: reviewReducer,
  sender: senderReducer,
  payment: paymentReducer,
  dashboard: dashboardReducer,
  beneficiary: beneficiaryReducer,
});

/**
 * Root reducer.
 *
 * @param {Object} state
 * @param {Object} action
 */
const rootReducer = (state, action) => {
  if (action.type === LOGOUT.SUCCESS) {
    state = undefined;
    securedLS.clear();
  }

  return reducer(state, action);
};

export default rootReducer;
