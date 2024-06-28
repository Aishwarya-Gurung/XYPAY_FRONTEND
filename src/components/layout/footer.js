import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROLES, ROUTES } from 'app';
import { Authorization } from 'payment/components/authorization';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="container border-top">
        <div className="row py-4">
          <div className="col-md-12 p-4">
            <Authorization
              allowedRoles={ROLES.getUserGroup().concat(ROLES.getPublicGroup())}
            >
              <ul className="footer-menu clearfix">
                <li className="footer-menu-item">
                  <Link to={ROUTES.HOME} className="nav-link text-muted">
                    {t('footer.Home')}
                  </Link>
                </li>
                <li className="footer-menu-item">
                  <Link to={ROUTES.ABOUT_US} className="nav-link text-muted">
                    {t('footer.About Us')}
                  </Link>
                </li>
                <li className="footer-menu-item">
                  <Link
                    to={ROUTES.TERMS_OF_SERVICE}
                    className="nav-link text-muted"
                  >
                    {t('footer.Terms')}
                  </Link>
                </li>
                <li className="footer-menu-item">
                  <Link
                    to={ROUTES.PRIVACY_POLICY}
                    className="nav-link text-muted"
                  >
                    {t('footer.Privacy policy')}
                  </Link>
                </li>
                <li className="footer-menu-item">
                  <Link to={ROUTES.CONTACT} className="nav-link text-muted">
                    {t('footer.Contact')}
                  </Link>
                </li>
              </ul>
            </Authorization>
          </div>

          <div className="col-md-12 mb-3 m-md-0">
            <p className="text-muted text-center small">
              &copy; Copyright {new Date().getFullYear()}, XYPAY
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
