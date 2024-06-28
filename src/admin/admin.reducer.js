import { UNLOCK_SENDER, FETCH_LOCKED_SENDER } from './admin.type';
import { updateObject, createReducer } from '../utils/store-helper';

const initialState = {
  lockedSenders: [],
  isFetchingSenders: false,
  isUnlockingSender: false,
};

export const adminReducer = createReducer(initialState);

adminReducer.case(FETCH_LOCKED_SENDER.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isFetchingSenders: true,
  })
);

adminReducer.case(FETCH_LOCKED_SENDER.SUCCESS).register((state, action) =>
  updateObject(state, {
    error: '',
    isFetchingSenders: false,
    lockedSenders:
      action.payload.reload && action.payload.senders
        ? action.payload.senders
        : state.lockedSenders.concat(action.payload.senders),
    lockedSenderPagination: action.payload.paging,
  })
);

adminReducer.case(FETCH_LOCKED_SENDER.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isFetchingSenders: false,
  })
);

adminReducer.case(UNLOCK_SENDER.PENDING).register((state) =>
  updateObject(state, {
    error: '',
    isUnlockingSender: true,
  })
);

adminReducer.case(UNLOCK_SENDER.SUCCESS).register((state) =>
  updateObject(state, {
    error: '',
    isUnlockingSender: false,
  })
);

adminReducer.case(UNLOCK_SENDER.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isUnlockingSender: false,
  })
);
