import { updateObject } from 'utils';

export const fetchBeneficiaryListStart = (state) => {
  return updateObject(state, {
    isBeneficiaryListFetched: false,
    isFetchingBeneficiaryList: true,
  });
};

export const fetchBeneficiaryListSuccess = (state, action) => {
  return updateObject(state, {
    beneficiaries: action.payload,
    isBeneficiaryListFetched: true,
    isFetchingBeneficiaryList: false,
  });
};

export const fetchBeneficiaryListFail = (state, action) => {
  return updateObject(state, {
    error: action.payload,
    isFetchingBeneficiaryList: false,
  });
};

export const addBeneficiaryStart = (state) => {
  return updateObject(state, {
    error: '',
    isAddingBeneficiary: true,
  });
};

export const addBeneficiarySuccess = (state, action) => {
  return updateObject(state, {
    error: '',
    isBeneficiaryAdded: true,
    isAddingBeneficiary: false,
    beneficiaries: [...state.beneficiaries, action.payload],
  });
};

export const addBeneficiaryFail = (state, action) => {
  return updateObject(state, {
    error: action.payload,
    isBeneficiaryAdded: false,
    isAddingBeneficiary: false,
  });
};

export const fetchBeneficiaryBankStart = (state) => {
  return updateObject(state, {
    isFetchingBeneficiaryBank: true,
  });
};

export const fetchBeneficiaryBankSuccess = (state, action) => {
  return updateObject(state, {
    isBeneficiaryBankFetched: true,
    isFetchingBeneficiaryBank: false,
    beneficiaryBanks: action.payload,
  });
};

export const fetchBeneficiaryBankFail = (state, action) => {
  return updateObject(state, {
    error: action.payload,
    isBeneficiaryBankFetched: false,
    isFetchingBeneficiaryBank: false,
  });
};

export const fetchBeneficiaryStateStart = (state) => {
  return updateObject(state, {
    isFetchingStates: true,
  });
};

export const fetchBeneficiaryStateSuccess = (state, action) => {
  return updateObject(state, {
    states: action.payload,
    isFetchingStates: false,
  });
};

export const fetchBeneficiaryStateFail = (state, action) => {
  return updateObject(state, {
    error: action.payload,
    isFetchingStates: false,
  });
};

export const addBeneficiaryBankOrWalletStart = (state) => {
  return updateObject(state, {
    isAddingPayoutMethod: true,
  });
};

export const addBeneficiaryBankOrWalletSuccess = (state, action) => {
  return updateObject(state, {
    isAddingPayoutMethod: false,
    beneficiaryPayoutMethod: action.payload,
  });
};

export const addBeneficiaryBankOrWalletError = (state, action) => {
  return updateObject(state, {
    error: action.payload,
    isAddingPayoutMethod: false,
  });
};

export const updateBeneficiaryPending = (state) => {
  return updateObject(state, {
    error: '',
    isUpdatingBeneficiary: true,
  });
};

export const updateBeneficiaryError = (state, action) => {
  return updateObject(state, {
    error: action.payload,
    isUpdatingBeneficiary: false,
  });
};

export const updateBeneficiarySuccess = (state) => {
  return updateObject(state, {
    isUpdatingBeneficiary: false,
  });
};
