import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getIconFor } from 'utils';
import { PAYOUT_METHOD } from 'app';
import { removeBeneficiary } from 'api';

import {
  AddPayoutMethodModal,
  PayoutMethodDetailModal,
} from 'beneficiary/components/payout-method-detail-modal';
import EditBeneficiaryModal from 'beneficiary/components/edit-beneficiary';

import sl from 'components/selector/selector';
import PopupAlert from 'components/form/popup-alert';
import toast from 'components/form/toast-message-container';

const PayoutMethod = (props) => {
  const {
    payoutMethods,
    setPayoutMethods,
    payoutMethodName,
    setPayoutMethodName,
    isCashPickupEnabled,
    setIsPayoutMethodDetailOpen,
  } = staticSelector.select(props);

  return (
    <div className="col-md-4 p-1 float-left">
      <div
        onClick={() =>
          updatePayoutMethod({
            payoutMethods,
            payoutMethodName,
            setPayoutMethods,
            setPayoutMethodName,
            setIsPayoutMethodDetailOpen,
          })
        }
        className="payout-method alert alert-info text-center p-1 pt-2 pb-2 m-0 cursor-pointer"
      >
        <i className={`icon h3 ion-md-${getIconFor(payoutMethodName)}`}></i>
        <p className="small m-0">{payoutMethodName}</p>

        {payoutMethodName === PAYOUT_METHOD.CASH_PICKUP && (
          <React.Fragment>
            {isCashPickupEnabled ? (
              <span className="text-success" title="Enabled">
                <i className="icon ion-md-checkmark-circle"></i>
              </span>
            ) : (
              <span className="text-danger" title="Disabled">
                <i className="icon ion-md-warning"></i>
              </span>
            )}
          </React.Fragment>
        )}

        {payoutMethodName === PAYOUT_METHOD.BANK_DEPOSIT && (
          <React.Fragment>
            {payoutMethods.length > 0 ? (
              <span className="bold">{payoutMethods.length}</span>
            ) : (
              <span className="text-danger" title="Banks not added yet">
                <i className="icon ion-md-warning"></i>
              </span>
            )}
          </React.Fragment>
        )}
        {payoutMethodName === PAYOUT_METHOD.WALLET && (
          <React.Fragment>
            {payoutMethods.length > 0 ? (
              <span className="bold">{payoutMethods.length}</span>
            ) : (
              <span className="text-danger" title="Wallets not added yet">
                <i className="icon ion-md-warning"></i>
              </span>
            )}
          </React.Fragment>
        )}

        {payoutMethodName === PAYOUT_METHOD.HOME_DELIVERY && (
          <span className="bold text-danger" title="Disabled">
            <i className="icon ion-md-warning"></i>
          </span>
        )}
      </div>
    </div>
  );
};

const getCountryPayoutMethods = (beneficiaryCountry, destinationCountries) => {
  const country = destinationCountries.find(
    (country) => country.threeCharCode === beneficiaryCountry
  );

  return country?.payoutMethod || {};
};

const updatePayoutMethod = ({
  payoutMethods,
  setPayoutMethods,
  payoutMethodName,
  setPayoutMethodName,
  setIsPayoutMethodDetailOpen,
}) => {
  setPayoutMethods(payoutMethods);
  setIsPayoutMethodDetailOpen(true);
  setPayoutMethodName(payoutMethodName);
};

const BeneficiaryDetailList = (props) => {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [payoutMethodName, setPayoutMethodName] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState();
  const [isEditBeneficiaryOpen, setIsEditBeneficiaryOpen] = useState(false);
  const [isAddPayoutMethodOpen, setIsAddPayoutMethodOpen] = useState(false);
  const [isPayoutMethodDetailOpen, setIsPayoutMethodDetailOpen] =
    useState(false);

  const { beneficiaries } = staticSelector.select(props);

  const { destinationCountries } = useSelector((state) =>
    staticSelector.select(state.home)
  );

  const handleEditBeneficiaryOnClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsEditBeneficiaryOpen(true);
  };

  const handleAddPayoutMethodOnClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsAddPayoutMethodOpen(true);
  };

  const handleDeleteBeneficiaryOnClick = (beneficiary) => {
    setShowAlert(true);
    setSelectedBeneficiary(beneficiary);
  };

  const { isKYCVerified } = useSelector((state) =>
    staticSelector.select(state.auth)
  );

  const deleteBeneficiary = async () => {
    setIsDeleting(true);

    const { error } = await removeBeneficiary(selectedBeneficiary.referenceId);

    setShowAlert(false);
    setIsDeleting(false);

    if (error) {
   

      return toast.error(error.message);
    }

    const { getBeneficiaryList } = staticSelector.select(props);

    await getBeneficiaryList();
    toast.success(t('beneficiary.Beneficiary has been deleted successfully'));
  };

  return (
    <div className="col-md-12">
      <PopupAlert
        title={t('dashboard.Are you sure?')}
        message={t(
          'beneficiary.Do you really want to delete this beneficiary?'
        )}
        className="danger"
        alert={showAlert}
        asyncAction={deleteBeneficiary}
        isTakingAction={isDeleting}
        toggleConfirmationBox={setShowAlert}
      />

      {beneficiaries.map((beneficiary, key) => (
        <div key={key} className="border rounded mb-3 p-4 clearfix">
          <div className="col-md-12 mb-0 p-0 clearfix">
            <h4 className="text-primary mb-2 float-left d-inline">
              {beneficiary.fullName}
            </h4>
            {beneficiary?.isEditable && isKYCVerified && (
              <div
                title="Edit Beneficiary"
                onClick={() => handleEditBeneficiaryOnClick(beneficiary)}
                className="small mb-2 pt-2 ml-2 float-left cursor-pointer btn-link"
              >
                <i className="icon ion-md-refresh"></i> edit
              </div>
            )}
            {beneficiary.isDeletable && (
              <button
                onClick={() => handleDeleteBeneficiaryOnClick(beneficiary)}
                className="btn btn-sm btn-outline-danger shake ml-2 float-right"
              >
                <i className="icon ion-md-trash mr-2 d-inline-block" />
                {t('button.Delete')}
              </button>
            )}
          </div>

          <div className="col-md-6 float-left">
            <address className="text-muted m-0">
              <p className="mb-0 small">
                <i className="icon ion-md-call" /> {beneficiary.phoneNumber}
              </p>

              <div className="mb-0 small clearfix">
                <i className="icon ion-md-pin float-left" />
                <div className="pl-1 float-left">
                  {beneficiary.address.addressLine1}
                  <br />
                  {beneficiary.address.city}, {beneficiary.address.postalCode}{' '}
                  <br />
                  {beneficiary.address.state}, {beneficiary.address.country}{' '}
                </div>
              </div>
              {isKYCVerified && (
                <button
                  onClick={() => handleAddPayoutMethodOnClick(beneficiary)}
                  className="btn btn-sm btn-link text-center p-0 pl-1 mb-0 mt-2"
                >
                  <i className="icon ion-md-add-circle-outline"></i>{' '}
                  {t('beneficiary.Add new payout method')}
                </button>
              )}
            </address>
          </div>

          <div
            className="col-md-6 float-left p-0"
            onClick={() => setSelectedBeneficiary(beneficiary)}
          >
            {getCountryPayoutMethods(
              beneficiary.address.country,
              destinationCountries
            ).isBankDepositEnabled && (
              <PayoutMethod
                payoutMethods={beneficiary.banks}
                setPayoutMethods={setPayoutMethods}
                setPayoutMethodName={setPayoutMethodName}
                payoutMethodName={PAYOUT_METHOD.BANK_DEPOSIT}
                setIsPayoutMethodDetailOpen={setIsPayoutMethodDetailOpen}
              />
            )}
            {getCountryPayoutMethods(
              beneficiary.address.country,
              destinationCountries
            ).isMobileWalletEnabled && (
              <PayoutMethod
                payoutMethods={beneficiary.wallets}
                setPayoutMethods={setPayoutMethods}
                setPayoutMethodName={setPayoutMethodName}
                payoutMethodName={PAYOUT_METHOD.WALLET}
                setIsPayoutMethodDetailOpen={setIsPayoutMethodDetailOpen}
              />
            )}
            {getCountryPayoutMethods(
              beneficiary.address.country,
              destinationCountries
            ).isCashPickupEnabled && (
              <PayoutMethod
                setPayoutMethods={setPayoutMethods}
                setPayoutMethodName={setPayoutMethodName}
                payoutMethodName={PAYOUT_METHOD.CASH_PICKUP}
                isCashPickupEnabled={beneficiary.isCashPickupEnabled}
                setIsPayoutMethodDetailOpen={setIsPayoutMethodDetailOpen}
              />
            )}
          </div>
        </div>
      ))}
      <PayoutMethodDetailModal
        payoutMethods={payoutMethods}
        beneficiary={selectedBeneficiary}
        payoutMethodName={payoutMethodName}
        isModalOpen={isPayoutMethodDetailOpen}
        closeModal={setIsPayoutMethodDetailOpen}
      />

      <AddPayoutMethodModal
        beneficiary={selectedBeneficiary}
        isModalOpen={isAddPayoutMethodOpen}
        closeModal={setIsAddPayoutMethodOpen}
      />

      <EditBeneficiaryModal
        beneficiary={selectedBeneficiary}
        isModalOpen={isEditBeneficiaryOpen}
        closeModal={setIsEditBeneficiaryOpen}
      />
    </div>
  );
};

BeneficiaryDetailList.propTypes = {
  beneficiaries: PropTypes.array,
};

PayoutMethod.propTypes = {
  payoutMethods: PropTypes.array,
  setPayoutMethods: PropTypes.func,
  payoutMethodName: PropTypes.string,
  getBeneficiaryList: PropTypes.func,
  setPayoutMethodName: PropTypes.func,
  isCashPickupEnabled: PropTypes.bool,
  setIsPayoutMethodDetailOpen: PropTypes.func,
};

const staticSelector = sl.object({
  payoutMethods: sl.list(
    sl.object({
      city: sl.string(''),
      currency: sl.string(''),
      bankName: sl.string(''),
      referenceId: sl.string(''),
      accountType: sl.string(''),
      accountNumber: sl.string(''),
      identificationValue: sl.string(''),
    })
  ),
  getBeneficiaryList: sl.func(),
  isKYCVerified: sl.boolean(false),
  setPayoutMethods: sl.func(),
  payoutMethodName: sl.string(''),
  setPayoutMethodName: sl.func(),
  setIsPayoutMethodDetailOpen: sl.func(),
  isCashPickupEnabled: sl.boolean(false),
  destinationCountries: sl.list(
    sl.object({
      flagUrl: sl.string(''),
      name: sl.string(''),
      phoneCode: sl.string(''),
      twoCharCode: sl.string(''),
      threeCharCode: sl.string(''),
      currency: sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      }),
      payoutMethod: sl.object({
        isCashPickupEnabled: sl.boolean(false),
        isBankDepositEnabled: sl.boolean(false),
        isMobileWalletEnabled: sl.boolean(false),
        isHomeDeliveryEnabled: sl.boolean(false),
      }),
    })
  ),
  beneficiaries: sl.list(
    sl.object({
      firstName: sl.string(''),
      middleName: sl.string(''),
      lastName: sl.string(''),
      email: sl.string(''),
      fullName: sl.string(''),
      referenceId: sl.string(''),
      phoneNumber: sl.string(''),
      dateOfBirth: sl.string(''),
      isEditable: sl.boolean(false),
      isDeletable: sl.boolean(false),
      senderRelationship: sl.string(''),
      isCashPickupEnabled: sl.boolean(false),
      address: sl.object({
        addressLine1: sl.string(''),
        city: sl.string(''),
        country: sl.string(''),
        postalCode: sl.string(''),
        state: sl.string(''),
      }),
      banks: sl.list(
        sl.object({
          currency: sl.string(''),
          bankName: sl.string(''),
          referenceId: sl.string(''),
          accountType: sl.string(''),
          accountNumber: sl.string(''),
        })
      ),
      wallets: sl.list(
        sl.object({
          identificationValue: sl.string(''),
        })
      ),
    })
  ),
});

export default BeneficiaryDetailList;
