import { createActionSet } from '../utils/store-helper';

export const FETCH_SOURCE_DESTINATION_COUNTRY = createActionSet(
  'FETCH_SOURCE_DESTINATION_COUNTRY'
);
export const UNLOCK_SENDER = createActionSet('UNLOCK_SENDER');
export const FETCH_LOCKED_SENDER = createActionSet('FETCH_LOCKED_SENDER');
export const FETCH_FEES_PARAMETER = createActionSet('FETCH_FEES_PARAMETER');
