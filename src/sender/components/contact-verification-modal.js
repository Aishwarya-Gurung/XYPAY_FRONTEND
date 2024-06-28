import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import sl from 'components/selector/selector';
import ContactVerification from './contact-verification';

const ContactVerificationModal = (props) => {
  const { closeModal } = props;
  const { isContactVerificationModalOpen } = staticSelector.select(props);

  return (
    <Modal
      isOpen={isContactVerificationModalOpen}
      className="modal-dialog modal-lg"
      overlayClassName="modal-open"
    >
      <div className="modal-dialog modal-lg" role="document">
        <button
          type="button"
          onClick={closeModal}
          className="close text-white mb-2"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="modal-content modal-lg text-center d-flex align-items-center">
          <ContactVerification />
        </div>
      </div>
    </Modal>
  );
};

ContactVerificationModal.propTypes = {
  closeModal: PropTypes.func,
  isContactVerificationModalOpen: PropTypes.bool,
};

const staticSelector = sl.object({
  stateCode: sl.string(''),
  isContactVerificationModalOpen: sl.boolean(false),
});

export default ContactVerificationModal;
