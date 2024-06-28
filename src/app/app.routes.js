import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';

import {
  LS_KEY,
  VerifyEmailView,
  ResetPasswordView,
  ForgotPasswordView,
  OAuth2AuthenticationView,
} from 'auth';
import {
  ProfileView,
  SettingsView,
  SenderSignUpView,
  SenderSignInView,
  SenderDetailsView,
  SenderVerificationView,
  SenderOnFLowRegistrationView,
} from 'sender';
import {
  PayoutMethodView,
  AddBeneficiaryView,
  NewBeneficiaryView,
  AddPayoutMethodView,
  BeneficiaryListView,
  BeneficiaryDetailsView,
  CreateBeneficiaryPayoutMethodView,
} from 'beneficiary';
import { history } from 'app/app.history';
import { DashboardView } from 'dashboard';
import { ROLES } from 'app/app.constant.js';
import { ROUTES } from 'app/app.routes-path';
import Footer from 'components/layout/footer';
import Header from 'components/layout/header';
import PageNotFound from 'components/common/404';
import ReloadRoute from 'components/common/reload-route';
import { PaymentDetailsView, PaymentInformationView } from 'payment';

import GMTView from 'miscellaneous/views/gmt.view.js';
import HomeView from 'landing-page/views/home.view.js';
import ContactView from 'miscellaneous/views/contact.view.js';
import AboutUsView from 'miscellaneous/views/about-us.view.js';
import ProductsView from 'miscellaneous/views/products.view.js';
import TermsOfServiceView from 'miscellaneous/views/tos.view.js';
import PrivacyPolicyView from 'miscellaneous/views/privacy-policy.view.js';
import {
  FeeSetView,
  AddFeeSetView,
  AdminSettingsView,
  LockedSendersView,
  AdminDashboardView,
} from 'admin';

import {
  withAuthorization,
  withPublicAuthorization,
} from 'payment/components/authorization';
import sl from 'components/selector/selector';
import {
  securedLS,
  scrollToTop,
  getReduxState,
  storeSearchParameterInCookie,
} from 'utils';
import DeleteRequestView from 'admin/views/delete-request.view';
import CookieDisclaimer from 'components/layout/cookie-disclaimer';
import { SetupAccountView } from 'sender/views/setup-account-view';
import { SenderContactVerificationView } from 'sender/views/sender-contact-verification.view';

/**
 * HOC with User log in status.
 */
const withAuthenticationState = compose(
  withRouter,
  connect((state) => ({
    isSignedIn:
      securedLS.get(LS_KEY.TOKEN).data &&
      getReduxState(['auth', 'isAuthenticated'], state)
        ? true
        : false,
    user: getReduxState(['auth', 'user'], state),
    isEmailVerified: getReduxState(['auth', 'isEmailVerified'], state),
    isPhoneVerified: getReduxState(['auth', 'isPhoneVerified'], state),
  }))
);

const isAccountVerified = (props) => {
  const { isEmailVerified, isPhoneVerified, component } = props;

  if (
    (isEmailVerified && isPhoneVerified) ||
    component === SenderVerificationView
  ) {
    return true;
  }

  return false;
};

const AuthenticatedRoute = (props) => {
  const { isSignedIn } = staticSelector.select(props);

  scrollToTop();

  return isSignedIn ? <Route {...props} /> : <ReloadRoute to={ROUTES.HOME} />;
};

const PrivateRoute = withAuthenticationState(
  withAuthorization(
    AuthenticatedRoute,
    ROLES.getUserGroup(),
    ROUTES.ADMIN_DASHBOARD
  )
);

const NonAuthenticatedRoute = (props) => {
  const isVerified = isAccountVerified(props);
  const { isSignedIn, component } = staticSelector.select(props);

  scrollToTop();

  if (
    isSignedIn &&
    (component === SenderSignUpView ||
      component === SenderSignInView ||
      component === ResetPasswordView ||
      component === ForgotPasswordView ||
      component === SenderOnFLowRegistrationView)
  ) {
    if (isVerified) {
      switch (component) {
        case SenderSignUpView:
        case SenderSignInView:
          return <Redirect to={ROUTES.PAYMENT_DETAILS} />;

        case HomeView:
          return <Redirect to={ROUTES.DASHBOARD} />;

        default:
          return <Redirect to={ROUTES.SENDER_DETAILS} />;
      }
    }

    return (
      <Redirect
        to={{
          pathname: ROUTES.SENDER_CONTACT_VERIFICATION,
          state: {
            nextPath:
              component === SenderOnFLowRegistrationView
                ? ROUTES.SENDER_DETAILS
                : ROUTES.PAYMENT_DETAILS,
          },
        }}
      />
    );
  }

  return <Route {...props} />;
};

const PublicRoute = withAuthenticationState(
  withPublicAuthorization(NonAuthenticatedRoute, ROUTES.ADMIN_DASHBOARD)
);

const VerifiedAccountRoute = (props) => {
  const { isSignedIn, component } = staticSelector.select(props);
  const isVerified = isAccountVerified(props);

  scrollToTop();

  return isSignedIn && isVerified ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: ROUTES.SENDER_CONTACT_VERIFICATION,
        state: {
          nextPath:
            component === SenderOnFLowRegistrationView
              ? ROUTES.SENDER_DETAILS
              : ROUTES.PAYMENT_DETAILS,
        },
      }}
    />
  );
};

const VerifiedPrivateRoute = withAuthenticationState(
  withAuthorization(
    VerifiedAccountRoute,
    ROLES.getUserGroup(),
    ROUTES.ADMIN_DASHBOARD
  )
);

const AdminRoute = (props) => {
  const { isSignedIn } = staticSelector.select(props);

  scrollToTop();

  return isSignedIn ? <Route {...props} /> : <Redirect to={ROUTES.HOME} />;
};

const AdminPrivateRoute = withAuthenticationState(
  withAuthorization(AdminRoute, ROLES.getAdminGroup(), ROUTES.HOME)
);

export const Routes = () => {
  if (window.location.search) {
    storeSearchParameterInCookie(window.location.search);
  }

  return (
    <Router history={history}>
      <Header />
      <CookieDisclaimer />
      <Switch>
        <PublicRoute exact path={ROUTES.HOME} component={HomeView} />
        <PublicRoute exact path={ROUTES.ABOUT_US} component={AboutUsView} />
        <PublicRoute exact path={ROUTES.CONTACT} component={ContactView} />
        <PublicRoute exact path={ROUTES.PRODUCTS} component={ProductsView} />
        <PublicRoute
          exact
          path={ROUTES.TERMS_OF_SERVICE}
          component={TermsOfServiceView}
        />
        <PublicRoute
          exact
          path={ROUTES.PRIVACY_POLICY}
          component={PrivacyPolicyView}
        />
        <PublicRoute exact path={ROUTES.GMT} component={GMTView} />
        <PublicRoute
          exact
          path={ROUTES.OAUTH_REDIRECT}
          component={OAuth2AuthenticationView}
        />
        <PublicRoute
          exact
          path={ROUTES.VERIFY_EMAIL}
          component={VerifyEmailView}
        />
        <PublicRoute
          exact
          path={ROUTES.SENDER_SIGN_UP}
          component={SenderSignUpView}
        />
        <PublicRoute
          exact
          path={ROUTES.SENDER_SIGN_IN}
          component={SenderSignInView}
        />
        <PublicRoute
          exact
          path={ROUTES.FORGOT_PASSWORD}
          component={ForgotPasswordView}
        />
        <PublicRoute
          exact
          path={ROUTES.RESET_PASSWORD}
          component={ResetPasswordView}
        />
        <PrivateRoute exact path={ROUTES.DASHBOARD} component={DashboardView} />
        <PublicRoute
          exact
          path={ROUTES.PAYMENT_DETAILS}
          component={PaymentDetailsView}
        />
        <VerifiedPrivateRoute
          exact
          path={ROUTES.PAYMENT_INFORMATION}
          component={PaymentInformationView}
        />
        <VerifiedPrivateRoute
          exact
          path={ROUTES.ADD_BENEFICIARY}
          component={AddBeneficiaryView}
        />
        <VerifiedPrivateRoute
          exact
          path={ROUTES.NEW_BENEFICIARY}
          component={NewBeneficiaryView}
        />
        <VerifiedPrivateRoute
          exact
          path={ROUTES.BENEFICIARY_DETAILS}
          component={BeneficiaryDetailsView}
        />
        <VerifiedPrivateRoute
          exact
          path={ROUTES.BENEFICIARY_PAYOUT_METHOD_LIST}
          component={PayoutMethodView}
        />
        <PublicRoute
          exact
          path={ROUTES.SENDER_REGISTRATION_ON_FLOW}
          component={SenderOnFLowRegistrationView}
        />
        <PrivateRoute
          exact
          path={ROUTES.BENEFICIARY_PAYOUT_METHOD}
          component={CreateBeneficiaryPayoutMethodView}
        />
        <PrivateRoute
          exact
          path={ROUTES.BENEFICIARY_LIST}
          component={BeneficiaryListView}
        />
        <PrivateRoute
          exact
          path={ROUTES.ADD_BENEFICIARY_PAYOUT_METHOD}
          component={AddPayoutMethodView}
        />
        <PublicRoute
          exact
          path={ROUTES.SENDER_VERIFICATION}
          component={SenderVerificationView}
        />
        <PrivateRoute
          exact
          path={ROUTES.SENDER_ACCOUNT_SETUP}
          component={SetupAccountView}
        />
        <PrivateRoute
          exact
          path={ROUTES.SENDER_CONTACT_VERIFICATION}
          component={SenderContactVerificationView}
        />
        <PrivateRoute
          exact
          path={ROUTES.SENDER_DETAILS}
          component={SenderDetailsView}
        />
        <PrivateRoute
          exact
          path={ROUTES.SENDER_SETTINGS}
          component={SettingsView}
        />
        <PrivateRoute
          exact
          path={ROUTES.SENDER_PROFILE}
          component={ProfileView}
        />
        <AdminPrivateRoute
          exact
          path={ROUTES.ADMIN_DASHBOARD}
          component={AdminDashboardView}
        />
        <AdminPrivateRoute
          exact
          path={ROUTES.LOCKED_SENDERS}
          component={LockedSendersView}
        />

        <AdminPrivateRoute
          exact
          path={ROUTES.ADD_FEE_SET}
          component={AddFeeSetView}
        />

        <AdminPrivateRoute
          exact
          path={ROUTES.DELETE_REQUESTS}
          component={DeleteRequestView}
        />

        <AdminPrivateRoute
          exact
          path={ROUTES.ADMIN_SETTING}
          component={AdminSettingsView}
        />

        <AdminPrivateRoute exact path={ROUTES.FEE_SET} component={FeeSetView} />

        <Route component={PageNotFound} />
      </Switch>
      <Footer />
    </Router>
  );
};

AuthenticatedRoute.propTypes = {
  path: PropTypes.string,
  component: PropTypes.any,
  history: PropTypes.object,
  isSignedIn: PropTypes.bool,
  isEmailVerified: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,
};

NonAuthenticatedRoute.propTypes = {
  path: PropTypes.string,
  component: PropTypes.any,
  history: PropTypes.object,
  isSignedIn: PropTypes.bool,
  isEmailVerified: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,
};

const staticSelector = sl.object({
  rest: sl.any(),
  component: sl.any(),
  path: sl.string(ROUTES.HOME),
  isSignedIn: sl.boolean(false),
  user: sl.object({
    roles: sl.list(sl.string('')),
  }),
  isEmailVerified: sl.boolean(false),
  isPhoneVerified: sl.boolean(false),
});
