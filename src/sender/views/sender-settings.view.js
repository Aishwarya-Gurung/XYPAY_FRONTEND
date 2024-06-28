import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import { PAGE } from 'app';

import sl from 'components/selector/selector';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';

import { ACCOUNT_MENU } from 'sender';
import SettingCard from 'sender/components/settings-card';
import DevicesTable from 'sender/components/devices-table';
import DeleteAccount from 'sender/components/delete-account';
import ResetPasswordForm from 'sender/components/reset-password';

const SETTING_ITEM = {
  OTHER: 'other',
  CHANGE_PASSWORD: 'change Passoword',
  ACCOUNT_DELETE: 'Delete Account',
};

class Settings extends PureComponent {
  state = {
    activeCard: '',
  };

  setActiveCard = (activeCard) => {
    if (activeCard === this.state.activeCard) {
      return this.setState({ activeCard: '' });
    }

    return this.setState({ activeCard });
  };

  componentDidMount = () => {};

  render() {
    const { t } = staticSelector.select(this.props);

    return (
      <AccountLayout>
        <PageHead title={PAGE.SETTINGS} />
        <SidebarMenu menus={ACCOUNT_MENU} activeTab={ACCOUNT_MENU.SETTINGS} />

        <div className="col-md-9">
          <h4 className="bold mb-3 text-primary">
            <i className="icon ion-md-construct"></i> {t('sender.Settings')}
          </h4>

          <SettingCard
            card={SETTING_ITEM.CHANGE_PASSWORD}
            requirement
            activeCard={this.state.activeCard}
            cardTitle={t('sender.Change Password')}
            setActiveCard={this.setActiveCard}
            icon="icon ion-md-unlock"
          >
            <div className="col-lg-8">
              <ResetPasswordForm isOldPasswordRequired={true} />
            </div>
          </SettingCard>

          <SettingCard
            card={SETTING_ITEM.ACCOUNT_DELETE}
            requirement
            activeCard={this.state.activeCard}
            cardTitle={t('sender.Delete Account')}
            setActiveCard={this.setActiveCard}
            icon="icon ion-md-trash"
          >
            <div className="col-lg-12">
              <DeleteAccount />
            </div>
          </SettingCard>
        </div>
      </AccountLayout>
    );
  }
}

Settings.propTypes = {
  t: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
});

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export const SettingsView = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Settings)
);
