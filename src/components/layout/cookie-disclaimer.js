import React from 'react';
import { cookie } from 'utils';
import { Link } from 'react-router-dom';
import { ROUTES, COOKIE_KEY } from 'app';

const acceptCookieAndPrivacyPolicy = () => {
  cookie.set(COOKIE_KEY.ACCEPT_COOKIE, true, 180);
  cookie.set(COOKIE_KEY.ACCEPT_PRIVACY_POLICY, true, 180);
};

const CookieDisclaimer = () => {
  const isCookieAccepted = cookie.get(COOKIE_KEY.ACCEPT_COOKIE).data;
  const isPrivacyPolicyAccepted = cookie.get(
    COOKIE_KEY.ACCEPT_PRIVACY_POLICY
  ).data;

  if (isCookieAccepted && isPrivacyPolicyAccepted) {
    return null;
  }

  return (
    <React.Fragment>
      <input
        id="checkbox-cb"
        type="checkbox"
        onClick={acceptCookieAndPrivacyPolicy}
        className="checkbox-cb"
      />
      <div className="cookie-bar">
        {!isPrivacyPolicyAccepted && (
          <>
            <span className="message">
              We have updated our{' '}
              <Link to={`${ROUTES.TERMS_OF_SERVICE}/#delete-account`}>
                Term of Service
              </Link>{' '}
              and{' '}
              <Link to={`${ROUTES.PRIVACY_POLICY}/#delete-account`}>
                Privacy Policy.
              </Link>{' '}
              By continuing to use the XYPAY website, you agree to these
              updates.
            </span>
            <span className="mobile">
              Please accept our{' '}
              <Link to={`${ROUTES.TERMS_OF_SERVICE}/#delete-account`}>
                Terms
              </Link>{' '}
              and{' '}
              <Link to={`${ROUTES.PRIVACY_POLICY}/#delete-account`}>
                Policies.
              </Link>
            </span>
          </>
        )}

        {!isCookieAccepted && (
          <>
            <span className="message">
              This website uses cookies to ensure you get the best experience on
              our website, as described in our{' '}
              <Link to={`${ROUTES.PRIVACY_POLICY}#cookie`}>
                Privacy Policy.
              </Link>
            </span>
            <span className="mobile">
              This website uses cookies,{' '}
              <Link to={ROUTES.PRIVACY_POLICY}>learn more</Link>
            </span>
          </>
        )}

        <label
          htmlFor="checkbox-cb"
          className="close-cb btn btn-sm btn-outline-warning"
        >
          Accept
        </label>
      </div>
    </React.Fragment>
  );
};

export default CookieDisclaimer;
