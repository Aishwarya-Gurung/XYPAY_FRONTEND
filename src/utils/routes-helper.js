import { ROUTES, history } from 'app';
import { getSearchParameterCookie } from './cookie-helper';
import { SEARCH_PARAMETER_COOKIES } from './utils.constant';

export const getCurrentPath = () => {
  return window.location.pathname;
};

export const isCurrentPath = (path) => {
  return window.location.pathname === path;
};

export const redirectBasedOnCookieParameter = () => {
  const [cookieParameterKey] = Object.keys(getSearchParameterCookie());

  switch (cookieParameterKey) {
    case SEARCH_PARAMETER_COOKIES.RELOGIN_TOKEN:
      return history.push(ROUTES.SENDER_BANK_ACCOUNT);

    case SEARCH_PARAMETER_COOKIES.RETRY_TIER_UPGRADE:
      return history.push(ROUTES.UPGRADE_TIER);

    case SEARCH_PARAMETER_COOKIES.PHONE_VERIFICATION:
      return history.push(
        `${ROUTES.SENDER_VERIFICATION}?phone-verification=true`
      );

    case SEARCH_PARAMETER_COOKIES.EMAIL_VERIFICATION:
      return history.push(
        `${ROUTES.SENDER_VERIFICATION}?email-verification=true`
      );

    case SEARCH_PARAMETER_COOKIES.THREE_DS_VERIFICATION:
      return history.push(`${ROUTES.DASHBOARD}?3ds-verification=true`);

    default:
      return history.push(ROUTES.HOME);
  }
};
