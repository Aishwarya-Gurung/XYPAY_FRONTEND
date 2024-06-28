import i18n from 'i18next';

import {
  FETCH_STATES,
  PERSIST_SELECTED_COUNTRY,
  FETCH_SOURCE_COUNTRY_LIST,
  FETCH_DESTINATION_COUNTRY_LIST,
} from './landing-page.type';
import { dynamicSort, securedLS } from 'utils';
import {
  stateMapper,
  countryMapper,
  featureMapper,
} from './landing-page.mapper';
import { fetchStates, fetchSourceCountry, fetchDestinationCountry } from 'api';

/**
 * Fetch source countries list.
 *
 */
export const getSourceCountry = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_SOURCE_COUNTRY_LIST.PENDING,
    });

    const { data, error } = await fetchSourceCountry();

    if (error) {
      return dispatch({
        type: FETCH_SOURCE_COUNTRY_LIST.ERROR,
        payload: error.message,
      });
    }

    // List of countries is mapped inside result
    const { result } = countryMapper.select(data);

    return dispatch({
      type: FETCH_SOURCE_COUNTRY_LIST.SUCCESS,
      payload: result,
    });
  };
};

/**
 * Fetch destination countries list.
 *
 */
export const getDestinationCountry = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_DESTINATION_COUNTRY_LIST.PENDING,
    });

    const { data, error } = await fetchDestinationCountry('USA');

    if (error) {
      return dispatch({
        type: FETCH_DESTINATION_COUNTRY_LIST.ERROR,
        payload: error.message,
      });
    }

    // List of countries is mapped inside result
    const { result } = countryMapper.select(data);

    return dispatch({
      type: FETCH_DESTINATION_COUNTRY_LIST.SUCCESS,
      payload: result,
    });
  };
};

/**
 * Saves selected country.
 *
 * @param {String} selectedCountry
 */
export const saveSelectedCountry = (selectedCountry) => {
  return (dispatch) => {
    dispatch({
      type: PERSIST_SELECTED_COUNTRY,
      payload: selectedCountry,
    });

    return true;
  };
};

/**
 * Gets available states.
 *
 */
export const getStates = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_STATES.PENDING,
    });

    const { data, error } = await fetchStates('USA');

    if (error) {
      return dispatch({
        type: FETCH_STATES.ERROR,
        payload: error.message,
      });
    }

    const { result } = stateMapper.select(data);

    dispatch({
      type: FETCH_STATES.SUCCESS,
      payload: result.sort(dynamicSort('name')),
    });
  };
};
