import {
  FETCH_FEE_RANGE,
  FETCH_SENDER_BANKS,
  FETCH_EXCHANGE_RATE,
  SAVE_PAYMENT_DETAIL,
  RESET_PAYMENT_DETAILS,
  FETCH_SENDER_DEBIT_CARD,
  REMOVE_SENDER_FUNDING_SOURCE,
} from './payment.type';
import { updateObject, createReducer } from 'utils';

const initialState = {
  // data
  error: '',
  feeSets: [],
  paymentDetail: {},
  exchangeRates: null,

  senderBanks: [],
  senderDebitCards: [],

  // UI
  isFetchingFeeRange: false,
  isSavingPaymentInfo: false,
  isSavingPaymentDetail: false,

  isFetchingExchnageRate: false,

  isSenderBanksFetched: false,
  isFetchingSenderBanks: false,
  isFetchingSenderDebitCard: false,
  isSenderDebitCardsFetched: false,
  isDeletingSenderFundingSource: false,
};

export const paymentReducer = createReducer(initialState);

paymentReducer.case(SAVE_PAYMENT_DETAIL.PENDING).register((state) =>
  updateObject(state, {
    isSavingPaymentDetail: true,
  })
);

paymentReducer.case(SAVE_PAYMENT_DETAIL.SUCCESS).register((state, action) =>
  updateObject(state, {
    isSavingPaymentDetail: false,
    paymentDetail: { ...state.paymentDetail, ...action.payload },
  })
);

paymentReducer.case(SAVE_PAYMENT_DETAIL.ERROR).register((state, action) =>
  updateObject(state, {
    isSavingPaymentDetail: false,
    error: action.payload,
  })
);

paymentReducer.case(FETCH_FEE_RANGE.PENDING).register((state) =>
  updateObject(state, {
    isFetchingFeeRange: true,
  })
);

paymentReducer.case(FETCH_FEE_RANGE.SUCCESS).register((state, action) =>
  updateObject(state, {
    isFetchingFeeRange: false,
    feeSets: action.payload,
  })
);

paymentReducer.case(FETCH_FEE_RANGE.ERROR).register((state, action) =>
  updateObject(state, {
    isFetchingFeeRange: false,
    error: action.payload,
  })
);

paymentReducer.case(FETCH_EXCHANGE_RATE.PENDING).register((state) =>
  updateObject(state, {
    isFetchingExchnageRate: true,
  })
);

paymentReducer.case(FETCH_EXCHANGE_RATE.SUCCESS).register((state, action) =>
  updateObject(state, {
    isFetchingExchnageRate: false,
    exchangeRates: action.payload,
  })
);

paymentReducer.case(FETCH_EXCHANGE_RATE.ERROR).register((state, action) =>
  updateObject(state, {
    isFetchingExchnageRate: false,
    exchangeRate: action.payload,
  })
);

paymentReducer.case(FETCH_SENDER_BANKS.PENDING).register((state) =>
  updateObject(state, {
    isSenderBanksFetched: false,
    isFetchingSenderBanks: true,
  })
);

paymentReducer.case(FETCH_SENDER_BANKS.SUCCESS).register((state, action) =>
  updateObject(state, {
    isSenderBanksFetched: true,
    isFetchingSenderBanks: false,
    senderBanks: action.payload,
  })
);

paymentReducer.case(FETCH_SENDER_BANKS.ERROR).register((state, action) =>
  updateObject(state, {
    isFetchingSenderBanks: false,
    error: action.payload,
  })
);

paymentReducer.case(FETCH_SENDER_DEBIT_CARD.PENDING).register((state) =>
  updateObject(state, {
    isFetchingSenderDebitCard: true,
  })
);

paymentReducer.case(FETCH_SENDER_DEBIT_CARD.SUCCESS).register((state, action) =>
  updateObject(state, {
    isSenderDebitCardsFetched: true,
    isFetchingSenderDebitCard: false,
    senderDebitCards: action.payload,
  })
);

paymentReducer.case(FETCH_SENDER_DEBIT_CARD.ERROR).register((state, action) =>
  updateObject(state, {
    isFetchingSenderDebitCard: false,
    error: action.payload,
  })
);

paymentReducer.case(RESET_PAYMENT_DETAILS).register((state) =>
  updateObject(state, {
    paymentDetail: {},
  })
);

paymentReducer.case(REMOVE_SENDER_FUNDING_SOURCE.PENDING).register((state) =>
  updateObject(state, {
    isDeletingSenderFundingSource: true,
  })
);

paymentReducer.case(REMOVE_SENDER_FUNDING_SOURCE.SUCCESS).register((state) =>
  updateObject(state, {
    isDeletingSenderFundingSource: false,
  })
);

paymentReducer
  .case(REMOVE_SENDER_FUNDING_SOURCE.ERROR)
  .register((state, action) =>
    updateObject(state, {
      error: action.payload,
      isDeletingSenderFundingSource: false,
    })
  );
