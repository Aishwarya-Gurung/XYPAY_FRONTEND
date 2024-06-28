import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

import useCommittedRef from 'components/hooks/use-committed-ref';
import useOutboundClick from 'components/hooks/use-outbound-click';

import sl from 'components/selector/selector';

const CashPickupPayerSelector = (props) => {
  const { payers, payerIdError, selectedPayer, updateSelectedPayer } =
    staticSelector.select(props);

  const { t } = useTranslation();
  const payerRef = useCommittedRef();
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [payer, selectPayer] = useState(selectedPayer);

  useOutboundClick(payerRef, setIsOpen);

  const onChange = (e) => {
    e.preventDefault();
    const query = e.target.value;
    const result = payers.filter(
      (payer) =>
        payer.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
        payer.address.toLowerCase().indexOf(query.toLowerCase()) > -1
    );

    setSuggestions([...result]);
  };

  useEffect(() => {
    if (!isOpen) {
      setSuggestions([...payers]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateSelectedPayer(payer.referenceId, payer.name);
  }, [payer, suggestions, updateSelectedPayer]);

  return (
    <div className="mb-3">
      <div className="w-100 form-group pl-0 m-0 position-relative">
        <div
          onClick={() => setIsOpen(true)}
          className={`custom-select custom-bank-select cursor-pointer m-0 ${
            payerIdError !== '' && 'is-invalid'
          }`}
        >
          <SelectedCashpickUpBank
            payer={selectedPayer}
            payerIdError={payerIdError}
          />
        </div>
        {isOpen && (
          <div ref={payerRef} className="p-0 custom-option">
            <div className="col-md-12 p-2">
              <input
                type="text"
                name="search"
                onChange={onChange}
                className="form-control"
                placeholder="Search cash pickup location"
              />
            </div>
            {suggestions.map((payer, key) => (
              <CashPickUpBankList
                key={key}
                payer={payer}
                selectPayer={selectPayer}
                setIsOpen={setIsOpen}
              />
            ))}

            {suggestions.length <= 0 && (
              <div className="p-2 pl-3 custom-option-list small text-info">
                <i className="icon ion-md-information-circle mr-2" />
                {t('beneficiary.Cash Pickup Location not found')}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-danger small mt-1">
        {payerIdError !== '' && <span>{payerIdError}</span>}
      </div>
    </div>
  );
};

const SelectedCashpickUpBank = ({ payer }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {payer.name ? (
        <span className="selected-payer lead">
          <i className="icon ion-md-pin mr-2" />
          <span>{payer.name}</span>
        </span>
      ) : (
        <React.Fragment>
          <span className="lead">
            <i className="icon ion-md-map mr-2 mt-1 text-muted" />
            {t('beneficiary.Select Cash Pickup Location')}
          </span>
        </React.Fragment>
      )}
      <input type="hidden" name="payerId" value={payer.referenceId} />
      <input type="hidden" name="payerBankName" value={payer.name} />
    </React.Fragment>
  );
};

const CashPickUpBankList = ({ payer, selectPayer, setIsOpen }) => {
  return (
    <div
      onClick={() => {
        selectPayer(payer);
        setIsOpen(false);
      }}
      className="p-2 pl-3 custom-option-list cursor-pointer"
    >
      <i className="icon ion-md-pin mr-2" />
      <span className="custom-option-list__name">{payer.name}</span>
      <div className="custom-option-list__address">{payer.address}</div>
    </div>
  );
};

SelectedCashpickUpBank.propTypes = {
  payer: PropTypes.object,
  payerIdError: PropTypes.string,
};

CashPickUpBankList.propTypes = {
  payer: PropTypes.object,
  setIsOpen: PropTypes.func,
  selectPayer: PropTypes.func,
};

CashPickupPayerSelector.propTypes = {
  payers: PropTypes.array,
  beneficiary: PropTypes.object,
  payerIdError: PropTypes.string,
  selectedPayer: PropTypes.object,
  updateSelectedPayer: PropTypes.func,
};

const staticSelector = sl.object({
  payers: sl.list(
    sl.object({
      name: sl.string(''),
      logo: sl.string(''),
      address: sl.string(''),
      referenceId: sl.number(''),
      payingEntity: sl.string(''),
      receivingCurrency: sl.string(''),
    })
  ),
  beneficiary: sl.object({
    referenceId: sl.string(''),
  }),
  payerIdError: sl.string(''),
  selectedPayer: sl.object({
    name: sl.string(''),
    logo: sl.string(''),
    referenceId: sl.number(0),
    payingEntity: sl.string(''),
    receivingCurrency: sl.string(''),
  }),
  updateSelectedPayer: sl.func(function () {
    return;
  }),
});

export default CashPickupPayerSelector;
