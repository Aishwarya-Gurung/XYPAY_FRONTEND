import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';

import { ROUTES, history } from 'app';

export const UserProfile = (props) => {
  const {
    user,
    kycStatus,
    openKYCWidget,
    isKYCVerified,
    isEmailVerified,
    isPhoneVerified,
  } = staticSelector.select(props);
  const { t } = useTranslation();

  return (
    <div className="col-lg-6 mb-3 mb-lg-0">
      <div className="media p-4">
        {user.imageUrl ? (
          <img className="profile-picture" src={user.imageUrl} alt="profile" />
        ) : (
          <i className="icon ion-md-contact h1 text-muted mr-4" />
        )}

        <div className="media-body">
          <div className="block clearfix">
            <h4 className="bold mt-0 pr-2 float-left">
              <Link to={ROUTES.SENDER_PROFILE}>
                {user.fullName}
                {isKYCVerified && isPhoneVerified && isEmailVerified && (
                  <i className="icon ion-md-checkmark-circle text-success ml-1" />
                )}
              </Link>
            </h4>
          </div>
          <address className="text-muted m-0">
            {user.email}
            <br />
            {user.address.state}, {user.address.country}
          </address>
        </div>
      </div>
    </div>
  );
};

const verifyEmailPhoneAndKYC = (isEmailVerified, isPhoneVerified) => {
  if (isEmailAndPhoneVerified(isEmailVerified, isPhoneVerified)) {
    return history.push({
      pathname: ROUTES.SENDER_PROFILE,
      state: { redirectedFrom: ROUTES.DASHBOARD },
    });
  }
};

const isEmailAndPhoneVerified = (isEmailVerified, isPhoneVerified) => {
  if (!isEmailVerified || !isPhoneVerified) {
    return history.push({
      pathname: ROUTES.SENDER_CONTACT_VERIFICATION,
      state: {
        redirectedFrom: ROUTES.DASHBOARD,
        nextPath: ROUTES.SENDER_PROFILE,
      },
    });
  }

  return true;
};

const verifyAccount = ({
  kycStatus,
  isKYCVerified,
  isEmailVerified,
  isPhoneVerified,
  toggleKYCWidget,
  setIsKycFormOpen,
}) => {
  if (
    isEmailAndPhoneVerified(isEmailVerified, isPhoneVerified) &&
    !isKYCVerified
  ) {
    setIsKycFormOpen();
  }
};

export const UserProfileInfo = (props) => {
  const {
    user,
    kycStatus,
    currentTier,
    isKYCVerified,
    isEmailVerified,
    isPhoneVerified,
    toggleKYCWidget,
    setIsKycFormOpen,
    isAccountDeleteRequested,
  } = staticSelector.select(props);
  const { t } = useTranslation();

  return (
    <div className="col-md-12 m-0 p-0">
      <div className="border rounded pl-4 pb-4 pr-4 pt-0">
        <div className="pb-0">
          {user.imageUrl ? (
            <img
              className="profile-picture mb-3"
              src={user.imageUrl}
              alt="profile"
            />
          ) : (
            <i className="icon ion-md-contact profile-icon text-muted mr-4" />
          )}
        </div>

        <div className="col-md-12 p-0">
          <div className="clearfix">
            <h4 className="mt-0 pr-1 text-primary float-left">
              {user.fullName}
              {isKYCVerified && isPhoneVerified && isEmailVerified && (
                <i className="icon ion-md-checkmark-circle text-success ml-1" />
              )}
            </h4>
          </div>

          <address className="w-100 text-muted m-0">
            <p className="mb-0">
              <i className="icon ion-md-mail" /> {user.email}
            </p>

            <p className="mb-0">
              <i className="icon ion-md-call" /> {user.phoneNumber}
            </p>

            <p className="mb-0">
              <i className="icon ion-md-pin" /> {user.address.state},{' '}
              {user.address.country}
            </p>
          </address>
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.object,
  switchTab: PropTypes.func,
  kycStatus: PropTypes.string,
  currentTier: PropTypes.string,
  isKYCVerified: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,
  isEmailVerified: PropTypes.bool,
  toggleKYCWidget: PropTypes.func,
  setIsKycFormOpen: PropTypes.func,
  isAccountDeleteRequested: PropTypes.bool,
};

const staticSelector = sl.object({
  user: sl.object({
    imageUrl: sl.string(),
    fullName: sl.string(),
    phoneNumber: sl.string(''),
    email: sl.string(),
    address: sl.object({
      state: sl.string(),
      country: sl.string(),
    }),
  }),
  switchTab: sl.func(),
  openKYCWidget: sl.func(),
  kycStatus: sl.string(''),
  currentTier: sl.string(''),
  toggleKYCWidget: sl.func(),
  setIsKycFormOpen: sl.func(),
  isKYCVerified: sl.boolean(false),
  isPhoneVerified: sl.boolean(false),
  isEmailVerified: sl.boolean(false),
  isAccountDeleteRequested: sl.boolean(false),
});
