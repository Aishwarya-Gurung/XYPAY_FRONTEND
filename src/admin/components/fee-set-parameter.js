import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import React, { PureComponent, useState, useEffect } from 'react';

import sl from 'components/selector/selector';

import { getIconFor } from 'utils';
import { sourceDestinationCountryMapper } from 'admin';
import { fetchFetchSourceDestinationCountry } from 'api';
import { PAYMENT_METHOD, PAYOUT_METHOD } from 'app';
import useCommittedRef from 'components/hooks/use-committed-ref';
import useOutboundClick from 'components/hooks/use-outbound-click';
import { ErrorMessage } from 'components/form/toast-message-container';

const PAYMENT_METHOD_PARAMETERS = ['BANK_ACCOUNT', 'DEBIT_CARD'];

const getPayoutMethodParameter = (payoutMethod) => {
  const {
    isBankDepositEnabled,
    isCashPickupEnabled,
    isHomeDeliveryEnabled,
    isMobileWalletEnabled,
  } = payoutMethod;
  const PAYOUT_METHOD_PARAMETERS = [];

  if (isMobileWalletEnabled) {
    PAYOUT_METHOD_PARAMETERS.push(PAYOUT_METHOD.getKeyOf(PAYOUT_METHOD.WALLET));
  }

  if (isBankDepositEnabled) {
    PAYOUT_METHOD_PARAMETERS.push(
      PAYOUT_METHOD.getKeyOf(PAYOUT_METHOD.BANK_DEPOSIT)
    );
  }

  if (isCashPickupEnabled) {
    PAYOUT_METHOD_PARAMETERS.push(
      PAYOUT_METHOD.getKeyOf(PAYOUT_METHOD.CASH_PICKUP)
    );
  }

  if (isHomeDeliveryEnabled) {
    PAYOUT_METHOD_PARAMETERS.push(
      PAYOUT_METHOD.getKeyOf(PAYOUT_METHOD.HOME_DELIVERY)
    );
  }

  return PAYOUT_METHOD_PARAMETERS;
};

const SelectedSourceDestination = (props) => {
  const { country } = staticSelector.select(props);

  return (
    <div className="selected-source-destination cursor-pointer">
      <img
        className="mr-1"
        alt={country.source.name}
        src={country.source.flagUrl}
      />
      <span>{country.source.name}</span>
      <i className="icon ion-md-arrow-forward mx-1"></i>
      <img
        className="mr-1"
        alt={country.destination.name}
        src={country.destination.flagUrl}
      />
      <span>{country.destination.name}</span>
    </div>
  );
};

const SourceDestinationCountryList = ({ setCountry, setIsOpen, country }) => (
  <div
    onClick={() => {
      setIsOpen(false);
      setCountry(country);
    }}
    className="p-2 custom-option-list cursor-pointer"
  >
    <img
      className="mr-1"
      alt={country.source.name}
      src={country.source.flagUrl}
    />
    <span>{country.source.name}</span>
    <i className="icon ion-md-arrow-forward mx-1"></i>
    <img
      className="mr-1"
      alt={country.destination.name}
      src={country.destination.flagUrl}
    />
    <span>{country.destination.name}</span>
  </div>
);

const SourceDestinationCountrySelector = ({
  countries,
  updateSourceDestination,
}) => {
  const countryListRef = useCommittedRef();
  const [country, setCountry] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    updateSourceDestination(country);
  }, [country, updateSourceDestination]);

  useOutboundClick(countryListRef, setIsOpen);

  return (
    <div className="col-md-5 form-group pl-0 float-left">
      <div
        onClick={() => setIsOpen(true)}
        className="custom-select cursor-pointer"
      >
        {Object.values(country).length ? (
          <SelectedSourceDestination country={country} />
        ) : (
          <span className="text-muted">Select Source Destination</span>
        )}
      </div>
      {isOpen && (
        <div ref={countryListRef} className="p-0 custom-option">
          {countries.map((c, key) => (
            <SourceDestinationCountryList
              key={key}
              country={c}
              setIsOpen={setIsOpen}
              setCountry={setCountry}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SelectedPaymentPayout = (props) => {
  const { payoutMethod, paymentMethod } = staticSelector.select(props);

  return (
    <div className="selected-source-destination cursor-pointer">
      <i
        className={`icon ion-md-${getIconFor(
          PAYMENT_METHOD[paymentMethod]
        )} mr-1`}
      ></i>
      <span>{PAYMENT_METHOD[paymentMethod]}</span>
      <i className="icon ion-md-arrow-forward mx-1"></i>
      <i
        className={`icon ion-md-${getIconFor(
          PAYOUT_METHOD[payoutMethod]
        )} mr-1`}
      ></i>
      <span>{PAYOUT_METHOD[payoutMethod]}</span>
    </div>
  );
};

const PaymentPayoutMethodList = ({
  setIsOpen,
  payoutMethod,
  paymentMethod,
  setSelectedPayout,
  setSelectedPayment,
}) => (
  <div
    onClick={() => {
      setIsOpen(false);
      setSelectedPayout(payoutMethod);
      setSelectedPayment(paymentMethod);
    }}
    className="p-2 custom-option-list cursor-pointer"
  >
    <i
      className={`icon ion-md-${getIconFor(
        PAYMENT_METHOD[paymentMethod]
      )} mr-1`}
    ></i>
    <span>{PAYMENT_METHOD[paymentMethod]}</span>
    <i className="icon ion-md-arrow-forward mx-1"></i>
    <i
      className={`icon ion-md-${getIconFor(PAYOUT_METHOD[payoutMethod])} mr-1`}
    ></i>
    <span>{PAYOUT_METHOD[payoutMethod]}</span>
  </div>
);

const PaymentPayoutSelector = (props) => {
  const paymentPayoutRef = useCommittedRef();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const { updatePayoutMethod, updatePaymentMethod, country } =
    staticSelector.select(props);

  const { payoutMethod } = country.destination;
  const PAYOUT_METHOD_PARAMETERS = getPayoutMethodParameter(payoutMethod);

  useEffect(() => {
    updatePayoutMethod(selectedPayout);
    updatePaymentMethod(selectedPayment);
  }, [
    selectedPayout,
    selectedPayment,
    updatePayoutMethod,
    updatePaymentMethod,
  ]);

  useEffect(() => {
    setSelectedPayment('');
    setSelectedPayout('');
  }, [props]);

  useOutboundClick(paymentPayoutRef, setIsOpen);

  return (
    <div className="col-md-5 form-group pl-0 float-left">
      <div
        onClick={() => setIsOpen(true)}
        className="custom-select cursor-pointer"
      >
        {selectedPayment && selectedPayout ? (
          <SelectedPaymentPayout
            payoutMethod={selectedPayout}
            paymentMethod={selectedPayment}
          />
        ) : (
          <span className="text-muted">Select Payment Payout</span>
        )}
      </div>
      {isOpen && (
        <div ref={paymentPayoutRef} className="col-12 p-0 custom-option">
          {PAYMENT_METHOD_PARAMETERS.map((paymentMethod) =>
            PAYOUT_METHOD_PARAMETERS.map((payoutMethod, key) => (
              <PaymentPayoutMethodList
                key={key}
                setIsOpen={setIsOpen}
                payoutMethod={payoutMethod}
                paymentMethod={paymentMethod}
                setSelectedPayout={setSelectedPayout}
                setSelectedPayment={setSelectedPayment}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const PaymentCurrency = (props) => {
  const currencyRef = useCommittedRef();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setCurrency] = useState('');
  const { country, updateCurrency } = staticSelector.select(props);
  const currencies = country.destination.currency.map(
    (currency) => currency.code
  );

  useEffect(() => {
    updateCurrency(selectedCurrency);
  }, [selectedCurrency, updateCurrency]);

  useEffect(() => {
    setCurrency('');
  }, [props]);

  useOutboundClick(currencyRef, setIsOpen);

  return (
    <div className="col-md-2 form-group pl-0 pr-md-0 float-left">
      <div
        onClick={() => setIsOpen(true)}
        className="custom-select cursor-pointer"
      >
        {selectedCurrency ? (
          <span>
            <i className="icon ion-md-cash"></i> {selectedCurrency}
          </span>
        ) : (
          <span className="text-muted">Currency</span>
        )}
      </div>
      {isOpen && (
        <div ref={currencyRef} className="col-12 p-0 custom-option">
          {currencies
            .filter((currency) => currency !== '')
            .map((currency, key) => (
              <div
                key={key}
                onClick={() => {
                  setIsOpen(false);
                  setCurrency(currency);
                }}
                className="p-2 custom-option-list cursor-pointer"
              >
                <i className="icon ion-md-cash"></i> {currency}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

class FeeSetParameter extends PureComponent {
  state = {
    sourceDestinationCountry: [],
    selectedSourceDestination: {},
  };

  componentDidMount = () => {
    fetchFetchSourceDestinationCountry().then(({ data, error }) => {
      if (error) {
        toast.error(<ErrorMessage message={error.message} />);
      }

      const { result } = sourceDestinationCountryMapper.select(data);

      this.updateState('sourceDestinationCountry', result);
    });
  };

  updateState = (stateName, data) => {
    this.setState(() => ({
      [stateName]: data,
    }));
  };

  updateSourceDestination = (country) => {
    const { updateSourceDestinationCountry } = staticSelector.select(
      this.props
    );

    this.updateState('selectedSourceDestination', country);
    updateSourceDestinationCountry(country.id);
  };

  render() {
    const {
      updateCurrency,
      updatePayoutMethod,
      updatePaymentMethod,
      updateSourceDestinationCountry,
    } = staticSelector.select(this.props);
    const { sourceDestinationCountry, selectedSourceDestination } = this.state;

    return (
      <div className="col-md-12 clearfix">
        <SourceDestinationCountrySelector
          countries={sourceDestinationCountry}
          updateSourceDestination={this.updateSourceDestination}
          updateSourceDestinationCountry={updateSourceDestinationCountry}
        />
        <PaymentPayoutSelector
          country={selectedSourceDestination}
          updatePayoutMethod={updatePayoutMethod}
          updatePaymentMethod={updatePaymentMethod}
        />
        <PaymentCurrency
          updateCurrency={updateCurrency}
          country={selectedSourceDestination}
        />
      </div>
    );
  }
}

FeeSetParameter.propTypes = {
  t: PropTypes.func,
};

SelectedSourceDestination.propTypes = {
  country: PropTypes.object,
};

SourceDestinationCountryList.propTypes = {
  country: PropTypes.object,
  setIsOpen: PropTypes.func,
  setCountry: PropTypes.func,
};

SourceDestinationCountrySelector.propTypes = {
  countries: PropTypes.array,
  updateSourceDestination: PropTypes.func,
};

PaymentPayoutMethodList.propTypes = {
  setIsOpen: PropTypes.func,
  payoutMethod: PropTypes.string,
  paymentMethod: PropTypes.string,
  setSelectedPayout: PropTypes.func,
  setSelectedPayment: PropTypes.func,
  updateCurrency: PropTypes.func,
  updatePayoutMethod: PropTypes.func,
  updatePaymentMethod: PropTypes.func,
  updateSourceDestinationCountry: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  payoutMethod: sl.string(),
  paymentMethod: sl.string(),
  country: sl.object({
    id: sl.number(0),
    source: sl.object({
      name: sl.string(''),
      threeCharCode: sl.string(''),
      twoCharCode: sl.string(''),
      phoneCode: sl.string(''),
      flagUrl: sl.string(''),
      currency: sl.list(
        sl.object({
          name: sl.string(''),
          code: sl.string(''),
          symbol: sl.string(''),
        })
      ),
    }),
    destination: sl.object({
      name: sl.string(''),
      threeCharCode: sl.string(''),
      twoCharCode: sl.string(''),
      phoneCode: sl.string(''),
      flagUrl: sl.string(''),
      currency: sl.list(
        sl.object({
          name: sl.string(''),
          code: sl.string(''),
          symbol: sl.string(''),
        })
      ),
      payoutMethod: sl.object({
        isBankDepositEnabled: sl.boolean(false),
        isCashPickupEnabled: sl.boolean(false),
        isHomeDeliveryEnabled: sl.boolean(false),
        isMobileWalletEnabled: sl.boolean(false),
      }),
    }),
  }),
  updateCurrency: sl.func(),
  updatePayoutMethod: sl.func(),
  updatePaymentMethod: sl.func(),
  updateSourceDestinationCountry: sl.func(),
});

const FeeSetParameterSelector = withTranslation()(FeeSetParameter);

export default FeeSetParameterSelector;
