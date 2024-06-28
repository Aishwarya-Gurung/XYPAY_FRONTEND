import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { withTranslation } from 'react-i18next';

import { ROUTES } from 'app';
import sl from 'components/selector/selector';
import { isCurrentPath } from 'utils/routes-helper';
import { securedLS, getReduxState, validateAlphabet } from 'utils';
import { getDestinationCountry, saveSelectedCountry } from 'landing-page';

const SuggestionsList = ({
  selectCountry,
  activeSuggestion,
  filteredSuggestions,
}) => (
  <ul className="country-suggestions list-group list-group-flush border">
    {filteredSuggestions.map((suggestion, index) => {
      let className = 'list-group-item list-group-item-action';

      if (index === activeSuggestion) {
        className = 'suggestion-active list-group-item list-group-item-action';
      }

      return (
        <li key={index} className={className} onMouseDown={selectCountry}>
          {suggestion.name}
          <img
            height="15"
            alt="flag-icon"
            className="float-right"
            src={suggestion.flagUrl}
          />
        </li>
      );
    })}
  </ul>
);

class BeneficiaryCountry extends Component {
  state = {
    userInput: '',
    activeSuggestion: 0,
    showSuggestions: false,
    filteredSuggestions: [],
    selectedCountryFlag: '',
  };

  country = React.createRef();

  componentDidMount = () => {
    const {
      countries,
      selectedCountry,
      updateTempCountry,
      getDestinationCountry,
    } = staticSelector.select(this.props);

    if (!countries.length) {
      getDestinationCountry();
    }

    // temp country to ignore autofill
    updateTempCountry(selectedCountry.name);

    this.setState({
      userInput: selectedCountry.name,
      selectedCountryFlag: selectedCountry.flagUrl,
    });
  };

  componentDidUpdate(prevProps) {
    this.autoSelectDestinationCountry();

    if (prevProps.isSigningOut !== this.props.isSigningOut) {
      this.setState({
        userInput: '',
        activeSuggestion: 0,
        showSuggestions: false,
        filteredSuggestions: [],
        selectedCountryFlag: '',
      });
    }
  }

  autoSelectDestinationCountry = () => {
    const { countries, selectedCountry } = staticSelector.select(this.props);

    if (countries.length === 1 && !selectedCountry.name) {
      this.setBeneficiaryCountry(countries[0].name);
      this.setState(() => ({
        userInput: countries[0].name,
        selectedCountryFlag: countries[0].flagUrl,
      }));
    }
  };

  updateOnChange = (e) => {
    const userInput = e.target.value;
    const { countries, updateTempCountry } = staticSelector.select(this.props);
    const filteredSuggestions = countries.filter(
      (country) =>
        country.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    // Update temp country to ignore autofill
    updateTempCountry(userInput);

    this.setState(() => {
      return {
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: true,
        selectedCountryFlag: '',
        userInput,
      };
    });
  };

  showDropDown = () => {
    const { countries } = staticSelector.select(this.props);

    this.setState(() => {
      return {
        filteredSuggestions: countries,
        showSuggestions: true,
      };
    });
  };

  hideDropDown = () => {
    setTimeout(() => {
      this.setState(() => {
        return {
          filteredSuggestions: [],
          showSuggestions: false,
        };
      });
    }, 200);
  };

  showSuggestionList = (e) => {
    const { countries, handleValidation } = staticSelector.select(this.props);
    const selectedCountryFlag = countries.find((country) => {
      return country.name === e.currentTarget.innerText;
    }).flagUrl;

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
      selectedCountryFlag: selectedCountryFlag,
    });

    this.country.current.value = e.currentTarget.innerText;
    handleValidation(this.country.current);

    return this.setBeneficiaryCountry(e.currentTarget.innerText);
  };

  setBeneficiaryCountry = async (countryName) => {
    const {
      countries,
      updateTempCountry,
      saveSelectedCountry,
      calculateSendingAmount,
    } = staticSelector.select(this.props);
    const selectedCountry = countries.find((country) =>
      country.name === countryName ? country : null
    );

    // temp country to ignore autofill
    updateTempCountry(countryName);

    if (await saveSelectedCountry(selectedCountry)) {
      securedLS.set('selectedCountry', selectedCountry);

      return calculateSendingAmount();
    }
  };

  isRedirectedFromProfile = () => {
    return isCurrentPath(ROUTES.NEW_BENEFICIARY);
  };

  render() {
    const {
      updateOnChange,
      showDropDown,
      hideDropDown,
      showSuggestionList,
      isRedirectedFromProfile,
      state: {
        userInput,
        showSuggestions,
        activeSuggestion,
        filteredSuggestions,
        selectedCountryFlag,
      },
    } = this;

    let suggestionsListComponent;
    const { t } = staticSelector.select(this.props);

    if (showSuggestions) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <SuggestionsList
            selectCountry={showSuggestionList}
            activeSuggestion={activeSuggestion}
            filteredSuggestions={filteredSuggestions}
          />
        );
      } else {
        suggestionsListComponent = (
          <ul className="country-suggestions list-group list-group-flush border">
            <li className="list-group-item list-group-item-action">
              {t('home.Country not found!')}
            </li>
          </ul>
        );
      }
    }

    return (
      <Fragment>
        <div className="input-holder m-0 pr-0">
          {!isRedirectedFromProfile() && (
            <label className="small text-muted">
              {t('home.Send money to')}
            </label>
          )}
          <input
            type="text"
            name="country"
            autoComplete="off"
            value={userInput}
            ref={this.country}
            onBlur={hideDropDown}
            onClick={showDropDown}
            onChange={updateOnChange}
            onKeyPress={validateAlphabet}
            id="autocomplete-input"
            placeholder={t('home.Enter country name')}
          />
          <label className="text-danger small">
            {t('payment.Please select a country to send money to')}
          </label>
          {suggestionsListComponent}
        </div>
        {selectedCountryFlag && (
          <div className="flag-bearer d-flex align-items-center mr-2">
            <img src={selectedCountryFlag} height="20" alt="flag-icon" />
          </div>
        )}
      </Fragment>
    );
  }
}

SuggestionsList.propTypes = {
  selectCountry: PropTypes.func,
  activeSuggestion: PropTypes.number,
  filteredSuggestions: PropTypes.array,
};

BeneficiaryCountry.propTypes = {
  t: PropTypes.func,
  countries: PropTypes.array,
  isSigningOut: PropTypes.bool,
  handleValidation: PropTypes.func,
  selectedCountry: PropTypes.object,
  getDestinationCountry: PropTypes.func,
  saveSelectedCountry: PropTypes.func,
  calculateSendingAmount: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  countries: sl.list(
    sl.object({
      flagUrl: sl.string(''),
      name: sl.string(''),
      phoneCode: sl.string(''),
      twoCharCode: sl.string(''),
      threeCharCode: sl.string(''),
      currency: sl.list(
        sl.object({
          name: sl.string(''),
          code: sl.string(''),
          symbol: sl.string(''),
        })
      ),
      payoutMethod: sl.object({
        isCashPickupEnabled: sl.boolean(false),
        isBankDepositEnabled: sl.boolean(false),
        isMobileWalletEnabled: sl.boolean(false),
        isHomeDeliveryEnabled: sl.boolean(false),
      }),
    })
  ),
  selectedCountry: sl.object({
    flagUrl: sl.string(''),
    name: sl.string(''),
    phoneCode: sl.string(''),
    twoCharCode: sl.string(''),
    threeCharCode: sl.string(''),
    currency: sl.list(
      sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      })
    ),
    payoutMethod: sl.object({
      isCashPickupEnabled: sl.boolean(false),
      isBankDepositEnabled: sl.boolean(false),
      isMobileWalletEnabled: sl.boolean(false),
      isHomeDeliveryEnabled: sl.boolean(false),
    }),
  }),
  isSigningOut: sl.boolean(),
  getDestinationCountry: sl.func(),
  saveSelectedCountry: sl.func(),
  handleValidation: sl.func(function () {
    return;
  }),
  updateTempCountry: sl.func(function () {
    return;
  }),
  calculateSendingAmount: sl.func(function () {
    return;
  }),
});

const mapStateToProps = (state) => {
  return {
    selectedCountry: getReduxState(['home', 'selectedCountry'], state),
    isSigningOut: getReduxState(['auth', 'isSigningOut'], state),
    isSendButtonDisabled: getReduxState(
      ['home', 'isSendButtonDisabled'],
      state
    ),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getDestinationCountry,
      saveSelectedCountry,
    },
    dispatch
  );

const BeneficiaryCountrySelector = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(BeneficiaryCountry)
);

export default BeneficiaryCountrySelector;
