import {
  CANCEL_TRANSACTION,
  FETCH_TRANSACTION_LIST,
  FETCH_FILTERED_TRANSACTION_LIST,
} from './dashboard.type';
import { TRANSACTION_PAGING } from './dashboard.constant';
import { updateObject, createReducer } from 'utils';

const initialState = {
  error: '',
  transactions: [],
  transactionPaging: {
    page: TRANSACTION_PAGING.PAGE,
    pageSize: TRANSACTION_PAGING.PAGE_SIZE,
    totalCount: TRANSACTION_PAGING.TOTAL_COUNT,
  },
  transactionGlanceInfo: {},

  isFetchingTransaction: false,
  isCancelingTransaction: false,
  isFetchingTxnGlanceData: false,
  isFetchingFilteredTransaction: false,
};

export const dashboardReducer = createReducer(initialState);

dashboardReducer.case(FETCH_TRANSACTION_LIST.PENDING).register((state) =>
  updateObject(state, {
    isFetchingTransaction: true,
  })
);

dashboardReducer
  .case(FETCH_TRANSACTION_LIST.SUCCESS)
  .register((state, action) =>
    updateObject(state, {
      isFetchingTransaction: false,
      transactions: state.transactions.concat(action.payload.result),
      transactionPaging: action.payload.paging,
    })
  );

dashboardReducer.case(FETCH_TRANSACTION_LIST.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isFetchingTransaction: false,
  })
);

dashboardReducer
  .case(FETCH_FILTERED_TRANSACTION_LIST.PENDING)
  .register((state) =>
    updateObject(state, {
      isFetchingFilteredTransaction: true,
    })
  );

dashboardReducer
  .case(FETCH_FILTERED_TRANSACTION_LIST.SUCCESS)
  .register((state, action) =>
    updateObject(state, {
      isFetchingFilteredTransaction: false,
      transactions: action.payload.result,
      transactionPaging: action.payload.paging,
    })
  );

dashboardReducer
  .case(FETCH_FILTERED_TRANSACTION_LIST.ERROR)
  .register((state, action) =>
    updateObject(state, {
      error: action.payload,
      isFetchingFilteredTransaction: false,
    })
  );

dashboardReducer.case(CANCEL_TRANSACTION.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isCancelingTransaction: true,
  })
);

dashboardReducer.case(CANCEL_TRANSACTION.SUCCESS).register((state) =>
  updateObject(state, {
    error: '',
    isCancelingTransaction: false,
  })
);

dashboardReducer.case(CANCEL_TRANSACTION.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isCancelingTransaction: false,
  })
);
