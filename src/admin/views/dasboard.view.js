import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import { PAGE } from 'app';
import { ADMIN_MENU } from 'admin';
import sl from 'components/selector/selector';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';

class AdminDashboard extends PureComponent {
  render() {
    const { t } = staticSelector.select(this.props);

    return (
      <AccountLayout>
        <PageHead title={PAGE.DASHBOARD} />
        <SidebarMenu menus={ADMIN_MENU} activeTab={ADMIN_MENU.DASHBOARD} />
        <div className="col-md-9 rounded border p-4">
          <p className="lead text-center">
            {t('dashboard.Welcome to Dashboard')}
          </p>
          <p className="text-center">
            {t('dashboard.You are logged in as Super Admin')}
          </p>
        </div>
      </AccountLayout>
    );
  }
}

AdminDashboard.propTypes = {
  t: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
});

export const AdminDashboardView = withTranslation()(AdminDashboard);
