import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';

const StateDisclaimerModel = (props) => {
  const { t } = useTranslation();
  const { isModelOpen, closeModal, license } = staticSelector.select(props);

  let { address } = license;

  if (address.includes('&#39;')) {
    address = address.replace(/&#39;/g, "'");
  }

  return (
    <Modal
      isOpen={isModelOpen}
      className="modal-dialog modal-lg"
      overlayClassName="modal-open"
    >
      <button type="button" onClick={closeModal} className="close text-white">
        <span aria-hidden="true">&times;</span>
      </button>
      <h1 className="h2 text-white py-3 text-center">
        {t('model.State Disclaimer')}
      </h1>
      <div className="modal-content">
        <div className="p-4 my-2 d-flex flex-column">
          <p>
            Golden Money Transfer Inc. is licensed and regulated by{' '}
            {license?.regulatoryName && license?.regulatoryName.toUpperCase()}.
            If you have any complaints, please first contact Golden Money
            Transfer at 1-888-702-5656 or info@gmtnorthamerica.com. If you still
            have unresolved complaint regarding the company’s money transmission
            activity, please direct your complaint to:
          </p>
          {license?.regulatoryName && (
            <span>{license?.regulatoryName.toUpperCase()}</span>
          )}
          {license?.address && (
            <span>
              {t('model.Address')}: {address}
            </span>
          )}
          {license?.telephone && (
            <span>
              {t('model.Telephone')}: <span>{license?.telephone}</span>
            </span>
          )}
          {license?.website && (
            <span>
              {t('model.Website')}:{' '}
              <a
                href={`${license.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bold"
              >
                {license?.website}
              </a>
            </span>
          )}
          {license?.email && (
            <span>
              {t('model.Email')}:
              <a
                href={`mailto:${license.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bold"
              >
                {license?.email}
              </a>
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};

StateDisclaimerModel.propTypes = {
  closeModal: PropTypes.func,
  isModelOpen: PropTypes.bool,
  license: PropTypes.object,
};

const staticSelector = sl.object({
  license: sl.object({
    state: sl.string(''),
    licenseNo: sl.string(null),
    regulatoryBody: sl.string(null),
    regulatoryName: sl.string(null),
    regulatoryDivision: sl.string(null),
    address: sl.string(null),
    telephone: sl.string(null),
    fax: sl.string(null),
    email: sl.string(null),
    website: sl.string(null),
    licenseType: sl.string(null),
  }),
  isModelOpen: sl.boolean(false),
  closeModal: sl.func(),
});

export default StateDisclaimerModel;
