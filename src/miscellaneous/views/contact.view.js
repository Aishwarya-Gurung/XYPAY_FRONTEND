import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PAGE } from 'app';
import { PageHead } from 'components/layout/page-head';
import {
  validateString,
  setIsInvalidField,
  unsetIsInvalidField,
} from 'utils/form-helper';

const ContactView = () => {
  const { t } = useTranslation();

  return (
    <div className="cityscape">
      <PageHead title={PAGE.CONTACT_US} />
      <section className="container">
        <h3 className="mt-3 text-muted bold text-center">
          {t('contact.Contact us')}
        </h3>
        <div className="row justify-content-center">
          {' '}
          {/* Added row with justify-content-center */}
          <div className="col-md-6">
            <div className="text-muted text-center">
              <div className="pl-md-5 p-0 mt-3">
                <div className="d-flex">
                  <i className="icon ion-md-pin mr-2"></i>
                  <div>
                    <span className="d-block">
                      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    </span>
                    <span className="d-block">
                      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    </span>
                  </div>
                </div>
                <div className="d-flex ">
                  <i className="icon ion-md-call mr-2"></i>
                  <div>
                    <span className="d-block">
                      XX
                      <a className="ml-2">(XXX) XXXXXX,</a>
                    </span>
                    <span className="d-block">
                      <a className="ml-2">(XXX) XXXXXXXX</a>
                    </span>
                  </div>
                </div>
                <div className="d-flex  ">
                  <i className="icon ion-md-mail mr-2"></i>
                  <div>
                    <a className="d-block" href="mailto:XXXX@mailinator.com">
                      XXX@mailinator.com
                    </a>
                  </div>
                </div>
                <p className="mt-4 mb-0">For XXX Contact our Agent;</p>
                <h4> XX XX XX Bureau Ltd</h4>
                <div className="d-flex">
                  <i className="icon ion-md-pin mr-2"></i>
                  <div>
                    <span className="d-block">Headquarter; XXXXX XXXXXX</span>
                    <span className="d-block">XXXX, XXXX XXX</span>
                  </div>
                </div>
                <div className="d-flex">
                  <i className="icon ion-md-call mr-2"></i>
                  <a className="d-inline">(XXX) XXXXXXXX</a>
                  <a className="d-inline">(XXX) XXXXXXXX</a>
                  <a className="d-inline">(XXX) XXXXXXXX</a>
                </div>
                <div className="d-flex">
                  <i className="icon ion-md-mail mr-2"></i>
                  <a className="d-inline" href="mailto:  XXXX@mailinator.com">
                    XXXX@mailinator.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
