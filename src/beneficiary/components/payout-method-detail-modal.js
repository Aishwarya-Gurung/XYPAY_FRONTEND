import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { resetError } from 'beneficiary';
import { PAYOUT_METHOD } from 'app';
import sl from 'components/selector/selector';
import { getIconFor, addPadding, initializeCounter } from 'utils';
import AddPayoutMethod from 'beneficiary/components/add-payout-method';

const BankDepositItem = (props) => {
  const { t } = useTranslation();
  const { count, payoutMethod } = staticSelector.select(props);

  return (
    <div className="col-md-12 clearfix">
      <div className="col-md-2 float-left sm-hide">
        <h3 className="text-muted mt-3">{addPadding(count, 0)}</h3>
      </div>
      <div className="col-md-10 alert alert-info float-right">
        <p className="payout-method-name bold pl-4">{payoutMethod.bankName}</p>
        <p className="mb-0 small">
          {t('beneficiary.Account Number')}:{' '}
          <span className="bold"> {payoutMethod.accountNumber}</span>
        </p>
        <p className="mb-0 small">
          {t('beneficiary.Account Type')}:{' '}
          <span className="bold"> {payoutMethod.accountType}</span>
        </p>
      </div>
    </div>
  );
};

const WalletItem = (props) => {
  const { t } = useTranslation();
  const { count, payoutMethod, beneficiary } = staticSelector.select(props);

  return (
    <div className="col-md-12 clearfix">
      <div className="col-md-2 float-left sm-hide">
        <h3 className="text-muted mt-3">{addPadding(count, 0)}</h3>
      </div>
      <div className="col-md-10 alert alert-info float-right">
        <p className="payout-method-name bold pl-4">{beneficiary.fullName}</p>
        <p className="mb-0 small">
          {t('beneficiary.Identification Value')}:{' '}
          <span className="bold"> {payoutMethod.identificationValue}</span>
        </p>
      </div>
    </div>
  );
};

const DisabledPayoutMethod = (props) => (
  <div className="col-md-12">
    <div className="alert alert-danger">
      <i className="icon ion-md-information-circle-outline"></i> You have not
      enabled {props.payoutMethodName} for this beneficiary
    </div>
  </div>
);

export const PayoutMethodDetailModal = (props) => {
  const counter = initializeCounter();
  const {
    closeModal,
    isModalOpen,
    beneficiary,
    payoutMethods,
    payoutMethodName,
  } = staticSelector.select(props);

  return (
    <Modal
      isOpen={isModalOpen}
      className="modal-dialog modal-md"
      overlayClassName="modal-open"
    >
      <div className="modal-dialog modal-md" role="document">
        <button
          type="button"
          className="close text-white"
          onClick={() => closeModal(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h2 className="text-white py-4 text-center">{payoutMethodName}</h2>

        <div className="modal-content p-3">
          <section className="row">
            <div className="col-md-12">
              <h5 className="col-md-12 bold text-primary mb-3 mt-1">
                <i
                  className={`icon ion-md-${getIconFor(payoutMethodName)}`}
                ></i>{' '}
                {payoutMethodName}
              </h5>

              {payoutMethodName === PAYOUT_METHOD.BANK_DEPOSIT && (
                <React.Fragment>
                  {payoutMethods.length > 0 ? (
                    <React.Fragment>
                      {payoutMethods.map((payoutMethod, key) => (
                        <div key={key}>
                          <BankDepositItem
                            count={counter.count()}
                            payoutMethod={payoutMethod}
                          />
                        </div>
                      ))}
                    </React.Fragment>
                  ) : (
                    <DisabledPayoutMethod payoutMethodName={payoutMethodName} />
                  )}
                </React.Fragment>
              )}

              {payoutMethodName === PAYOUT_METHOD.WALLET && (
                <React.Fragment>
                  {payoutMethods.length > 0 ? (
                    <React.Fragment>
                      {payoutMethods.map((payoutMethod, key) => (
                        <div key={key}>
                          <WalletItem
                            count={counter.count()}
                            payoutMethod={payoutMethod}
                            beneficiary={beneficiary}
                          />
                        </div>
                      ))}
                    </React.Fragment>
                  ) : (
                    <DisabledPayoutMethod payoutMethodName={payoutMethodName} />
                  )}
                </React.Fragment>
              )}

              {payoutMethodName === PAYOUT_METHOD.CASH_PICKUP && (
                <React.Fragment>
                  {beneficiary.isCashPickupEnabled ? (
                    <div className="col-md-12">
                      <div className="alert alert-success">
                        <i className="icon ion-md-checkmark-circle-outline"></i>{' '}
                        {payoutMethodName} is enabled for this beneficiary
                      </div>
                    </div>
                  ) : (
                    <DisabledPayoutMethod payoutMethodName={payoutMethodName} />
                  )}
                </React.Fragment>
              )}

              {payoutMethodName === PAYOUT_METHOD.HOME_DELIVERY && (
                <DisabledPayoutMethod payoutMethodName={payoutMethodName} />
              )}
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
};

export const AddPayoutMethodModal = (props) => {
  const { isModalOpen, closeModal, beneficiary } = staticSelector.select(props);

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(resetError());
    closeModal(false);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      className="modal-dialog modal-md"
      overlayClassName="modal-open"
    >
      <div className="modal-dialog modal-md" role="document">
        <button
          type="button"
          className="close text-white"
          onClick={() => handleCloseModal()}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h1 className="text-white py-4 text-center">{}</h1>

        <div className="modal-content p-3">
          <section className="row">
            <div className="col-md-12">
              <AddPayoutMethod
                beneficiaryId={beneficiary.referenceId}
                beneficiaryCountry={beneficiary.address.country}
                closeAddPayoutMethodModal={() => handleCloseModal()}
              />
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
};

BankDepositItem.propTypes = {
  count: PropTypes.number,
  payoutMethod: PropTypes.object,
};

DisabledPayoutMethod.propTypes = {
  payoutMethodName: PropTypes.string,
};

PayoutMethodDetailModal.propTypes = {
  closeModal: PropTypes.func,
  isModalOpen: PropTypes.bool,
  payoutMethods: PropTypes.array,
  payoutMethodName: PropTypes.string,
};

AddPayoutMethodModal.propTypes = {
  closeModal: PropTypes.func,
  isModalOpen: PropTypes.bool,
  beneficiary: PropTypes.object,
};

const staticSelector = sl.object({
  count: sl.number(0),
  closeModal: sl.func(),
  isModalOpen: sl.boolean(false),
  payoutMethods: sl.list(
    sl.object({
      bankName: sl.string(),
      accountType: sl.string(),
      accountNumber: sl.string(),
      identificationValue: sl.string(),
    })
  ),
  payoutMethod: sl.object({
    bankName: sl.string(),
    accountType: sl.string(),
    accountNumber: sl.string(),
    identificationValue: sl.string(),
  }),
  payoutMethodName: sl.string(),

  beneficiary: sl.object({
    email: sl.string(''),
    fullName: sl.string(''),
    referenceId: sl.string(''),
    phoneNumber: sl.string(''),
    isCashPickupEnabled: sl.boolean(false),
    address: sl.object({
      addressLine1: sl.string(''),
      city: sl.string(''),
      country: sl.string(''),
      postalCode: sl.string(''),
      state: sl.string(''),
    }),
  }),
});

export default PayoutMethodDetailModal;
