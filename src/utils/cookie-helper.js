import { COOKIE_KEY } from 'app';
import { MESSAGE, withData, withError } from 'utils';

export const cookie = {
  /**
   * Sets cookie.
   *
   * @param {String} key
   * @param {String} value
   * @param {Number} expires
   */
  set(key, value, expires) {
    const currentDate = new Date();

    currentDate.setTime(currentDate.getTime() + expires * 24 * 60 * 60 * 1000);

    return withData(
      (document.cookie = `${key}=${value};expires=${currentDate.toUTCString()};path=/`)
    );
  },

  /**
   * Gets cookie.
   *
   * @param {String} key
   */
  get(key) {
    if (!document.cookie) {
      return withError(MESSAGE.NO_COOKIE);
    }

    const name = key + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];

      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return withData(c.substring(name.length, c.length));
      }
    }

    return withData(null);
  },
  delete(keys) {
    if (Array.isArray(keys)) {
      return keys.forEach((key) => {
        cookie.delete(key);
      });
    }

    return (document.cookie = `${keys}='';expires=${new Date().toUTCString()};path=/`);
  },
};

const getSearchKeyValue = (searchParameter) => {
  const [key, value] = searchParameter.substring(1).split('=');

  return { key, value };
};

export const storeSearchParameterInCookie = (searchParameter) => {
  const keyValueObject = {
    [getSearchKeyValue(searchParameter).key]:
      getSearchKeyValue(searchParameter).value,
  };

  cookie.set(COOKIE_KEY.SEARCH_PARAMETER, JSON.stringify(keyValueObject), 1);
};

export const getSearchParameterCookie = () => {
  return JSON.parse(cookie.get(COOKIE_KEY.SEARCH_PARAMETER).data);
};

export const deleteSearchParameterCookie = () => {
  return cookie.delete(COOKIE_KEY.SEARCH_PARAMETER);
};
