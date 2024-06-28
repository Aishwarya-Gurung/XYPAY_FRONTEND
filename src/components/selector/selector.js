import React, { Component } from 'react';

/**
 * Check weather the value is of type object.
 *
 * @param {Object} val
 */
const isObject = (val) =>
  Object.prototype.toString.call(val) === '[object Object]';

/**
 * JS Selector
 *
 */
const selector = {
  /**
   * Object validator.
   *
   * @param {Object} querySelector
   */
  object: function (querySelector) {
    return {
      /**
       *
       * @param {Object} payload
       */
      select: function (payload) {
        if (!isObject(payload)) {
          payload = {};
        }

        return Object.keys(querySelector).reduce((acc, key) => {
          return {
            ...acc,
            [key]: querySelector[key].select(payload[key]),
          };
        }, {});
      },
    };
  },

  /**
   * String validator.
   *
   * @param {String} defaultValue
   */
  string: function (defaultValue) {
    return {
      /**
       *
       * @param {String} payload
       */
      select: function (payload) {
        if (typeof payload !== 'string') {
          payload = defaultValue;
        }

        return typeof payload === 'undefined' ? '' : payload;
      },
    };
  },

  /**
   * Number validator.
   *
   * @param {Number} defaultValue
   */
  number: function (defaultValue) {
    return {
      /**
       *
       * @param {Number} payload
       */
      select: function (payload) {
        if (typeof payload !== 'number') {
          payload = defaultValue;
        }

        return payload;
      },
    };
  },

  /**
   * Boolean validator.
   *
   * @param {Boolean} defaultValue
   */
  boolean: function (defaultValue) {
    return {
      /**
       *
       * @param {Boolean} payload
       */
      select: function (payload) {
        if (typeof payload !== 'boolean') {
          payload = defaultValue;
        }

        return payload;
      },
    };
  },

  /**
   * Symbol validator.
   *
   * @param {Symbol} defaultValue
   */
  symbol: function (defaultValue) {
    return {
      /**
       *
       * @param {Symbol} payload
       */
      select: function (payload) {
        if (typeof payload !== 'symbol') {
          payload = defaultValue;
        }

        return payload;
      },
    };
  },

  /**
   * List validator.
   *
   * @param {Array} querySelector
   */
  list: function (querySelector) {
    return {
      /**
       *
       * @param {Array} payload
       */
      select: function (payload) {
        if (!Array.isArray(payload)) {
          payload = [];
        }

        return payload.map((val) => querySelector.select(val));
      },
    };
  },

  /**
   * Any validator.
   *
   * @param {Any} defaultValue
   */
  any: function (defaultValue) {
    return {
      /**
       *
       * @param {Any} payload
       */
      select: function (payload) {
        if (payload === undefined) {
          return defaultValue;
        }

        return payload;
      },
    };
  },

  /**
   * Function validator.
   *
   * @param {Function} defaultValue
   */
  func: function (defaultValue) {
    return {
      /**
       *
       * @param {Function} payload
       */
      select: function (payload) {
        if (typeof payload !== 'function') {
          payload = defaultValue;
        }

        return payload;
      },
    };
  },
};

/**
 * HOC to validate props of component.
 *
 * @param {*} wrappedComponent
 */
export function withSelector(wrappedComponent) {
  /**
   * HOC wrapper class.
   */
  class Wrapper extends Component {
    /**
     * Renders component.
     */
    render() {
      const WrappedComponent = wrappedComponent;
      const { selectorProps = {} } = wrappedComponent || {};

      return selectorProps.select && selectorProps.select.call ? (
        <WrappedComponent
          {...selectorProps.select(this.props)}
          unsafeProps={this.props}
        />
      ) : (
        <WrappedComponent {...this.props} />
      );
    }
  }

  return Wrapper;
}

export default selector;
