import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getSenderInfo } from 'auth';
import { deleteUserAccount } from 'api';

import sl from 'components/selector/selector';
import PopupAlert from 'components/form/popup-alert';

const DeleteAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showAlert, setShowAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isAccountDeleteRequested } = useSelector((state) =>
    staticSelector.select(state.auth)
  );

  const toggleAlert = () => setShowAlert(!showAlert);

  const deleteAccount = async () => {
    setIsDeleting(true);
    const { error } = await deleteUserAccount();

    setIsDeleting(false);
    toggleAlert();

    if (error) {
      return toast.error(error.message);
    }

    return dispatch(getSenderInfo());
  };

  if (isAccountDeleteRequested) {
    return (
      <div className="alert alert-warning d-flex m-0">
        <i className="icon ion-md-warning mr-2"></i>
        <p className="m-0">
          <Trans i18nKey="sender.Account Deletion Process Message">
            Your account is under the deletion process as per your request. You
            won’t be able to perform any activity until deletion. If the account
            deletion request was not initiated by you, please contact customer
            support at <a href="tel:+23231091576">+23231091576</a> /
            <a
              href="mailto:hello@XYPAY.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              hello@XYPAY.com
            </a>
            .
          </Trans>
        </p>
      </div>
    );
  }

  return (
    <>
      <PopupAlert
        title="Are you sure?"
        message="Do you really want to delete your account?"
        className="danger"
        alert={showAlert}
        asyncAction={deleteAccount}
        isTakingAction={isDeleting}
        actionName={t('button.Delete')}
        toggleConfirmationBox={toggleAlert}
      />

      <p>
        Please note that after deleting your XYPAY account, you will not be able
        to sign up again with the same email and phone number or retrieve your
        personal and transaction information from this platform.If you want to
        proceed with the request, please confirm.
      </p>

      <button
        className="btn btn-outline-danger curser-pointer mr-2 mt-2"
        onClick={toggleAlert}
      >
        <i className="icon ion-md-trash mr-2"></i> {t('button.Delete')}
      </button>
    </>
  );
};

const staticSelector = sl.object({
  isAccountDeleteRequested: sl.boolean(false),
});

export default DeleteAccount;
