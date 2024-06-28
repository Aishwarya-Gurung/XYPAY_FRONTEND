import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getSenderInfo } from 'auth';
import { subscribeServerEvent } from 'api';
import { ROUTES } from 'app/app.routes-path';

const eventHandler = {
  syncSenderInfo: function (args) {
    const { dispatch } = args;

    return dispatch(getSenderInfo(dispatch));
  },

  syncKYCStatus: function (args) {
    const { dispatch } = args;

    if (window.location.pathname !== ROUTES.SENDER_DETAILS) {
      return dispatch(getSenderInfo(dispatch));
    }

    return;
  },
};

const SERVER_SENT_EVENT = {
  SENDER_KYC_UPDATED: eventHandler.syncKYCStatus,
  SENDER_NAME_UPDATED: eventHandler.syncSenderInfo,
  EMAIL_VERIFIED: eventHandler.syncSenderInfo,
  PHONE_NUMBER_VERIFIED: eventHandler.syncSenderInfo,
};

const subscribeServerSentEvent = (dispatch, userId, page) => {
  const eventSource = subscribeServerEvent(userId);

  if (eventSource) {
    eventSource.onmessage = (event) => {
      const params = { dispatch, page };

      return SERVER_SENT_EVENT[event.data].call(this, params);
    };

    eventSource.onerror = function () {
      console.error('server sent event failed');
    };

    return eventSource;
  }
};

const getUserId = (state, isAuthenticated) => {
  if (isAuthenticated) {
    return state.auth
      ? state.auth.user
        ? state.auth.user.referenceId
        : null
      : null;
  }

  return null;
};

const isSignedIn = (state) => {
  return state.auth ? state.auth.isAuthenticated : false;
};

const hasEventSource = () => {
  if (window.EventSource !== undefined) {
    return true;
  }

  return false;
};

const ServerSentEvent = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => isSignedIn(state));
  const userId = useSelector((state) => getUserId(state, isAuthenticated));
  const page = useSelector((state) => state.dashboard.transactionPaging.page);

  useEffect(() => {
    if (isAuthenticated && userId && hasEventSource) {
      const eventSource = subscribeServerSentEvent(dispatch, userId, page);

      return function cleanup() {
        eventSource.close();
      };
    }
  }, [isAuthenticated, dispatch, userId, page]);

  return null;
};

export default ServerSentEvent;
