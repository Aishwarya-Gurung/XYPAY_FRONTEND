import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Table from 'components/form/table';
import toast from 'components/form/toast-message-container';
import FeeSetParameterSelector from 'admin/components/fee-set-parameter';

import {
  NUMBER_TYPE,
  isInputEmpty,
  validateNumber,
  setIsInvalidField,
} from 'utils';
import { MESSAGES } from 'admin';
import { createFeeSet } from 'api';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';

const FeeRangeRow = (props) => {
  const { inputs, removeInput } = props;

  return (
    <React.Fragment>
      {inputs.map((input) => (
        <tr key={input}>
          <td className="p-0 pr-1 pt-2 border-0">
            <input
              min="0"
              step="0.01"
              type="number"
              name={`minAmount`}
              className="form-control"
              id={`minAmount-${input}`}
              onKeyDown={(e) => validateNumber(e, NUMBER_TYPE.FLOAT)}
            />
          </td>
          <td className="p-0 pl-1 pr-1 pt-2 border-0">
            <input
              min="0"
              step="0.01"
              type="number"
              name={`maxAmount`}
              className="form-control"
              id={`maxAmount-${input}`}
              onKeyDown={(e) => validateNumber(e, NUMBER_TYPE.FLOAT)}
            />
          </td>
          <td className="p-0 pl-1 pt-2 border-0">
            <input
              min="0"
              step="0.01"
              type="number"
              name={`flatFee`}
              className="form-control"
              onKeyDown={(e) => validateNumber(e, NUMBER_TYPE.FLOAT)}
            />
          </td>

          <td className="p-0 pl-1 pt-2 border-0">
            <input
              min="0"
              step="0.01"
              type="number"
              name={`percentageFee`}
              className="form-control"
              onKeyDown={(e) => validateNumber(e, NUMBER_TYPE.FLOAT)}
            />
          </td>

          {inputs.length > 1 && (
            <td className="pl-3 border-0">
              <p
                className="pt-1 cursor-pointer"
                onClick={() => removeInput(input)}
              >
                <i className="icon ion-md-trash text-danger"></i>
              </p>
            </td>
          )}
        </tr>
      ))}
    </React.Fragment>
  );
};

FeeRangeRow.propTypes = {
  inputs: PropTypes.array,
  removeInput: PropTypes.func,
};

let currentMaxAmount = 0;
let currentInputName = null;
const INPUT = {
  FLAT_FEE: 'flatFee',
  MAX_AMOUNT: 'maxAmount',
  MIN_AMOUNT: 'minAmount',
  PERCENTAGE_FEE: 'percentageFee',
};

class FeeSet extends React.Component {
  state = {
    inputs: [1],
    viewForm: false,
    currency: null,
    payoutMethod: null,
    paymentMethod: null,
    feeRangeValidationError: null,
    sourceDestinationCountry: null,
    isCreatingFeeSet: false,
  };

  updateState = (state, value, callback = null) => {
    return this.setState(
      () => ({
        [state]: value,
      }),
      callback
    );
  };

  setErrorState = (input, errorMessage = MESSAGES.FIELD_CANNOT_BE_EMPTY) => {
    setIsInvalidField(input);
    this.updateState('feeRangeValidationError', errorMessage);

    return false;
  };

  updatePaymentMethod = (paymentMethod) => {
    this.updateState('paymentMethod', paymentMethod, this.updateViewForm);
  };

  updatePayoutMethod = (payoutMethod) => {
    this.updateState('payoutMethod', payoutMethod, this.updateViewForm);
  };

  updateCurrency = (currency) => {
    this.updateState('currency', currency, this.updateViewForm);
  };

  updateSourceDestinationCountry = (sourceDestinationCountry) => {
    this.updateState(
      'sourceDestinationCountry',
      sourceDestinationCountry,
      this.updateViewForm
    );
  };

  updateViewForm = () => {
    const {
      viewForm,
      currency,
      payoutMethod,
      paymentMethod,
      sourceDestinationCountry,
    } = this.state;

    if (currency && paymentMethod && payoutMethod && sourceDestinationCountry) {
      return this.updateState('viewForm', true);
    }

    if (viewForm) {
      return this.updateState('viewForm', false);
    }
  };

  handleOnChange = (e) => {
    e.preventDefault();
    if (this.isMinOrMaxAmount(e.target.name)) {
      this.setCurrentInputName(e.target.name);
    }
  };

  appendInput = (e) => {
    e.preventDefault();

    if (currentInputName === INPUT.MAX_AMOUNT) {
      const { inputs } = this.state;

      inputs.push(inputs[inputs.length - 1] + 1);
      this.updateState('inputs', [...inputs]);
      this.setCurrentInputName(null);
    }
  };

  removeInput = (input) => {
    const { inputs } = this.state;

    const currentInputs = inputs.filter((el) => el !== input);

    this.updateState('inputs', [...currentInputs]);
    this.setCurrentInputName(INPUT.MAX_AMOUNT);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    currentMaxAmount = 0;
    this.updateState('feeRangeValidationError', null);
    const { feeRanges, isFormValid } = this.getValidFeeRange(e.target);

    if (isFormValid) {
      this.saveFeeSet(feeRanges, e.target);
    }
  };

  getValidFeeRange = (inputs) => {
    let input = null,
      feeRange = {},
      isFormValid = true,
      isInputFocused = false;
    const feeRanges = [];

    for (let i = 0; i < inputs.length; i++) {
      input = inputs[i];
      if (input.type === 'number') {
        if (this.handleValidation(input)) {
          feeRange[input.name] = input.value;
          if ((i + 1) % 4 === 0) {
            feeRanges.push(feeRange);
            feeRange = {};
          }
        } else if (input.name && !isInputFocused) {
          input.focus();
          isFormValid = false;
          isInputFocused = true;
          break;
        }
      }
    }

    return { isFormValid, feeRanges };
  };

  handleValidation = (input) => {
    if (this.isMinOrMaxAmount(input.name)) {
      if (
        this.isLessThanCurrentMaxAmount(input) &&
        !this.isInitialMinAmount(input.id)
      ) {
        return this.setErrorState(
          input,
          `Amount must be greater than ${currentMaxAmount}`
        );
      }

      this.getCurrentMaxAmount(input);
    }

    if (isInputEmpty(input)) {
      return this.setErrorState(input, MESSAGES.FIELD_CANNOT_BE_EMPTY);
    }

    return true;
  };

  setCurrentInputName = (inputName) => {
    return (currentInputName = inputName);
  };

  getCurrentMaxAmount = (input) => {
    if (
      this.isMinOrMaxAmount(input.name) &&
      currentMaxAmount < parseFloat(input.value)
    ) {
      currentMaxAmount = parseFloat(input.value);
    }

    return currentMaxAmount;
  };

  isInitialMinAmount = (inputId) => {
    return inputId === 'minAmount-1';
  };

  isLessThanCurrentMaxAmount = (input) => {
    return parseFloat(input.value) <= currentMaxAmount;
  };

  isMinOrMaxAmount = (inputName) => {
    return inputName === INPUT.MIN_AMOUNT || inputName === INPUT.MAX_AMOUNT;
  };

  saveFeeSet = async (feeRanges, inputs) => {
    const feeSet = this.fetchFeeSet(feeRanges);

    this.updateState('isCreatingFeeSet', true);
    const { error } = await createFeeSet(feeSet);

    this.updateState('isCreatingFeeSet', false);

    if (error) {
      return toast.error(MESSAGES.FEE_SET_NOT_CREATED);
    }

    inputs.reset();

    return toast.success(MESSAGES.FEE_SET_CREATED);
  };

  fetchFeeSet = (feeRanges) => {
    const { currency, payoutMethod, paymentMethod, sourceDestinationCountry } =
      this.state;

    return {
      currency,
      payoutMethod,
      paymentMethod,
      sourceDestinationCountry,
      feeRanges,
    };
  };

  render() {
    const { t } = this.props;
    const { inputs, viewForm, isCreatingFeeSet, feeRangeValidationError } =
      this.state;

    const columnNames = [
      t('admin.Min Amount'),
      t('admin.Max Amount'),
      t('admin.Flat Fee'),
      t('admin.Percentage Fee'),
    ];

    if (inputs.length > 1) {
      columnNames.push('');
    }

    return (
      <React.Fragment>
        <FeeSetParameterSelector
          updateCurrency={this.updateCurrency}
          updatePayoutMethod={this.updatePayoutMethod}
          updatePaymentMethod={this.updatePaymentMethod}
          updateSourceDestinationCountry={this.updateSourceDestinationCountry}
        />
        <form
          disabled={isCreatingFeeSet}
          onSubmit={this.handleSubmit}
          onChange={this.handleOnChange}
        >
          {feeRangeValidationError && (
            <div className="col-md-12">
              <div className="alert alert-danger pl-3">
                <i className="icon ion-md-information-circle pl-1"></i>{' '}
                {feeRangeValidationError}
              </div>
            </div>
          )}
          {viewForm && (
            <React.Fragment>
              <div className="pl-3 pr-3 mt-2">
                <Table columnNames={columnNames}>
                  <FeeRangeRow removeInput={this.removeInput} inputs={inputs} />
                </Table>
              </div>

              <div className="col-md-12 pt-3">
                <button
                  disabled={isCreatingFeeSet}
                  onClick={this.appendInput}
                  className="btn btn-default text-primary mr-1"
                >
                  <i className="icon ion-md-add-circle-outline h5"></i>
                </button>
                <button disabled={isCreatingFeeSet} className="btn btn-primary">
                  {isCreatingFeeSet && <WhiteSpinner />}
                  {t('admin.Save New Fee Structure')}
                </button>
              </div>
            </React.Fragment>
          )}
        </form>
      </React.Fragment>
    );
  }
}

FeeSet.propTypes = {
  t: PropTypes.func,
  sourceCountries: PropTypes.array,
  destinationCountries: PropTypes.array,
};

const FeeSetForm = withTranslation()(FeeSet);

export default FeeSetForm;
