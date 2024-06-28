import React from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROLES } from 'app';
import { getIconFor, getRouteFor } from 'utils';
import { Authorization } from 'payment/components/authorization';

const SidebarMenu = (props) => {
  const { t } = useTranslation();
  const { activeTab, menus } = props;

  return (
    <React.Fragment>
      <div className="col-md-3 mb-4 ">
        <div className="p-sticky">
          <Authorization allowedRoles={ROLES.getUserGroup()}>
            <h4 className="bold text-primary mb-0">{t('auth.My Account')}</h4>
            <small className="small mt-0">
              {t('sender.Everything we know about you')}
            </small>
          </Authorization>
          <div id="material-tabs" className="">
            {Object.values(menus).map((menu, key) => (
              <div
                key={key}
                className={`col-md-12 text-left ${isTabActive(
                  menu,
                  activeTab
                )}`}
              >
                <Link to={`${getRouteFor(menu)}`}>
                  <i className={`icon ion-md-${getIconFor(menu)} pr-1`}></i>

                  {t(`menu.${menu}`)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const isTabActive = (currentTab, activeTab) => {
  if (currentTab === activeTab) {
    return 'active-tab';
  }

  return '';
};

SidebarMenu.propTypes = {
  menus: Proptypes.object,
  switchTab: Proptypes.func,
  activeTab: Proptypes.string,
};

export default SidebarMenu;
