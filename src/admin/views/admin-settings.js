import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { PureComponent } from 'react';

import { withTranslation } from 'react-i18next';

import { PAGE } from 'app';
import { ADMIN_MENU } from 'admin';
import sl from 'components/selector/selector';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import SettingCard from 'sender/components/settings-card';
import DevicesTable from 'sender/components/devices-table';
import AccountLayout from 'components/layout/account-layout';

const SETTING_ITEM = {
  DEVICES: 'Devices',
};

class Settings extends PureComponent {
  state = {
    activeCard: '',
  };

  setActiveCard = (activeCard) => {
    this.setState({ activeCard });
  };

  autoOpenSingleMenu = () => {
    if (Object.keys(SETTING_ITEM).length === 1) {
      this.setActiveCard(SETTING_ITEM[Object.keys(SETTING_ITEM)[0]]);
    }
  };

  componentDidMount = () => {
    this.autoOpenSingleMenu();
  };

  render() {
    const { t } = staticSelector.select(this.props);

    return (
      <AccountLayout>
        <PageHead title={PAGE.SETTINGS} />
        <SidebarMenu menus={ADMIN_MENU} activeTab={ADMIN_MENU.SETTING} />

        <div className="col-md-9">
          <h4 className="bold mb-3 text-primary">
            <i className="icon ion-md-construct"></i> {t('sender.Settings')}
          </h4>

          <SettingCard
            card={SETTING_ITEM.DEVICES}
            requirement
            activeCard={this.state.activeCard}
            cardTitle={t('sender.Devices')}
            setActiveCard={this.setActiveCard}
            icon="icon ion-md-phone-portrait"
          >
            <div className="col-lg-12 text-muted">
              <DevicesTable />
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

export const AdminSettingsView = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Settings)
);
