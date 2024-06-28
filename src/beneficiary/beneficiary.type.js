import { createActionSet } from 'utils';

export const SAVE_BENEFICIARY_LOCALLY = createActionSet(
  'SAVE_BENEFICIARY_LOCALLY'
);
export const FETCH_BENEFICIARY_STATE = createActionSet(
  'FETCH_BENEFICIARY_STATE'
);

export const RESET_ERROR = 'RESET_ERROR';
export const ADD_BENEFICIARY = createActionSet('ADD_BENEFICIARY');
export const FETCH_PAYER_LIST = createActionSet('FETCH_PAYER_LIST');
export const UPDATE_BENEFICIARY = createActionSet('UPDATE_BENEFICIARY');
export const ADD_PAYOUT_METHOD = createActionSet('ADD_PAYOUT_METHOD');
export const FETCH_BENEFICIARY_BANK = createActionSet('FETCH_BENEFICIARY_BANK');
export const FETCH_BENEFICIARY_LIST = createActionSet('FETCH_BENEFICIARY_LIST');
