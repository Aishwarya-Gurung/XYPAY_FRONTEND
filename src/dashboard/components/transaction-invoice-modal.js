import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import BlinkTextLoader from 'components/form/blink-loader-text';

Modal.setAppElement('#root');

const TransactionInvoiceModal = (props) => {
  const { t } = useTranslation();
  const { closeModal, isModalOpen, invoice } = staticSelector.select(props);

  return (
    <Modal
      isOpen={isModalOpen}
      overlayClassName="modal-open"
      className="modal-dialog modal-md"
    >
      <div className="modal-dialog modal-md" role="document">
        <button type="button" className="close text-white" onClick={closeModal}>
          <span aria-hidden="true">&times;</span>
        </button>
        <h1 className="h2 text-white py-2 text-center">
          {t('receipt.Receipt')}
        </h1>

        <div className="modal-body p-3 border rounded bg-white">
          {!invoice ? (
            <BlinkTextLoader
              margin={5}
              message={t('receipt.Generating receipt')}
            />
          ) : (
            <iframe
              src={invoice}
              height="700px"
              allowFullScreen
              title={t('receipt.Receipt')}
              className="d-block w-100 m-auto"
            ></iframe>
          )}
        </div>
      </div>
    </Modal>
  );
};

TransactionInvoiceModal.propTypes = {
  invoice: PropTypes.string,
  closeModal: PropTypes.func,
  isModalOpen: PropTypes.bool,
};

const staticSelector = sl.object({
  closeModal: sl.func(),
  invoice: sl.string(''),
  isModalOpen: sl.boolean(false),
});

export default TransactionInvoiceModal;
