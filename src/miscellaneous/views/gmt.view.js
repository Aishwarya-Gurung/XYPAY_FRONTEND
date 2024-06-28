import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TermsOfServiceGMT from 'miscellaneous/components/gmt-tos';
import PrivacyPolicyGMT from 'miscellaneous/components/gmt-privacy-policy';

import StateRegulatorTable from 'miscellaneous/components/state-regulator-table';

const PAGE = { LICENSING: 'licensing', TOS: 'tos', PP: 'pp' };

const GMTView = () => {
  const [activePage, setActivePage] = useState(PAGE.TOS);
  const { t } = useTranslation();

  return (
    <div className="cityscape">
      <section className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-justify mt-4 md-5 mb-5">
            <div className="text-muted">
              <h3 className="text-left">
                Golden Money Transfer User Agreement
              </h3>
              <ul className="nav nav-tab my-4 gmt-nav">
                <li
                  className={`nav-item cursor-pointer ${
                    activePage === PAGE.TOS && 'active'
                  }`}
                  onClick={() => setActivePage(PAGE.TOS)}
                >
                  <span href="#" className="nav-link">
                    {t('navbar.Terms of Service')}
                  </span>
                </li>
                <li
                  className={`nav-item cursor-pointer ${
                    activePage === PAGE.PP && 'active'
                  }`}
                  onClick={() => setActivePage(PAGE.PP)}
                >
                  <span href="#" className="nav-link">
                    {t('navbar.Privacy Policy')}
                  </span>
                </li>
                <li
                  className={`nav-item cursor-pointer ${
                    activePage === PAGE.LICENSING && 'active'
                  }`}
                  onClick={() => setActivePage(PAGE.LICENSING)}
                >
                  <span href="#" className="nav-link">
                    {t('navbar.Licensing')}
                  </span>
                </li>
              </ul>

              {getContent(activePage)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const getContent = (activePage) => {
  switch (activePage) {
    case PAGE.TOS:
      return <TermsOfServiceGMT />;

    case PAGE.PP:
      return <PrivacyPolicyGMT />;

    case PAGE.LICENSING:
      return <StateRegulatorTable showLicense={true} />;

    default:
      return;
  }
};

export default GMTView;
