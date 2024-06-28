import {
  SIGNUP,
  PHONE_VERIFICATION,
  TOGGLE_WIDGET_MODAL,
  RESEND_PVERIFICATION_CODE,
  TOGGLE_PVERIFICATION_FORM,
  RESEND_EVERIFICATION_LINK,
} from './sender.type';

import { updateObject, createReducer } from 'utils';

const initialState = {
  // data
  error: {
    signUp: null,
    pVerificationCode: null,
    eVerificationLink: null,
  },
  sender: {},
  widgetToken: '',
  referenceId: null,

  // UI
  isSigningUp: false,

  isVCodeResent: true,
  isVCodeResending: false,
  isVerifyingPhone: false,
  isPVerifyFormOpen: false,

  isVLinkResent: true,
  isVLinkResending: false,

  isFetchingWidgetToken: false,

  isWidgetModalOpen: false,
};

export const senderReducer = createReducer(initialState);

senderReducer.case(SIGNUP.PENDING).register((state) =>
  updateObject(state, {
    isSigningUp: true,
    error: {
      ...state.error,
      signUp: null,
    },
  })
);

senderReducer.case(SIGNUP.SUCCESS).register((state, action) =>
  updateObject(state, {
    isSigningUp: false,
    sender: action.payload.sender,
    error: {
      ...state.error,
      signUp: null,
    },
  })
);

senderReducer.case(SIGNUP.ERROR).register((state, action) =>
  updateObject(state, {
    isSigningUp: false,
    error: {
      ...state.error,
      signUp: action.payload,
    },
  })
);

senderReducer.case(TOGGLE_PVERIFICATION_FORM).register((state) =>
  updateObject(state, {
    isPVerifyFormOpen: !state.isPVerifyFormOpen,
  })
);

senderReducer.case(PHONE_VERIFICATION.PENDING).register((state) =>
  updateObject(state, {
    isVerifyingPhone: true,
    error: {
      ...state.error,
      pVerificationCode: null,
    },
  })
);

senderReducer.case(PHONE_VERIFICATION.SUCCESS).register((state) =>
  updateObject(state, {
    isVerifyingPhone: false,
  })
);

senderReducer.case(PHONE_VERIFICATION.ERROR).register((state, action) =>
  updateObject(state, {
    isVerifyingPhone: false,
    error: {
      ...state.error,
      pVerificationCode: action.payload,
    },
  })
);

senderReducer.case(RESEND_PVERIFICATION_CODE.PENDING).register((state) =>
  updateObject(state, {
    error: {
      ...state.error,
      pVerificationCode: null,
    },
    isVCodeResending: true,
  })
);

senderReducer.case(RESEND_PVERIFICATION_CODE.SUCCESS).register((state) =>
  updateObject(state, {
    isVCodeResent: true,
    isVCodeResending: false,
  })
);

senderReducer.case(RESEND_PVERIFICATION_CODE.ERROR).register((state, action) =>
  updateObject(state, {
    isVCodeResent: false,
    isVCodeResending: false,
    error: {
      ...state.error,
      pVerificationCode: action.payload,
    },
  })
);

senderReducer.case(RESEND_EVERIFICATION_LINK.PENDING).register((state) =>
  updateObject(state, {
    error: {
      ...state.error,
      eVerificationLink: null,
    },
    isVLinkResending: true,
  })
);

senderReducer
  .case(RESEND_EVERIFICATION_LINK.SUCCESS)
  .register((state, action) =>
    updateObject(state, {
      isVLinkResending: false,
      isVLinkResent: action.payload.status,
    })
  );

senderReducer.case(RESEND_EVERIFICATION_LINK.ERROR).register((state, action) =>
  updateObject(state, {
    isVLinkResent: false,
    isVLinkResending: false,
    error: {
      ...state.error,
      eVerificationLink: action.payload,
    },
  })
);

senderReducer.case(TOGGLE_WIDGET_MODAL).register((state, action) => {
  if (typeof action.payload !== 'boolean') {
    return updateObject(state, {
      isWidgetModalOpen: !state.isWidgetModalOpen,
    });
  }

  return updateObject(state, {
    isWidgetModalOpen: action.payload,
  });
});
