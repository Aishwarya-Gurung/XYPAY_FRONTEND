import { parse, isEmpty } from 'utils';

/**
 * Creates redcuers.
 *
 * @param {Object} defaultState
 */
export function createReducer(defaultState = {}) {
  const actionHandlerMap = new Map();

  /**
   * Reducer function.
   *
   * @param {Object} state
   * @param {Object} action
   */
  function reducer(state = defaultState, action) {
    const actionHandler = actionHandlerMap.get(action.type);

    if (!actionHandler) {
      return state;
    }

    return actionHandler(state, action);
  }

  Object.defineProperty(reducer, 'case', {
    enumerable: false,
    configurable: false,
    writable: false,

    /**
     * Action type.
     *
     * @param {Object} action
     */
    value: function (action) {
      return {
        /**
         * Register the action handler.
         *
         * @param {Function} handler
         */
        register: function (handler) {
          actionHandlerMap.set(action, handler);

          return function () {
            // Return a function that unregisters the handler
            actionHandlerMap.delete(action);
          };
        },
      };
    },
  });

  return reducer;
}

/**
 * Update states in reducers.
 *
 * @param {Object} oldObject
 * @param {Object} updatedProperties
 */
export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

/**
 * Creates sets of actions type.
 *
 * @param {String} actionName
 */
export const createActionSet = (actionName) => ({
  PENDING: `${actionName}_PENDING`,
  SUCCESS: `${actionName}_SUCCESS`,
  ERROR: `${actionName}_ERROR`,
  actionName,
});

/**
 * Returns the given array's last key's value from data state.
 *
 * @param {Array} keys
 * @param {Object} state
 */
export const getReduxState = (keys, state) => {
  return keys.reduce(
    (stateAcc, curretState) => !isEmpty(curretState) && stateAcc[curretState],
    state
  );
};

/**
 * Exceptions are listed.
 *
 * @param {String} message
 */
export const getApiExceptionMsg = (message) => {
  const { data, error } = parse(message);

  if (error) {
    return message;
  }

  return data.message;
};
