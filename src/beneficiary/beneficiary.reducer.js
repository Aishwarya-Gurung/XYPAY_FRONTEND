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
import { createReducer, updateObject } from 'utils';
import * as handler from './beneficiary.action-handler';

const initialState = {
  // data
  error: '',
  states: [],
  payers: [],
  beneficiaries: [],
  beneficiaryBanks: [],
  beneficiaryPayoutMethod: {},

  // UI
  isFetchingStates: false,

  isBeneficiaryAdded: false,
  isAddingBeneficiary: false,
  isAddingPayoutMethod: false,

  isBeneficiaryListFetched: false,
  isFetchingBeneficiaryList: false,

  isBeneficiaryBankFetched: false,
  isFetchingBeneficiaryBank: false,

  isUpdatingBeneficiary: false,

  isFetchingPayers: false,
};

export const beneficiaryReducer = createReducer(initialState);

beneficiaryReducer
  .case(FETCH_BENEFICIARY_LIST.PENDING)
  .register((state) => handler.fetchBeneficiaryListStart(state));

beneficiaryReducer
  .case(FETCH_BENEFICIARY_LIST.SUCCESS)
  .register((state, action) =>
    handler.fetchBeneficiaryListSuccess(state, action)
  );

beneficiaryReducer
  .case(FETCH_BENEFICIARY_LIST.ERROR)
  .register((state, action) => handler.fetchBeneficiaryListFail(state, action));

beneficiaryReducer
  .case(ADD_BENEFICIARY.PENDING)
  .register((state) => handler.addBeneficiaryStart(state));

beneficiaryReducer
  .case(ADD_BENEFICIARY.SUCCESS)
  .register((state, action) => handler.addBeneficiarySuccess(state, action));

beneficiaryReducer
  .case(ADD_BENEFICIARY.ERROR)
  .register((state, action) => handler.addBeneficiaryFail(state, action));

beneficiaryReducer
  .case(FETCH_BENEFICIARY_BANK.PENDING)
  .register((state) => handler.fetchBeneficiaryBankStart(state));

beneficiaryReducer
  .case(FETCH_BENEFICIARY_BANK.SUCCESS)
  .register((state, action) =>
    handler.fetchBeneficiaryBankSuccess(state, action)
  );

beneficiaryReducer
  .case(FETCH_BENEFICIARY_BANK.ERROR)
  .register((state, action) => handler.fetchBeneficiaryBankFail(state, action));

beneficiaryReducer
  .case(FETCH_BENEFICIARY_STATE.PENDING)
  .register((state) => handler.fetchBeneficiaryStateStart(state));

beneficiaryReducer
  .case(FETCH_BENEFICIARY_STATE.SUCCESS)
  .register((state, action) =>
    handler.fetchBeneficiaryStateSuccess(state, action)
  );

beneficiaryReducer
  .case(FETCH_BENEFICIARY_STATE.ERROR)
  .register((state, action) =>
    handler.fetchBeneficiaryStateFail(state, action)
  );

beneficiaryReducer
  .case(ADD_PAYOUT_METHOD.PENDING)
  .register((state) => handler.addBeneficiaryBankOrWalletStart(state));

beneficiaryReducer
  .case(ADD_PAYOUT_METHOD.SUCCESS)
  .register((state, action) =>
    handler.addBeneficiaryBankOrWalletSuccess(state, action)
  );

beneficiaryReducer
  .case(ADD_PAYOUT_METHOD.ERROR)
  .register((state, action) =>
    handler.addBeneficiaryBankOrWalletError(state, action)
  );

beneficiaryReducer
  .case(UPDATE_BENEFICIARY.PENDING)
  .register((state) => handler.updateBeneficiaryPending(state));

beneficiaryReducer
  .case(UPDATE_BENEFICIARY.SUCCESS)
  .register((state) => handler.updateBeneficiarySuccess(state));

beneficiaryReducer
  .case(UPDATE_BENEFICIARY.ERROR)
  .register((state, action) => handler.updateBeneficiaryError(state, action));

beneficiaryReducer.case(FETCH_PAYER_LIST.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isFetchingPayers: true,
  })
);

beneficiaryReducer.case(FETCH_PAYER_LIST.SUCCESS).register((state, action) =>
  updateObject(state, {
    payers: action.payload,
    isFetchingPayers: false,
  })
);

beneficiaryReducer.case(FETCH_PAYER_LIST.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isFetchingPayers: false,
  })
);

beneficiaryReducer.case(RESET_ERROR).register((state) =>
  updateObject(state, {
    error: '',
  })
);
