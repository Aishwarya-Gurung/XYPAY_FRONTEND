import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import React, { useState, useRef, useEffect } from 'react';

import ResendTimer from 'sender/components/resend-timer';
import { VCODE_RESEND_TIME_INTERVAL } from 'sender/sender.constant';

import sl from 'components/selector/selector';
import { maskEmail, validateNumber } from 'utils';
import { sendTransactionVerificationCode } from 'api';

const TransactionOTPModal = (props) => {
  const { t } = useTranslation();

  const {
    closeModal,
    isModelOpen,
    completeTransaction,
    isCreatingTransaction,
    transactionError,
    verificationCodeError,
  } = staticSelector.select(props);

  const [error, setError] = useState('');
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [timer, setTimer] = useState(VCODE_RESEND_TIME_INTERVAL);
  const [transactionVerificationCode, setTransactionVerificationCode] =
    useState(Array(6).fill(''));

  const { auth } = useSelector((state) => state);
  const { user } = auth;

  const inputRefs = Array(6)
    .fill(0)
    .map(() => useRef(null));

  useEffect(() => {
    if (isModelOpen && !isCreatingTransaction) {
      setTransactionVerificationCode(Array(6).fill(''));
      setError('');
    }

    if (verificationCodeError) {
      setError(verificationCodeError);
    }
  }, [
    isModelOpen,
    transactionError,
    verificationCodeError,
    isCreatingTransaction,
  ]);

  useEffect(() => {
    if (transactionError) {
      setError(transactionError);
      inputRefs.forEach((ref, index) => {
        if (ref.current) {
          ref.current.removeAttribute('disabled');
          if (index === 0) {
            ref.current.focus();
          }
        }
      });
    }
  }, [transactionError]);

  const toggleTimerStarted = () => {
    setIsTimerStarted(!isTimerStarted);
    setTimer(VCODE_RESEND_TIME_INTERVAL);
  };

  const handleTimerChange = (time) => {
    setTimer(time);
  };

  const resendVerificationCode = async () => {
    setIsResendingOTP(true);
    setError('');

    const { error } = await sendTransactionVerificationCode();

    if (error) {
      setIsResendingOTP(false);
      setTransactionVerificationCode(Array(6).fill(''));

      return setError(error.message);
    }

    setIsResendingOTP(false);

    return toggleTimerStarted();
  };

  const handleInputChange = (index, event) => {
    const newCode = [...transactionVerificationCode];
    const value = event.target.value;

    newCode[index] = value;

    if (value !== '' && index < 6) {
      const nextInput = event.target.nextElementSibling;

      if (nextInput) {
        nextInput.removeAttribute('disabled');
        nextInput.focus();
      }

      event.target.setAttribute('disabled', 'true');
    }

    setTransactionVerificationCode(newCode);

    if (index === 5) {
      setError('');
      completeTransaction(newCode);
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && index > 0) {
      const newCode = [...transactionVerificationCode];

      if (index === 5) {
        newCode[index] = '';
      }
      newCode[index - 1] = '';

      setTransactionVerificationCode(newCode);

      const prevInput = event.target.previousElementSibling;

      if (prevInput) {
        prevInput.removeAttribute('disabled');
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const handleCloseModal = () => {
    setError('');
    closeModal();
  };

  return (
    <Modal
      isOpen={isModelOpen}
      className="modal-dialog modal-dialog-centered modal-md"
      overlayClassName="modal-open"
    >
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content p-3">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="close modal-close text-right"
              disabled={isCreatingTransaction}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <section className="row">
            <div className="col-md-12">
              <div className="d-flex flex-column text-center">
                <h5 className="col-md-12 bold text-primary mb-3 mt-3">
                  {t('verification.Confirm Transfer')}
                </h5>
                <i className="my-2">
                  <img
                    src={require('assets/img/lock.svg').default}
                    className="h1 font-weight-bold"
                    alt="lock"
                  />
                </i>
                <p className="px-3 mb-0">
                  <Trans i18nKey="verification.Enter the OTP sent to your email to confirm the transfer">
                    Enter the verification code sent to your email(
                    {maskEmail(user.email)}) to confirm the transfer.
                  </Trans>
                </p>
              </div>
              <div className="px-4 py-3">
                <div className="d-flex justify-content-center w-100 mt-3">
                  {transactionVerificationCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      className={`form-control transaction-verification-code bold ${
                        index !== transactionVerificationCode.length - 1
                          ? 'transaction-input-field'
                          : ''
                      }`}
                      onKeyPress={validateNumber}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onChange={(e) => handleInputChange(index, e)}
                      onPaste={handlePaste}
                      ref={inputRefs[index]}
                      autoFocus={index === 0}
                      readOnly={
                        index !== 0 &&
                        transactionVerificationCode[index - 1] === ''
                      }
                    />
                  ))}
                </div>

                {error && (
                  <div className="p w-100 text-danger mt-3">
                    <div className="d-flex">
                      <i className="icon ion-md-remove-circle text-danger mr-1" />
                      {error}
                    </div>
                  </div>
                )}

                {isResendingOTP || isCreatingTransaction ? (
                  <span className="d-flex align-items-center d-flex justify-content-end mt-2">
                    {isResendingOTP
                      ? t('verification.Sending')
                      : t('verification.Verifying')}
                  </span>
                ) : (
                  <span className="mt-2 d-flex align-items-center d-flex justify-content-end">
                    {!isTimerStarted ? (
                      <span
                        onClick={resendVerificationCode}
                        className="cursor-pointer text-blue"
                      >
                        {t('button.Resend')}
                      </span>
                    ) : (
                      <ResendTimer
                        isTimerStarted={isTimerStarted}
                        toggleTimerStarted={toggleTimerStarted}
                        totalTimeInterval={timer}
                        handleTimerChange={handleTimerChange}
                      />
                    )}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
};

TransactionOTPModal.propTypes = {
  isModelOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  completeTransaction: PropTypes.func,
  isCreatingTransaction: PropTypes.bool,
  transactionError: PropTypes.string,
  verificationCodeError: PropTypes.string,
};

const staticSelector = sl.object({
  verificationCodeError: sl.string(''),
  transactionError: sl.string(''),
  closeModal: sl.func(),
  completeTransaction: sl.func(),
  isModelOpen: sl.boolean(false),
  isCreatingTransaction: sl.boolean(false),
});

export default TransactionOTPModal;
