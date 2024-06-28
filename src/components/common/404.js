import React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as InfoIcon } from 'assets/img/info-icon.svg';

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="cityscape">
      <section className="container">
        <div className="row justify-content-between my-5">
          <div className="col-3 m-auto mb-2">
            <InfoIcon />
          </div>
          <div className="col-12">
            <div className="col-sm-6 m-auto text-center">
              <h3 className="text-danger">{t('auth.404')}</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageNotFound;
