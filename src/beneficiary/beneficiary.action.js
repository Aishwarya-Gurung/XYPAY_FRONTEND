import {
  RESET_ERROR,
  ADD_BENEFICIARY,
  FETCH_PAYER_LIST,
  ADD_PAYOUT_METHOD,
  UPDATE_BENEFICIARY,
  FETCH_BENEFICIARY_BANK,
  FETCH_BENEFICIARY_LIST,
  FETCH_BENEFICIARY_STATE,
} from './beneficiary.type';

import {
  fetchStates,
  fetchPayerList,
  createBeneficiary,
  updateBeneficiary,
  fetchBeneficiaryList,
  fetchBeneficiaryBanks,
  createBeneficiaryBank,
  createBeneficiaryWallet,
  fetchBeneficiaryBanksByCountry,
} from 'api';

import { API_ERROR } from 'app';
import {
  payerMapper,
  stateMapper,
  bankListMapper,
  beneficiaryMapper,
  beneficiaryListMapper,
} from './beneficiary.mapper';
import { dynamicSort, getApiExceptionMsg } from 'utils';

export const addBeneficiary = (beneficiary) => {
  return async (dispatch) => {
    dispatch({
      type: ADD_BENEFICIARY.PENDING,
    });

    const { data, error } = await createBeneficiary(beneficiary);

    if (error) {
      dispatch({
        type: ADD_BENEFICIARY.ERROR,
        payload: getApiExceptionMsg(error.message),
      });

      return false;
    }

    const { fullName, referenceId, address } = beneficiaryMapper.select(data);

    dispatch({
      type: ADD_BENEFICIARY.SUCCESS,
      payload: {
        fullName,
        referenceId,
        address,
      },
    });

    return referenceId;
  };
};

export const updateBeneficiaryDetail = (beneficiaryId, beneficiary) => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_BENEFICIARY.PENDING,
    });

    const { error } = await updateBeneficiary(beneficiaryId, beneficiary);

    if (error) {
      dispatch({
        type: UPDATE_BENEFICIARY.ERROR,
        payload: getApiExceptionMsg(error.message),
      });

      return false;
    }

    dispatch({
      type: UPDATE_BENEFICIARY.SUCCESS,
    });

    return true;
  };
};

export const addBeneficiaryBank = (bank) => {
  return async (dispatch) => {
    dispatch({
      type: ADD_PAYOUT_METHOD.PENDING,
    });

    const { data, error } = await createBeneficiaryBank(bank);

    if (error) {
      dispatch({
        type: ADD_PAYOUT_METHOD.ERROR,
        payload: getApiExceptionMsg(error.message),
      });

      // Failure status for benecificiary bank not saved
      return false;
    }

    dispatch({
      type: ADD_PAYOUT_METHOD.SUCCESS,
      payload: data,
    });

    // If Success returns referenceId of benecificiary bank saved
    return data.referenceId;
  };
};

export const addBeneficiaryWallet = (walletDetails) => {
  return async (dispatch) => {
    dispatch({
      type: ADD_PAYOUT_METHOD.PENDING,
    });

    const { data, error } = await createBeneficiaryWallet(walletDetails);

    if (error) {
      dispatch({
        type: ADD_PAYOUT_METHOD.ERROR,
        payload: getApiExceptionMsg(error.message),
      });

      // Failure status for benecificiary wallet not saved
      return false;
    }

    dispatch({
      type: ADD_PAYOUT_METHOD.SUCCESS,
      payload: data,
    });

    // If Success returns referenceId of benecificiary wallet saved
    return data.referenceId;
  };
};

export const getBeneficiaryList = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_BENEFICIARY_LIST.PENDING,
    });

    const { data, error } = await fetchBeneficiaryList();

    if (error) {
      return dispatch({
        type: FETCH_BENEFICIARY_LIST.ERROR,
        payload: API_ERROR.SOMETHING_WENT_WRONG,
      });
    }

    const { result } = beneficiaryListMapper.select(data);

    dispatch({
      type: FETCH_BENEFICIARY_LIST.SUCCESS,
      payload: result,
    });
  };
};

export const getBeneficiaryBanksByCountry = (country) => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_BENEFICIARY_BANK.PENDING,
    });

    const { error, data } = await fetchBeneficiaryBanksByCountry(country);

    if (error) {
      return dispatch({
        type: FETCH_BENEFICIARY_BANK.ERROR,
        payload: error.message,
      });
    }

    const { result } = bankListMapper.select(data);

    dispatch({
      type: FETCH_BENEFICIARY_BANK.SUCCESS,
      payload: result,
    });
  };
};

export const getBeneficiaryBanks = (country, currency) => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_BENEFICIARY_BANK.PENDING,
    });

    const { error, data } = await fetchBeneficiaryBanks(country, currency);

    if (error) {
      return dispatch({
        type: FETCH_BENEFICIARY_BANK.ERROR,
        payload: error.message,
      });
    }

    const { result } = bankListMapper.select(data);

    dispatch({
      type: FETCH_BENEFICIARY_BANK.SUCCESS,
      payload: result,
    });
  };
};

export const fetchBeneficiaryStates = (country) => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_BENEFICIARY_STATE.PENDING,
    });

    const { data, error } = await fetchStates(country);

    if (error) {
      return dispatch({
        type: FETCH_BENEFICIARY_STATE.ERROR,
        payload: error.message,
      });
    }

    const { result } = stateMapper.select(data);

    dispatch({
      type: FETCH_BENEFICIARY_STATE.SUCCESS,
      payload: result.sort(dynamicSort('name')),
    });
  };
};

export const getPayerList = (country) => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_PAYER_LIST.PENDING,
    });

    const { data, error } = await fetchPayerList(country);

    if (error) {
      return dispatch({
        type: FETCH_PAYER_LIST.ERROR,
        payload: getApiExceptionMsg(error.message),
      });
    }

    const { result } = payerMapper.select(data);

    dispatch({
      type: FETCH_PAYER_LIST.SUCCESS,
      payload: result,
    });
  };
};

// const reValidatePayers = (payers) => {
//   const payerBanks = [];

//   payers
//     .filter((payer) => payer.code !== 'UNISTR')
//     .forEach((payer) => {
//       payerBanks.push(
//         ...cashpickUpBank[payer.code].map((payerBank) => {
//           payerBank.referenceId = payer.referenceId;
//           payerBank.receivingCurrency = payer.receivingCurrency;

//           return payerBank;
//         })
//       );
//     });

//   return payerBanks;
// };

export const resetError = () => {
  return {
    type: RESET_ERROR,
  };
};
