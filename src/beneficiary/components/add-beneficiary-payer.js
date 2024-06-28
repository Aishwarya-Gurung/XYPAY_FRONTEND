import React from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import RemittancePurposeSelector from 'components/form/remittance-purpose-selector';

import { getBeneficiaryList } from 'beneficiary';
import CashPickupPayerSelector from 'beneficiary/components/cash-pickup-payer-selector';

import { history, ROUTES } from 'app';
import { getExchangeRate, storePaymentDetail } from 'payment';
import { getReduxState, isInputEmpty, setIsInvalidField } from 'utils';

class AddBeneficiaryPayer extends React.Component {
  state = {
    payerIdError: '',
    selectedPayer: {},
    remittancePurposeError: '',
  };

  componentDidMount = () => {
    const { exchangeRates, getExchangeRate } = staticSelector.select(
      this.props
    );

    if (exchangeRates.length <= 0) {
      getExchangeRate();
    }
  };

  setErrorState = (input, errorMessage = i18n.t('validation.This field cannot be empty')) => {
    if (errorMessage !== '') {
      setIsInvalidField(input);
    }

    this.setState(() => {
      return { [`${input.name}Error`]: errorMessage };
    });

    return false;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let input = null;
    const beneficiaryDetails = {};

    for (let i = 0; i < e.target.length; i++) {
      input = e.target[i];
      if (this.handleValidation(input)) {
        beneficiaryDetails[input.name] =
          input.name === 'payerId' ? parseInt(input.value) : input.value;
      }
    }

    if (Object.keys(beneficiaryDetails).length) {
      this.updateBeneficiaryDetails(beneficiaryDetails);

      return history.push(ROUTES.PAYMENT_INFORMATION);
    }
  };

  handleValidation = (input) => {
    if (isInputEmpty(input)) {
      return this.setErrorState(input);
    }

    this.setErrorState(input, '');

    return true;
  };

  updateBeneficiaryDetails = (beneficiaryDetails) => {
    const {
      payoutMethod,
      beneficiaryId,
      storePaymentDetail,
      getBeneficiaryList,
    } = staticSelector.select(this.props);

    const updatedDetails = {
      ...beneficiaryDetails,
      beneficiaryId,
      payoutMethod,
    };

    getBeneficiaryList();

    return storePaymentDetail(updatedDetails);
  };

  updateSelectedPayer = (payerId, payerBankName) => {
    const selectedPayer = this.getPayerDetails(payerId, payerBankName);

    return this.setState(() => {
      return {
        selectedPayer,
      };
    });
  };

  findExchangeRate = (destinationCurrency) => {
    const { exchangeRates, paymentDetail } = staticSelector.select(this.props);

    const exchangeRate =
      exchangeRates.find(
        (exchangeRate) =>
          exchangeRate.sourceCurrency === paymentDetail.paymentCurrency &&
          exchangeRate.destinationCurrency === destinationCurrency
      ) || {};

    if (Object.keys(exchangeRate).length) {
      return exchangeRate.rate;
    }

    return paymentDetail.exchangeRate;
  };

  getPayerDetails = (payerId, payerBankName) => {
    const { payers } = staticSelector.select(this.props);

    return (
      payers.find(
        (payer) =>
          payer.referenceId === parseInt(payerId) &&
          payer.name === payerBankName
      ) || {}
    );
  };

  getPayer = () => {
    const { payers, paymentDetail } = staticSelector.select(this.props);

    return (
      payers.filter(
        (payer) => payer.receivingCurrency === paymentDetail.receivingCurrency
      ) || {}
    );
  };

  render() {
    const { t } = staticSelector.select(this.props);
    const { payerIdError, selectedPayer } = this.state;

    return (
      <div>
        <form
          onSubmit={(e) => this.handleSubmit(e)}
          onBlur={(e) => this.handleValidation(e.target)}
        >
          <p className="bold p-0 mb-1">
            {t('beneficiary.Please Select Payer')}
          </p>
          <CashPickupPayerSelector
            payers={this.getPayer()}
            payerIdError={payerIdError}
            selectedPayer={selectedPayer}
            updateSelectedPayer={this.updateSelectedPayer}
          />
          <RemittancePurposeSelector
            varient="lead"
            remittancePurposeError={this.state.remittancePurposeError}
          />

          <Link
            title={t('button.Previous Step')}
            to={ROUTES.BENEFICIARY_DETAILS}
            className="btn btn-lg btn-default text-primary my-4 mr-2"
          >
            <i className="icon ion-md-arrow-round-back"></i>
          </Link>
          <button className="btn btn-lg btn-green my-4">
            {t('button.Click to Continue')}
          </button>
        </form>
      </div>
    );
  }
}

AddBeneficiaryPayer.propTypes = {
  sl: PropTypes.func,
  payers: PropTypes.array,
  payoutMethod: PropTypes.string,
  beneficiaryId: PropTypes.string,
  storePaymentDetail: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  payoutMethod: sl.string(''),
  beneficiaryId: sl.string(''),
  payers: sl.list(
    sl.object({
      name: sl.string(''),
      logo: sl.string(''),
      address: sl.string(''),
      referenceId: sl.number(),
      receivingCurrency: sl.string(),
    })
  ),

  paymentDetail: sl.object({
    exchangeRate: sl.number(),
    sendingAmount: sl.number(),
    receivingCurrency: sl.string(''),
    paymentCurrency: sl.string('USD'),
  }),
  getExchangeRate: sl.func(),
  exchangeRates: sl.list(
    sl.object({
      rate: sl.number(),
      sourceCurrency: sl.string(),
      destinationCurrency: sl.string(),
    })
  ),
  storePaymentDetail: sl.func(),
  getBeneficiaryList: sl.func(),
});

const mapStateToProps = (state) => {
  return {
    payers: getReduxState(['beneficiary', 'payers'], state),
    exchangeRates: getReduxState(['payment', 'exchangeRates'], state),
    paymentDetail: getReduxState(['payment', 'paymentDetail'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getExchangeRate,
      storePaymentDetail,
      getBeneficiaryList,
    },
    dispatch
  );

const AddBeneficiaryPayerForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AddBeneficiaryPayer));

export default AddBeneficiaryPayerForm;
