import { updateObject, createReducer } from 'utils';
import {
  FETCH_STATES,
  PERSIST_SELECTED_COUNTRY,
  FETCH_SOURCE_COUNTRY_LIST,
  FETCH_DESTINATION_COUNTRY_LIST,
} from './landing-page.type';

const initialState = {
  // Data
  error: null,
  states: [],
  sourceCountries: [],
  destinationCountries: [],
  selectedCountry: null,

  // UI
  isFetchingStates: false,
  isFetchingCountry: false,
  isSendButtonDisabled: true,

  features: {
    isRecaptchaEnabled: false,
    isThreeDSEnabled: false,
  },
};

export const landingPageReducer = createReducer(initialState);

landingPageReducer.case(FETCH_SOURCE_COUNTRY_LIST.PENDING).register((state) =>
  updateObject(state, {
    isFetchingCountry: true,
  })
);

landingPageReducer
  .case(FETCH_SOURCE_COUNTRY_LIST.SUCCESS)
  .register((state, action) =>
    updateObject(state, {
      isFetchingCountry: false,
      sourceCountries: action.payload,
    })
  );

landingPageReducer
  .case(FETCH_SOURCE_COUNTRY_LIST.ERROR)
  .register((state, action) =>
    updateObject(state, {
      error: action.payload,
    })
  );

landingPageReducer
  .case(FETCH_DESTINATION_COUNTRY_LIST.PENDING)
  .register((state) =>
    updateObject(state, {
      isFetchingCountry: true,
    })
  );

landingPageReducer
  .case(FETCH_DESTINATION_COUNTRY_LIST.SUCCESS)
  .register((state, action) =>
    updateObject(state, {
      isFetchingCountry: false,
      destinationCountries: action.payload,
    })
  );

landingPageReducer
  .case(FETCH_DESTINATION_COUNTRY_LIST.ERROR)
  .register((state, action) =>
    updateObject(state, {
      error: action.payload,
    })
  );

landingPageReducer.case(PERSIST_SELECTED_COUNTRY).register((state, action) =>
  updateObject(state, {
    selectedCountry: action.payload,
    isSendButtonDisabled: false,
  })
);

landingPageReducer.case(FETCH_STATES.PENDING).register((state) =>
  updateObject(state, {
    isFetchingStates: true,
  })
);

landingPageReducer.case(FETCH_STATES.SUCCESS).register((state, action) =>
  updateObject(state, {
    states: action.payload,
    isFetchingStates: false,
  })
);

landingPageReducer.case(FETCH_STATES.ERROR).register((state, action) =>
  updateObject(state, {
    error: action.payload,
    isFetchingStates: false,
  })
);
