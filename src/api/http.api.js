import axios from 'axios';
import React from 'react';
import { STATUS_CODE } from 'app';
import { toast } from 'react-toastify';

import { LS_KEY } from 'auth';
import { refreshAccessToken } from './request.api';
import { securedLS, withError, withData } from 'utils';
import { ErrorMessage } from 'components/form/toast-message-container';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRrefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
};

axiosInstance.interceptors.response.use(
  (response) => {
    return withData(response.data);
  },
  (error) => {
    if (error.message === STATUS_CODE.NETWORK_ERROR) {
      toast.error(<ErrorMessage message={error.message} />);

      return withError(error.message);
    }

    const {
      response: { status },
    } = error;
    const isSignedIn = securedLS.get(LS_KEY.TOKEN).data ? true : false;

    if (status === STATUS_CODE.UNAUTHORIZED && isSignedIn) {
      return handle401Error(error);
    }

    return withError(error.response ? error.response.data : error);
  }
);

const handle401Error = (error) => {
  const pendingRequest = error.config;

  if (!isRefreshing) {
    isRefreshing = true;
    refreshAccessToken().then((res) => {
      if (res.data) {
        const { data } = res;

        isRefreshing = false;
        securedLS.set(LS_KEY.TOKEN, data.token);
        onRrefreshed(data.token);

        return (refreshSubscribers = []);
      }

      // clear auth details immediately if access token
      // cannot be refreshed to prevent infinite loop
      securedLS.clear();
      window.location.reload();
    });
  }

  const retryPendingRequest = new Promise((resolve) => {
    subscribeTokenRefresh((token) => {
      // replace the expired token and retry
      pendingRequest.headers.authorization = `Bearer ${token}`;
      resolve(axiosInstance(pendingRequest));
    });
  });

  return retryPendingRequest;
};

export function get(url, params = {}) {
  return axiosInstance({
    method: 'get',
    url,
    params,
    headers: {
      authorization: `Bearer ${securedLS.get(LS_KEY.TOKEN).data}`,
    },
  });
}

export function post(url, data) {
  return axiosInstance({
    method: 'post',
    url,
    data,
    headers: {
      authorization: `Bearer ${securedLS.get(LS_KEY.TOKEN).data}`,
    },
  });
}

export function put(url, data) {
  return axiosInstance({
    method: 'put',
    url,
    data,
    headers: {
      authorization: `Bearer ${securedLS.get(LS_KEY.TOKEN).data}`,
    },
  });
}

export function patch(url, data) {
  return axiosInstance({
    method: 'patch',
    url,
    data,
    headers: {
      authorization: `Bearer ${securedLS.get(LS_KEY.TOKEN).data}`,
    },
  });
}

export function remove(url, params = {}) {
  return axiosInstance({
    method: 'delete',
    url,
    params,
    headers: {
      authorization: `Bearer ${securedLS.get(LS_KEY.TOKEN).data}`,
    },
  });
}
