import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

import sl from 'components/selector/selector';
import { ReactComponent as InfoIcon } from 'assets/img/info-icon.svg';
import { ReactComponent as SuccessIcon } from 'assets/img/success-icon.svg';
import { ReactComponent as BlueSpinner } from 'assets/img/blue-spinner.svg';

const handleConfirmation = async (
  action,
  setIsModalOpen,
  toggleConfirmationBox
) => {
  // Handles action method received from props
  const isSucceeded = await action();

  if (isSucceeded) {
    togglePopupAlert(setIsModalOpen, toggleConfirmationBox);
  }
};

const togglePopupAlert = (setIsModalOpen, toggleConfirmationBox) => {
  // sets component isModelOpnen state false
  setIsModalOpen(false);

  // sets isConfirmBoxOpen false in parent for confirm box
  toggleConfirmationBox();
};

const handleSyncAction = (action, setIsModalOpen, toggleConfirmationBox) => {
  action();
  togglePopupAlert(setIsModalOpen, toggleConfirmationBox);
};

const CloseButton = (props) => {
  const { t } = useTranslation();
  const { action, className, setIsModalOpen, toggleConfirmationBox } =
    staticSelector.select(props);

  return (
    <button
      className={`btn btn-${className} w-25`}
      onClick={() =>
        handleSyncAction(action, setIsModalOpen, toggleConfirmationBox)
      }
    >
      {t('button.Close')}
    </button>
  );
};

const ActionButtons = (props) => {
  const { t } = useTranslation();
  const {
    action,
    remarks,
    className,
    actionName,
    cancelName,
    isTakingAction,
    setIsModalOpen,
    isRemarksEnabled,
    toggleConfirmationBox,
  } = staticSelector.select(props);

  return (
    <React.Fragment>
      <button
        disabled={isTakingAction}
        className={`btn btn-default mr-2 w-25`}
        onClick={() => togglePopupAlert(setIsModalOpen, toggleConfirmationBox)}
      >
        {cancelName || t('button.Cancel')}
      </button>

      <button
        disabled={isTakingAction || (isRemarksEnabled && !remarks)}
        className={`btn btn-${className} w-25`}
        onClick={() =>
          handleConfirmation(action, setIsModalOpen, toggleConfirmationBox)
        }
      >
        {actionName || t('button.Yes')}
      </button>
    </React.Fragment>
  );
};

const Message = (props) => {
  const { title, message, className, isTakingAction } =
    staticSelector.select(props);

  return (
    <React.Fragment>
      <div className="col-3 m-auto">
        {isTakingAction ? <BlueSpinner /> : <Icon className={className} />}
      </div>
      <h3 className="text-muted text-center bold">{title}</h3>
      <label className="col-12 pl-2 pr-2 text-muted text-center">
        {message}
      </label>
    </React.Fragment>
  );
};

const Icon = (props) => {
  const { className } = props;

  return className === 'success' ? <SuccessIcon /> : <InfoIcon />;
};

Icon.propTypes = {
  className: PropTypes.string,
};

const PopupAlert = (props) => {
  const {
    alert,
    title,
    remarks,
    message,
    className,
    setRemarks,
    syncAction,
    actionName,
    cancelName,
    asyncAction,
    placeholder,
    isTakingAction,
    isRemarksEnabled,
    toggleConfirmationBox,
  } = staticSelector.select(props);
  const [isModalOpen, setIsModalOpen] = useState(alert);

  useEffect(() => {
    setIsModalOpen(alert);
  }, [alert]);

  return (
    <Modal
      isOpen={isModalOpen}
      className="modal-dialog modal-md pt-5"
      overlayClassName="modal-open"
    >
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content p-2 pb-3 mt-5">
          <section className="row">
            <div className="col-12">
              <div className="clearfix p-0 pt-2">
                <Message
                  title={title}
                  message={message}
                  className={className}
                  isTakingAction={isTakingAction}
                />
              </div>

              {isRemarksEnabled && (
                <div className="col-12 my-3 d-flex justify-content-center">
                  <div className="w-75">
                    <input
                      type="text"
                      name="remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className={`form-control`}
                      placeholder={placeholder ? placeholder : 'Remarks'}
                      onKeyDown={(e) => e.key === 'Enter' && asyncAction()}
                      disabled={isTakingAction}
                    />
                  </div>
                </div>
              )}

              <div className="col-12 p-2 clearfix">
                <div className="row justify-content-center m-auto">
                  {asyncAction ? (
                    <ActionButtons
                      remarks={remarks}
                      action={asyncAction}
                      className={className}
                      actionName={actionName}
                      cancelName={cancelName}
                      isTakingAction={isTakingAction}
                      setIsModalOpen={setIsModalOpen}
                      isRemarksEnabled={isRemarksEnabled}
                      toggleConfirmationBox={toggleConfirmationBox}
                    />
                  ) : (
                    <CloseButton
                      action={syncAction}
                      className={className}
                      setIsModalOpen={setIsModalOpen}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
};

PopupAlert.propTypes = {
  alert: PropTypes.bool,
  title: PropTypes.string,
  hasError: PropTypes.bool,
  message: PropTypes.string,
  remarks: PropTypes.string,
  setRemarks: PropTypes.func,
  className: PropTypes.string,
  actionName: PropTypes.string,
  cancelName: PropTypes.string,
  isTakingAction: PropTypes.bool,
  isRemarksEnabled: PropTypes.bool,
  toggleConfirmationBox: PropTypes.func,
};

const staticSelector = sl.object({
  remarks: sl.string(''),
  setRemarks: sl.func(),
  title: sl.string(''),
  message: sl.string(),
  syncAction: sl.func(),
  asyncAction: sl.func(),
  alert: sl.boolean(false),
  actionName: sl.string(''),
  cancelName: sl.string(''),
  placeholder: sl.string(''),
  hasError: sl.boolean(false),
  setIsModalOpen: sl.func(),
  className: sl.string('danger'),
  isTakingAction: sl.boolean(false),
  isRemarksEnabled: sl.boolean(false),
  action: sl.func(function () {
    return;
  }),
  toggleConfirmationBox: sl.func(function () {
    return;
  }),
});

export default PopupAlert;
