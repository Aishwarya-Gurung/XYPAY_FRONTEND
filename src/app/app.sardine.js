import { v1 as uuidv1 } from 'uuid';

import { cookie } from 'utils';

import { history, COOKIE_KEY } from 'app';
import isUATEnvironment from 'app/app.env';

const initializeSardine = (sessionId) =>
  new Promise((resolve, reject) => {
    const isDev = isUATEnvironment();

    const scriptSource = process.env.REACT_APP_SARDINE_URL;

    if (!document) {
      reject(new Error('Document was not defined'));
    }

    const loader = document.createElement('script');

    loader.type = 'text/javascript';
    loader.async = true;
    loader.src = scriptSource;
    loader.onload = function () {
      const sardineContext = window._Sardine.createContext({
        clientId: process.env.REACT_APP_SARDINE_CLIENT_ID,
        sessionKey: sessionId,
        flow: window.location.pathname,
        environment: isDev ? 'sandbox' : 'production',
        parentElement: document.body,
      });

      window.sardineContext = sardineContext;
      resolve(loader);
    };

    loader.onerror = () => {
      reject(new Error('Error loading script.'));
    };

    loader.onabort = () => {
      reject(new Error('Script loading aborted.'));
    };

    const scriptNode = document.getElementsByTagName('script')[0];

    scriptNode.parentNode.insertBefore(loader, scriptNode);
  });

export const sardine = {
  async init() {
    const sessionId = sardine.generateSessionKey();

    await initializeSardine(sessionId);
    sardine.updateFlow();
  },

  updateUserId(userId) {
    const interval = setInterval(() => {
      if (window.sardineContext && window.sardineContext.updateConfig) {
        clearInterval(interval);
        window.sardineContext.updateConfig({
          userIdHash: userId,
        });
      }
    }, 2000);
  },

  updateFlow() {
    history.listen((location) => {
      window.sardineContext.updateConfig({
        flow: location.pathname,
      });
    });
  },

  generateSessionKey() {
    const sessionId = uuidv1();

    // Note: expiry time 0.0208333 (30 minutes) is in days
    cookie.set(COOKIE_KEY.SESSION_ID, sessionId, 0.0208333);

    return cookie.get(COOKIE_KEY.SESSION_ID).data;
  },
};
