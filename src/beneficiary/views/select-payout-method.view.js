import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import { getReduxState } from 'utils';
import { history, PAGE, ROUTES } from 'app';
import sl from 'components/selector/selector';
import Navbar from 'components/layout/navbar';
import { PageHead } from 'components/layout/page-head';
import PaymentSideReceipt from 'payment/components/payment-side-receipt';
import PayoutMethodSelector from 'beneficiary/components/beneficiary-payout-method-selector';

class PayoutMethod extends Component {
  state = {
    payoutMethod: null,
  };

  updatePayoutMethod = (payoutMethod) => {
    this.setState(() => {
      return {
        payoutMethod,
      };
    });
  };

  handleAddBeneficiaryDetails = () => {
    history.push({
      pathname: ROUTES.ADD_BENEFICIARY,
      state: { payoutMethod: this.state.payoutMethod },
    });
  };

  render() {
    const { t, paymentDetail } = staticSelector.select(this.props);
    const {
      location: {
        state: { isBeneficiaryAvailable },
      },
    } = staticSelector.select(this.props);

    return (
      <div className="page">
        <PageHead title={PAGE.PAYOUT_METHOD} />
        <Navbar currentStep={3} />

        <section className="container">
          <div className="row justify-content-between my-5">
            <div className="col-12 mb-4">
              <h1 className="h2 bold text-primary">
                {t('beneficiary.Payout Method')}
              </h1>
            </div>

            <div className="col-md-7 col-lg-6">
              <PayoutMethodSelector
                paymentDetail={paymentDetail}
                payoutMethod={this.state.payoutMethod}
                handleCancel={ROUTES.BENEFICIARY_DETAILS}
                updatePayoutMethod={this.updatePayoutMethod}
                isBeneficiaryAvailable={isBeneficiaryAvailable}
                handleAddBeneficiaryDetails={this.handleAddBeneficiaryDetails}
              />
            </div>

            <div className="col-md-5 col-lg-4">
              <PaymentSideReceipt />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

PayoutMethod.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
};

const staticSelector = sl.object({
  t: sl.func(),
  location: sl.object({
    state: sl.object({
      isBeneficiaryAvailable: sl.boolean(true),
    }),
  }),
});

const mapStateToProps = (state) => {
  return {
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export const PayoutMethodView = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(PayoutMethod);
