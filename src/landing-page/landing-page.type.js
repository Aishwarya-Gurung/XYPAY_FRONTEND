import { createActionSet } from 'utils';

export const FETCH_SOURCE_COUNTRY_LIST = createActionSet(
  'FETCH_SOURCE_COUNTRY_LIST'
);
export const FETCH_DESTINATION_COUNTRY_LIST = createActionSet(
  'FETCH_DESTINATION_COUNTRY_LIST'
);
export const FETCH_STATES = createActionSet('FETCH_STATES');
export const PERSIST_SELECTED_COUNTRY = 'PERSIST_SELECTED_COUNTRY';
