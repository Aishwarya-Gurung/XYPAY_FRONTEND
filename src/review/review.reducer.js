import { createReducer, updateObject } from 'utils';
import { NOTIFY_BENEFICIARY } from 'review';

const initialState = {
  error: null,
  transaction: null,
  isSendingEmail: false,
  isBeneficiaryNotified: false,
  isCreatingTransaction: false,
};

export const reviewReducer = createReducer(initialState);

reviewReducer.case(NOTIFY_BENEFICIARY.PENDING).register((state) =>
  updateObject(state, {
    isSendingEmail: true,
  })
);

reviewReducer.case(NOTIFY_BENEFICIARY.SUCCESS).register((state) =>
  updateObject(state, {
    isSendingEmail: false,
    isBeneficiaryNotified: true,
  })
);

reviewReducer.case(NOTIFY_BENEFICIARY.ERROR).register((state, action) =>
  updateObject(state, {
    isSendingEmail: false,
    error: action.payload,
    isBeneficiaryNotified: false,
  })
);
