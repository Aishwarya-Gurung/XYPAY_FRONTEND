import Modal from 'react-modal';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { updatePrivacyPolicy } from 'api';
import { authLogOut, getSenderInfo } from 'auth';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

Modal.setAppElement('#root');

const ToSDisclaimer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isModalOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewToSChecked, setNewToSChecked] = useState(false);

  const acceptToS = async () => {
    setIsSubmitting(true);
    const { error } = await updatePrivacyPolicy();

    if (error) {
      toast.error(t('review.Something went wrong Please try again later'));

      return setIsSubmitting(false);
    }

    setIsSubmitting(false);
    dispatch(getSenderInfo());

    return setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      className="modal-dialog modal-md"
      overlayClassName="modal-open"
    >
      <div className="modal-dialog modal-md " role="document">
        <button
          type="button"
          className="close text-white"
          onClick={() => dispatch(authLogOut())}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h1 className="h2 text-white py-4 text-center">
          {t('review.Terms and Policies')}
        </h1>

        <div className="modal-content text-left">
          <div className="p-3 mx-3 mt-3">
            The services are now being provided by XYPAY Technologies Inc.
            Please accept XYPAY Technologies Inc’s
            <a
              target="_blank"
              className="mx-1"
              rel="noopener noreferrer"
              href="https://XYPAYservices.com/user-agreement-privacy-policy"
            >
              User Agreement and Privacy Policy
            </a>
            to continue using the services.
            <label htmlFor="checkbox" className="d-flex align-items-start mt-4">
              <input
                id="checkbox"
                type="checkbox"
                className="mt-2 mr-2"
                onChange={() => setNewToSChecked(!isNewToSChecked)}
              />
              <span className="mb-0">
                I agree to the User Agreement and Privacy Policy of XYPAY
                Technologies Inc.
              </span>
            </label>
          </div>

          <div className="pb-4 text-center">
            <button
              onClick={acceptToS}
              className="btn btn-lg btn-green"
              disabled={!isNewToSChecked || isSubmitting}
            >
              {isSubmitting && <WhiteSpinner />}
              {t('review.Agree and Continue')}
            </button>
            <span className="btn-gap" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ToSDisclaimer;
