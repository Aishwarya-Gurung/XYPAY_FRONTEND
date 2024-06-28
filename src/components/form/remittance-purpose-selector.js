import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { REMITTANCE_PURPOSE } from 'app';
import sl from 'components/selector/selector';
import useCommittedRef from 'components/hooks/use-committed-ref';
import useOutboundClick from 'components/hooks/use-outbound-click';

const RemittancePurposeSelector = (props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const remittancePurposeRef = useCommittedRef();
  const { varient, remittancePurposeError } = staticSelector.select(props);

  const getRemittancePurpose = () => {
    const { defaultValue } = staticSelector.select(props);

    return (
      REMITTANCE_PURPOSE.find((purpose) => purpose.name === defaultValue) || {}
    );
  };

  useOutboundClick(remittancePurposeRef, setIsOpen);
  const [purpose, selectPurpose] = useState(getRemittancePurpose());

  return (
    <div className="mb-3">
      <div className="w-100 form-group pl-0 m-0 position-relative">
        <p className="bold m-0 mb-1">
          {t('beneficiary.Select Purpose of Transfer')}
        </p>
        <div
          onClick={() => setIsOpen(true)}
          className={`custom-select custom-bank-select cursor-pointer m-0 ${
            remittancePurposeError !== '' &&
            Object.keys(purpose).length <= 0 &&
            'is-invalid'
          }`}
        >
          <SelectedRemittancePurpose purpose={purpose} varient={varient} />
        </div>
        {isOpen && (
          <div ref={remittancePurposeRef} className="p-0 custom-option">
            {REMITTANCE_PURPOSE.map((purpose, key) => (
              <RemottancePurposeList
                key={key}
                purpose={purpose}
                setIsOpen={setIsOpen}
                selectPurpose={selectPurpose}
              />
            ))}
          </div>
        )}
      </div>
      {remittancePurposeError !== '' && Object.keys(purpose).length <= 0 && (
        <div className="text-danger small mt-1">{remittancePurposeError}</div>
      )}
    </div>
  );
};

const SelectedRemittancePurpose = ({ purpose, varient }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {Object.values(purpose).length > 0 ? (
        <span className={`selected-payer ${varient}`}>
          <i className={`icon mr-2 ion-md-${purpose.icon}`} />
          <span>{purpose.name}</span>
        </span>
      ) : (
        <span className={varient}>
          <i className="icon ion-md-paper-plane mr-2 mt-1 text-muted" />
          {t('beneficiary.Select Purpose of Transfer')}
        </span>
      )}
      <input
        type="hidden"
        name="remittancePurpose"
        value={purpose.name || ''}
      />
    </React.Fragment>
  );
};

const RemottancePurposeList = ({ purpose, selectPurpose, setIsOpen }) => (
  <div
    onClick={() => {
      setIsOpen(false);
      selectPurpose(purpose);
    }}
    className="p-2 pl-3 custom-option-list cursor-pointer"
  >
    <i className={`icon mr-2 ion-md-${purpose.icon}`} />
    <span>{purpose.name}</span>
  </div>
);

const staticSelector = sl.object({
  varient: sl.string('lead'),
  defaultValue: sl.string(''),
  remittancePurposeError: sl.string(''),
});

RemottancePurposeList.propTypes = {
  purpose: PropTypes.object,
  setIsOpen: PropTypes.func,
  selectPurpose: PropTypes.func,
};

SelectedRemittancePurpose.propTypes = {
  varient: PropTypes.string,
  purpose: PropTypes.object,
};

RemittancePurposeSelector.propTypes = {
  defaultValue: PropTypes.string,
  remittancePurposeError: PropTypes.string,
};

export default RemittancePurposeSelector;
