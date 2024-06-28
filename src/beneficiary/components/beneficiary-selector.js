/* eslint-disable indent */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useCommittedRef from 'components/hooks/use-committed-ref';
import useOutboundClick from 'components/hooks/use-outbound-click';

import { ROUTES } from 'app';

const BeneficiarySelector = (props) => {
  const {
    beneficiaries,
    beneficiaryIdError,
    selectedBeneficiary,
    updateSelectedBeneficiary,
  } = props;
  const { t } = useTranslation();
  const beneficiaryRef = useCommittedRef();
  const [isOpen, setIsOpen] = useState(false);

  useOutboundClick(beneficiaryRef, setIsOpen);

  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between mb-2">
        <p className="bold p-0 mb-1">{t('beneficiary.Select Beneficiary')}</p>
      </div>
      <div className="w-100 form-group pl-0 m-0 position-relative">
        <div
          onClick={() => setIsOpen(true)}
          className={`custom-select custom-bank-select cursor-pointer m-0 ${
            beneficiaryIdError !== null &&
            Object.keys(selectedBeneficiary).length <= 0
              ? 'is-invalid'
              : ''
          }`}
        >
          <SelectedBeneficiary
            selectedBeneficiary={selectedBeneficiary || {}}
          />
        </div>
        {isOpen && (
          <div ref={beneficiaryRef} className="p-0 custom-option w-100">
            <div className="custom-option-link">
              <Link
                to={ROUTES.BENEFICIARY_PAYOUT_METHOD_LIST}
                className="btn btn-md btn-default m-2 w-100 p-1"
              >
                <small>
                  <i className="icon ion-md-add-circle-outline mr-2" />
                  {t('beneficiary.Add new beneficiary')}
                </small>
              </Link>
            </div>
            {beneficiaries.map((beneficiary, key) => (
              <BeneficiaryList
                key={key}
                setIsOpen={setIsOpen}
                beneficiary={beneficiary}
                updateSelectedBeneficiary={updateSelectedBeneficiary}
              />
            ))}
          </div>
        )}
      </div>
      {beneficiaryIdError !== null &&
        Object.keys(selectedBeneficiary).length <= 0 && (
          <div className="text-danger small mt-1">{beneficiaryIdError}</div>
        )}
    </div>
  );
};

const SelectedBeneficiary = ({ selectedBeneficiary }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <i className="icon ion-md-contact p mr-2 mt-1 text-muted lead" />
      {selectedBeneficiary.fullName ? (
        <span className="selected-payer lead">
          <span>{selectedBeneficiary.fullName}</span>
        </span>
      ) : (
        <span className="lead">{t('beneficiary.Select Beneficiary')}</span>
      )}
      <input
        type="hidden"
        name="beneficiaryId"
        value={selectedBeneficiary.referenceId || ''}
      />
    </React.Fragment>
  );
};

SelectedBeneficiary.propTypes = {
  selectedBeneficiary: PropTypes.object,
};

const BeneficiaryList = ({
  setIsOpen,
  beneficiary,
  updateSelectedBeneficiary,
}) => (
  <div
    onClick={() => {
      setIsOpen(false);
      updateSelectedBeneficiary(beneficiary.referenceId);
    }}
    className="p-2 pl-3 cursor-pointer custom-option-list"
  >
    <i className="icon ion-md-person mr-2" />
    <span>{beneficiary.fullName}</span>
  </div>
);

BeneficiaryList.propTypes = {
  setIsOpen: PropTypes.func,
  beneficiary: PropTypes.object,
  updateSelectedBeneficiary: PropTypes.func,
};

BeneficiarySelector.propTypes = {
  beneficiaries: PropTypes.array,
  beneficiaryIdError: PropTypes.string,
  updateBankListState: PropTypes.func,
  selectedBeneficiary: PropTypes.object,
  updateSelectedBeneficiary: PropTypes.func,
};

export default BeneficiarySelector;
