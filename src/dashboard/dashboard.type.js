import { createActionSet } from 'utils';

export const CANCEL_TRANSACTION = createActionSet('CANCEL_TRANSACTION');
export const FETCH_TRANSACTION_LIST = createActionSet('FETCH_TRANSACTION_LIST');
export const FETCH_FILTERED_TRANSACTION_LIST = createActionSet(
  'FETCH_FILTERED_TRANSACTION_LIST'
);
