import { LS_KEY } from 'auth';
import SecureLS from 'secure-ls';
import { serialize, parse, MESSAGE, withData, withError } from 'utils';

const ls = new SecureLS({
  encodingType: 'des',
  isCompression: true,
  encryptionSecret: process.env.REACT_APP_ENCRYPTION_SECRET,
});
const hasLocalStorage = window.localStorage;

export const storage = {
  get(key) {
    const { error, data } = parse(localStorage.getItem(key));

    if (error) {
      return withError(error);
    }

    if (!hasLocalStorage) {
      return withError(MESSAGE.NO_LOCAL_STORAGE);
    }

    return withData(data);
  },

  set(key, value) {
    if (!hasLocalStorage) {
      return withError(MESSAGE.NO_LOCAL_STORAGE);
    }

    return withData(localStorage.setItem(key, serialize(value)));
  },

  clear(key = null) {
    if (!hasLocalStorage) {
      return withError(MESSAGE.NO_LOCAL_STORAGE);
    }

    localStorage.getItem(key)
      ? localStorage.removeItem(key)
      : localStorage.clear();

    return withData(localStorage.getItem(key));
  },
};

export const securedLS = {
  set(key, value) {
    if (!hasLocalStorage) {
      return withError(MESSAGE.NO_LOCAL_STORAGE);
    }

    return withData(ls.set(key, value));
  },

  get(key) {
    try {
      return withData(ls.get(key));
    } catch {
      return withError(ls.clear());
    }
  },

  clear(key = null) {
    if (!hasLocalStorage) {
      return withError(MESSAGE.NO_LOCAL_STORAGE);
    }

    if (key) {
      return withData(localStorage.removeItem(key));
    }

    return withData(ls.removeAll());
  },
};

export const clearAuthData = () => {
  securedLS.clear(LS_KEY.TOKEN);
  securedLS.clear(LS_KEY.CURRENT_USER);
};
