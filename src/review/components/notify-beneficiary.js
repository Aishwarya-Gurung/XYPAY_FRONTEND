import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import sl from 'components/selector/selector';
import { withTranslation } from 'react-i18next';

import { getReduxState } from 'utils';
import { notifyBeneficiary } from 'review';

import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

class NotifyBeneficiaryComponent extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const { notifyBeneficiary } = staticSelector.select(this.props);

    return notifyBeneficiary(email);
  };

  render() {
    const {
      t,
      isModalOpen,
      setModalClose,
      isSendingEmail,
      beneficiaryEmail,
      isBeneficiaryNotified,
    } = staticSelector.select(this.props);

    return (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalClose(false)}
        className="modal-dialog modal-md"
        overlayClassName="modal-open"
      >
        <div className="modal-dialog modal-md" role="document">
          <button
            type="button"
            className="close text-white"
            onClick={() => setModalClose(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h1 className="h2 text-white py-4 text-center">Notify Beneficiary</h1>

          <div className="modal-content p-3">
            <section className="row">
              <div className="col-12">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className="col-12 my-4">
                    {isBeneficiaryNotified && (
                      <span className="text-success small alert-success">
                        <i className="icon ion-md-checkmark-circle text-success" />{' '}
                        {t('review.Notification email has been sent')}
                      </span>
                    )}

                    <div className="col-md-12 form-group p-0">
                      <input
                        type="email"
                        placeholder={t('review.Beneficiary Email address')}
                        className="form-control p-2"
                        name="email"
                        value={beneficiaryEmail}
                        required
                        readOnly
                      />
                      <div className="invalid-feedback">{/*  */}</div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-lg btn-primary btn-block"
                    >
                      {isSendingEmail && <WhiteSpinner />}
                      {t('review.Notify them when ready')}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </Modal>
    );
  }
}

NotifyBeneficiaryComponent.propTypes = {
  t: PropTypes.func,
  isModalOpen: PropTypes.bool,
  setModalClose: PropTypes.func,
  isSendingEmail: PropTypes.bool,
  beneficiaryEmail: PropTypes.string,
  notifyBeneficiary: PropTypes.func,
  isBeneficiaryNotified: PropTypes.bool,
};

/**
 * Props validator.
 */
const staticSelector = sl.object({
  t: sl.func(),
  setModalClose: sl.func(),
  notifyBeneficiary: sl.func(),
  beneficiaryEmail: sl.string(''),
  isModalOpen: sl.boolean(false),
  isSendingEmail: sl.boolean(false),
  isBeneficiaryNotified: sl.boolean(false),
});

/**
 * Maps state to props.
 *
 * @param {Object} state
 */
const mapStateToProps = (state) => {
  return {
    isBeneficiaryNotified: getReduxState(
      ['review', 'isBeneficiaryNotified'],
      state
    ),
    isSendingEmail: getReduxState(['review', 'isSendingEmail'], state),
  };
};

/**
 * Maps dispatch to props.
 *
 * @param {Function} dispatch
 */
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      notifyBeneficiary,
    },
    dispatch
  );

const NotifyBeneficiary = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(NotifyBeneficiaryComponent);

export default NotifyBeneficiary;
