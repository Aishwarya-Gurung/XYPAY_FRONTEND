import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import { history, PAGE, ROUTES } from 'app';
import sl from 'components/selector/selector';
import Navbar from 'components/layout/navbar';
import { PageHead } from 'components/layout/page-head';
import PaymentSideReceipt from 'payment/components/payment-side-receipt';
import AddBeneficiaryForm from 'beneficiary/components/add-beneficiary';

class AddBeneficiary extends Component {
  handleAddBeneficiarySuccess = (beneficiaryId) => {
    const { location } = staticSelector.select(this.props);
    const { payoutMethod } = location.state;

    return history.push({
      pathname: ROUTES.BENEFICIARY_PAYOUT_METHOD,
      state: { beneficiaryId, payoutMethod },
    });
  };

  render() {
    const { t, location } = staticSelector.select(this.props);
    const { payoutMethod } = location.state;

    return (
      <div className="page">
        <PageHead title={PAGE.ADD_BENEFICIARY} />
        <Navbar currentStep={3} />
        <section className="container">
          <div className="row justify-content-between my-5">
            <div className="col-12 mb-4">
              <h1 className="h2 bold text-primary">
                {t('beneficiary.Beneficiary Details')}
              </h1>
            </div>

            <div className="col-md-8 col-lg-6">
              <AddBeneficiaryForm
                payoutMethod={payoutMethod}
                handleCancel={ROUTES.BENEFICIARY_DETAILS}
                handleAddBeneficiarySuccess={this.handleAddBeneficiarySuccess}
              />
            </div>

            <div className="col-md-4">
              <PaymentSideReceipt />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

AddBeneficiary.propTypes = {
  t: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  location: sl.object({
    state: sl.object({
      payoutMethod: sl.string(null),
    }),
  }),
});

export const AddBeneficiaryView = withTranslation()(AddBeneficiary);
