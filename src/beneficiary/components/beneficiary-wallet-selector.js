/* eslint-disable indent */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES, TXN_AMOUNT, PAYOUT_METHOD } from 'app';
import useCommittedRef from 'components/hooks/use-committed-ref';
import useOutboundClick from 'components/hooks/use-outbound-click';

const isWalletSendingAmountValid = (sendingAmount) => {
  return sendingAmount <= TXN_AMOUNT.MAX_WALLET_SENDING_AMT;
};

const BeneficiaryWalletSelector = (props) => {
  const {
    beneficiary,
    sendingAmount,
    walletIdError,
    selectedWallet,
    passWalletListRef,
    updateSelectedWallet,
    beneficiaryWalletList,
  } = props;
  const { t } = useTranslation();
  const walletRef = useCommittedRef();
  const [isOpen, setIsOpen] = useState(false);

  passWalletListRef(walletRef);
  useOutboundClick(walletRef, setIsOpen);

  const getCss = () => {
    const css = !isWalletSendingAmountValid(sendingAmount) ? 'disabled' : '';

    return walletIdError !== null && !isWalletSelected()
      ? `${css} is-invalid`
      : css;
  };

  const isWalletSelected = () => {
    return Object.keys(selectedWallet).length > 0;
  };

  return (
    <div className="mb-3">
      {!isWalletSendingAmountValid(sendingAmount) && (
        <div className="alert alert-danger p-2 small m-0 mb-2 d-flex">
          <i className="icon ion-md-warning mr-2" />
          {t(
            'payment.You can only send up to $700 to a mobile wallet Please use bank credit or send a lower amount'
          )}
        </div>
      )}
      <div className="w-100 form-group pl-0 m-0 position-relative">
        <div
          onClick={() => setIsOpen(true)}
          className={`custom-select custom-bank-select cursor-pointer m-0 ${getCss()}`}
        >
          <SelectedWallet
            beneficiary={beneficiary}
            sendingAmount={sendingAmount}
            selectedWallet={selectedWallet || {}}
          />
        </div>

        {isOpen && (
          <div ref={walletRef} className="p-0 custom-option">
            <div className="custom-option-link">
              <Link
                to={{
                  pathname: ROUTES.ADD_BENEFICIARY_PAYOUT_METHOD,
                  param: {
                    payoutMethod: PAYOUT_METHOD.WALLET,
                    beneficiaryId: beneficiary.referenceId,
                  },
                }}
                className="btn btn-md btn-default m-2 w-100 p-1"
              >
                <small>
                  <i className="icon ion-md-add-circle-outline mr-2" />
                  {t('beneficiary.Add new Mobile Money account')}
                </small>
              </Link>
            </div>
            {beneficiaryWalletList.map((wallet, key) => (
              <WalletList
                key={key}
                wallet={wallet}
                setIsOpen={setIsOpen}
                beneficiary={beneficiary}
                updateSelectedWallet={updateSelectedWallet}
              />
            ))}
            {beneficiaryWalletList.length <= 0 && (
              <div className="p-2 pl-3 custom-option-list small text-info">
                <i className="icon ion-md-information-circle mr-2" />
                {t(
                  'beneficiary.You havent added any Mobile Money account for this beneficiary'
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {walletIdError !== null && !isWalletSelected() && (
        <div className="text-danger small mt-1">{walletIdError}</div>
      )}
    </div>
  );
};

const SelectedWallet = ({ beneficiary, sendingAmount, selectedWallet }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <i className="icon ion-md-phone-portrait p mr-2 mt-1 text-muted" />
      {selectedWallet.identificationValue &&
      isWalletSendingAmountValid(sendingAmount) ? (
        <span className="selected-payer lead">
          <span>
            {selectedWallet.identificationValue}-{beneficiary.fullName}
          </span>
        </span>
      ) : (
        <span className="lead">{t('beneficiary.Select Wallet')}</span>
      )}
      <input
        type="hidden"
        name="walletId"
        value={selectedWallet.referenceId || ''}
        disabled={!isWalletSendingAmountValid(sendingAmount)}
      />
    </React.Fragment>
  );
};

const WalletList = ({
  wallet,
  setIsOpen,
  beneficiary,
  updateSelectedWallet,
}) => (
  <div
    onClick={() => {
      updateSelectedWallet(wallet.referenceId);
      setIsOpen(false);
    }}
    className="p-2 pl-3 cursor-pointer custom-option-list"
  >
    <span>
      <i className="icon ion-md-phone-portrait mr-2" />
      {wallet.identificationValue}-{beneficiary.fullName}
    </span>
  </div>
);

SelectedWallet.propTypes = {
  error: PropTypes.string,
  sendingAmount: PropTypes.number,
  selectedWallet: PropTypes.object,
  beneficiary: PropTypes.object,
};

WalletList.propTypes = {
  setIsOpen: PropTypes.func,
  wallet: PropTypes.object,
  updateSelectedWallet: PropTypes.func,
  beneficiary: PropTypes.object,
};

BeneficiaryWalletSelector.propTypes = {
  sendingAmount: PropTypes.number,
  walletIdError: PropTypes.string,
  selectedWallet: PropTypes.object,
  passWalletListRef: PropTypes.func,
  beneficiaryDetail: PropTypes.object,
  updateSelectedWallet: PropTypes.func,
  beneficiary: PropTypes.object,
  beneficiaryWalletList: PropTypes.array,
};

export default BeneficiaryWalletSelector;
