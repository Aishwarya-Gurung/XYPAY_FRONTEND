import { createActionSet } from 'utils';

export const FETCH_SENDER_DEBIT_CARD = createActionSet(
  'FETCH_SENDER_DEBIT_CARD'
);
export const REMOVE_SENDER_FUNDING_SOURCE = createActionSet(
  'REMOVE_SENDER_FUNDING_SOURCE'
);
export const RESET_PAYMENT_DETAILS = 'RESET_PAYMENT_DETAILS';
export const FETCH_FEE_RANGE = createActionSet('FETCH_FEE_RANGE');
export const FETCH_SENDER_BANKS = createActionSet('FETCH_SENDER_BANKS');
export const FETCH_EXCHANGE_RATE = createActionSet('FETCH_EXCHANGE_RATE');
export const SAVE_PAYMENT_DETAIL = createActionSet('SAVE_PAYMENT_DETAIL');
