import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

import { ROUTES, PAYOUT_METHOD } from 'app';
import useCommittedRef from 'components/hooks/use-committed-ref';
import useOutboundClick from 'components/hooks/use-outbound-click';

const BeneficiaryBankSelector = (props) => {
  const {
    beneficiary,
    bankIdError,
    selectedBank,
    passBankListRef,
    updateSelectedBank,
    beneficiaryBankList,
  } = props;
  const { t } = useTranslation();
  const bankRef = useCommittedRef();
  const [isOpen, setIsOpen] = useState(false);
  const [bank, selectBank] = useState({});

  passBankListRef(bankRef);
  useOutboundClick(bankRef, setIsOpen);

  useEffect(() => {
    
    if (selectedBank && Object.keys(selectedBank).length > 0) {
      return selectBank({ ...selectedBank });
    }
    
    if (selectedBank && Object.keys(selectedBank).length === 0) {
      return selectBank({});
    }
  }, [selectedBank]);

  useEffect(() => {
    updateSelectedBank(bank.referenceId);
  }, [bank, updateSelectedBank]);

  return (
    <div className="mb-3">
      <div className="w-100 form-group pl-0 m-0 position-relative ">
        <div
          onClick={() => setIsOpen(true)}
          className={`custom-select custom-bank-select cursor-pointer m-0 ${
            bankIdError !== null && bankIdError !== '' ? 'is-invalid' : ''
          }`}
        >
          <SelectedBank bank={bank} bankIdError={bankIdError} />
        </div>
        {isOpen && (
          <div ref={bankRef} className="p-0 custom-option">
            <div className="custom-option-link">
              <Link
                to={{
                  pathname: ROUTES.ADD_BENEFICIARY_PAYOUT_METHOD,
                  param: {
                    beneficiaryId: beneficiary.referenceId,
                    payoutMethod: PAYOUT_METHOD.BANK_DEPOSIT,
                  },
                }}
                className="btn btn-md btn-default m-2 w-100 p-1"
              >
                <small>
                  <i className="icon ion-md-add-circle-outline mr-2" />
                  {t('beneficiary.Add new Bank')}
                </small>
              </Link>
            </div>
            {beneficiaryBankList.map((bank, key) => (
              <BankList
                key={key}
                bank={bank}
                setIsOpen={setIsOpen}
                selectBank={selectBank}
              />
            ))}

            {beneficiaryBankList.length <= 0 && (
              <div className="p-2 pl-3 custom-option-list small text-info">
                <i className="icon ion-md-information-circle mr-2" />
                {t(
                  'beneficiary.You havent added any Bank account for this beneficiary'
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-danger small mt-1">
        {bankIdError !== null && Object.keys(bank).length <= 0 && (
          <span>{bankIdError}</span>
        )}
      </div>

      {Object.keys(bank).length > 0 && (
        <div className="col-md-12 m-0 alert alert-info">
          <div>
            {t('beneficiary.Bank')}: <b>{bank.bankName}</b>
          </div>
          <div>
            {t('beneficiary.Account Type')}: <b>{bank.accountType}</b>
          </div>
          <div>
            {t('beneficiary.Account Number')}: <b>{bank.accountNumber}</b>
          </div>
        </div>
      )}
    </div>
  );
};

const SelectedBank = ({ bank }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {Object.values(bank).length > 0 ? (
        <span className="selected-payer lead">
          <i className="icon ion-md-business mr-2" />
          <span>{bank.bankName}</span>
        </span>
      ) : (
        <React.Fragment>
          <span className="lead">
            <i className="icon ion-md-business mr-2 mt-1 text-muted" />
            {t('beneficiary.Select Payout Bank')}
          </span>
        </React.Fragment>
      )}
      <input type="hidden" name="bankId" value={bank.referenceId || ''} />
    </React.Fragment>
  );
};

const BankList = ({ bank, selectBank, setIsOpen }) => (
  <div
    onClick={() => {
      setIsOpen(false);
      selectBank(bank);
    }}
    className="p-2 pl-3 custom-option-list cursor-pointer"
  >
    <i className="icon ion-md-business mr-2" />
    <span>{bank.bankName}</span>
  </div>
);

BankList.propTypes = {
  bank: PropTypes.object,
  selectBank: PropTypes.func,
  setIsOpen: PropTypes.func,
};

SelectedBank.propTypes = {
  bank: PropTypes.object,
};

BeneficiaryBankSelector.propTypes = {
  beneficiary: PropTypes.object,
  bankIdError: PropTypes.string,
  selectedBank: PropTypes.object,
  passBankListRef: PropTypes.func,
  paymentDetail: PropTypes.object,
  updateSelectedBank: PropTypes.func,
  beneficiaryBankList: PropTypes.array,
};

export default BeneficiaryBankSelector;
