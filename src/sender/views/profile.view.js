import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';

import KycForm from 'sender/components/kyc-form';
import { UserProfileInfo } from 'sender/components/user-profile';
import { ACCOUNT_MENU, toggleWidgetModal } from 'sender';

import { initiateKYC } from 'api';
import { setKYCStatus, getSenderInfo } from 'auth';
import { PAGE } from 'app';
import { getReduxState, getApiExceptionMsg } from 'utils';

class Profile extends PureComponent {
  state = { isKycFormOpen: false, isBasicKYCSubmitted: false };

  componentDidMount = () => {
    const { getSenderInfo } = staticSelector.select(this.props);

    getSenderInfo();
  };

  toggleKYCWidget = () => {
    const { toggleWidgetModal } = staticSelector.select(this.props);

    toggleWidgetModal(true);
  };

  handleInitiateKYC = async () => {
    this.setState({
      isKycFormOpen: false,
    });

    const { error } = await initiateKYC();

    if (error) {
      toast.error(getApiExceptionMsg(error.message));
    }
  };

  render() {
    const {
      t,
      user,
      kycStatus,
      currentTier,
      isKYCVerified,
      isPhoneVerified,
      isEmailVerified,
      isAccountDeleteRequested,
    } = staticSelector.select(this.props);

    return (
      <AccountLayout>
        <PageHead title={PAGE.PROFILE} />
        <SidebarMenu menus={ACCOUNT_MENU} activeTab={ACCOUNT_MENU.PROFILE} />

        <div className="col-md-9">
          {this.state.isKycFormOpen ? (
            <React.Fragment>
              <h4 className="bold mb-3 text-primary">
                <i className="icon ion-md-contact"></i>{' '}
                {t('sender.Personal Information')}
              </h4>
              <div className="col-md-12 p-4 card mt-3">
                <KycForm
                  setIsBasicKYCSubmitted={() => {
                    this.setState({ isBasicKYCSubmitted: true });
                  }}
                />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h4 className="bold mb-3 text-primary">
                <i className="icon ion-md-contact"></i> {t('sender.Profile')}
              </h4>

              <UserProfileInfo
                user={user}
                kycStatus={kycStatus}
                currentTier={currentTier}
                switchTab={this.switchTab}
                isKYCVerified={isKYCVerified}
                isPhoneVerified={isPhoneVerified}
                isEmailVerified={isEmailVerified}
                toggleKYCWidget={this.toggleKYCWidget}
                setIsKycFormOpen={() => this.setState({ isKycFormOpen: true })}
                isDeleteAccountRequested={isAccountDeleteRequested}
              />
            </React.Fragment>
          )}
        </div>
      </AccountLayout>
    );
  }
}

Profile.propTypes = {
  t: PropTypes.func,
  user: PropTypes.object,
  history: PropTypes.object,
  kycStatus: PropTypes.string,
  referenceId: PropTypes.string,
  widgetToken: PropTypes.string,
  isKYCVerified: PropTypes.bool,
  isEmailVerified: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,

  location: PropTypes.object,
  setKYCStatus: PropTypes.func,
  getSenderInfo: PropTypes.func,
  toggleWidgetModal: PropTypes.func,
  isWidgetModalOpen: PropTypes.bool,

  beneficiaries: PropTypes.array,
};

const staticSelector = sl.object({
  t: sl.func(),
  user: sl.object({
    id: sl.number(),
    phoneNumber: sl.string(''),
    imageUrl: sl.string(),
    fullName: sl.string(),
    email: sl.string(),
    address: sl.object({
      country: sl.string(),
      state: sl.string(),
    }),
  }),

  location: sl.object({
    state: sl.object({
      redirectedFrom: sl.string(''),
    }),
  }),

  referenceId: sl.string(''),
  widgetToken: sl.string(null),
  kycStatus: sl.string(''),
  currentTier: sl.string('Tier 1'),

  isKYCVerified: sl.boolean(false),
  isEmailVerified: sl.boolean(false),
  isPhoneVerified: sl.boolean(false),
  isAccountDeleteRequested: sl.boolean(false),

  setKYCStatus: sl.func(),
  getSenderInfo: sl.func(),
  toggleWidgetModal: sl.func(),
  isWidgetModalOpen: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    isAccountDeleteRequested: getReduxState(
      ['auth', 'isAccountDeleteRequested'],
      state
    ),
    user: getReduxState(['auth', 'user'], state),
    kycStatus: getReduxState(['auth', 'kycStatus'], state),
    currentTier: getReduxState(['auth', 'currentTier'], state),
    widgetToken: getReduxState(['sender', 'widgetToken'], state),
    referenceId: getReduxState(['sender', 'referenceId'], state),
    isKYCVerified: getReduxState(['auth', 'isKYCVerified'], state),
    isEmailVerified: getReduxState(['auth', 'isEmailVerified'], state),
    isPhoneVerified: getReduxState(['auth', 'isPhoneVerified'], state),
    isWidgetModalOpen: getReduxState(['sender', 'isWidgetModalOpen'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setKYCStatus,
      getSenderInfo,

      toggleWidgetModal,
    },
    dispatch
  );

export const ProfileView = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
