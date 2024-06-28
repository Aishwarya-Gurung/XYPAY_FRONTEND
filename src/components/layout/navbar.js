import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';

import { ROUTES } from 'app';
import { getReduxState } from 'utils';
import sl from 'components/selector/selector';

class NavbarComponent extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.currentStep !== nextProps.currentStep;
  }

  render() {
    const {
      t,
      currentStep,
      isKYCVerified,
      isEmailVerified,
      isPhoneVerified,
    } = staticSelector.select(this.props);

    return (
      <div className="container">
        <MobileNavBar
          t={t}
          currentStep={currentStep}
          isKYCVerified={isKYCVerified}
          isEmailVerified={isEmailVerified}
          isPhoneVerified={isPhoneVerified}
        />
        <nav className="train border-bottom d-none d-md-flex">
          <Link
            to={ROUTES.PAYMENT_DETAILS}
            id="paymentDetails"
            className={
              currentStep >= 1
                ? currentStep === 1
                  ? 'active'
                  : 'done'
                : 'disabled'
            }
          >
            <div className="icon-wrapper">
              <i
                className={
                  currentStep > 1 ? 'icon ion-md-checkmark' : 'icon ion-md-cash'
                }
              />
            </div>
            <div className="icon-text">{t('navbar.Payment Details')}</div>
          </Link>

          {!isEmailVerified || !isPhoneVerified || !isKYCVerified ? (
            currentStep >= 2 ? (
              <Link
                to={ROUTES.SENDER_REGISTRATION_ON_FLOW}
                id="senderDetails"
                className={currentStep === 2 ? 'active' : 'done'}
              >
                <div className="icon-wrapper">
                  <i
                    className={
                      currentStep > 2
                        ? 'icon ion-md-checkmark'
                        : 'icon ion-md-person'
                    }
                  />
                </div>
                <div className="icon-text">{t('navbar.Sender Details')}</div>
              </Link>
            ) : (
              <div className="disabled">
                <div className="icon-wrapper">
                  <i className="icon ion-md-person" />
                </div>
                <div className="icon-text">{t('navbar.Sender Details')}</div>
              </div>
            )
          ) : (
            <React.Fragment />
          )}

          {currentStep >= 3 ? (
            <Link
              to={ROUTES.BENEFICIARY_DETAILS}
              id="beneficiaryDetails"
              className={currentStep === 3 ? 'active' : 'done'}
            >
              <div className="icon-wrapper">
                <i
                  className={
                    currentStep > 3
                      ? 'icon ion-md-checkmark'
                      : 'icon ion-md-people'
                  }
                />
              </div>
              <div className="icon-text">{t('navbar.Beneficiary Details')}</div>
            </Link>
          ) : (
            <div className="disabled">
              <div className="icon-wrapper">
                <i className="icon ion-md-people" />
              </div>
              <div className="icon-text">{t('navbar.Beneficiary Details')}</div>
            </div>
          )}

          {currentStep >= 4 ? (
            <Link
              to={ROUTES.PAYMENT_INFORMATION}
              id="paymentInformation"
              className={currentStep === 4 ? 'active' : 'done'}
            >
              <div className="icon-wrapper">
                <i
                  className={
                    currentStep > 4
                      ? 'icon ion-md-checkmark'
                      : 'icon ion-md-card'
                  }
                />
              </div>
              <div className="icon-text">{t('navbar.Payment Information')}</div>
            </Link>
          ) : (
            <div className="disabled">
              <div className="icon-wrapper">
                <i className="icon ion-md-card" />
              </div>
              <div className="icon-text">{t('navbar.Payment Information')}</div>
            </div>
          )}

          {currentStep >= 5 ? (
            <Link
              to={ROUTES.REVIEW_DETAILS}
              id="reviewDetails"
              className={currentStep === 5 ? 'active' : 'done'}
            >
              <div className="icon-wrapper">
                <i
                  className={
                    currentStep > 5
                      ? 'icon ion-md-checkmark'
                      : 'icon ion-md-document'
                  }
                />
              </div>
              <div className="icon-text">{t('navbar.Review Details')}</div>
            </Link>
          ) : (
            <div className="disabled">
              <div className="icon-wrapper">
                <i className="icon ion-md-document" />
              </div>
              <div className="icon-text">{t('navbar.Review Details')}</div>
            </div>
          )}
        </nav>
      </div>
    );
  }
}

NavbarComponent.propTypes = {
  t: PropTypes.func,
  currentStep: PropTypes.number,
  isKYCVerified: PropTypes.bool,
  isEmailVerified: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  currentStep: sl.number(0),
  isKYCVerified: sl.boolean(false),
  isEmailVerified: sl.boolean(false),
  isPhoneVerified: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    isKYCVerified: getReduxState(['auth', 'isKYCVerified'], state),
    isEmailVerified: getReduxState(['auth', 'isEmailVerified'], state),
    isPhoneVerified: getReduxState(['auth', 'isPhoneVerified'], state),
  };
};

const Navbar = connect(mapStateToProps)(withTranslation()(NavbarComponent));

const MobileNavBar = (props) => {
  const {
    t,
    currentStep,
    isKYCVerified,
    isEmailVerified,
    isPhoneVerified,
  } = props;

  return (
    <React.Fragment>
      <div className="step-progressbar d-md-none">
        <Link
          to={ROUTES.PAYMENT_DETAILS}
          className={`step-progressbar__item ${
            currentStep >= 1
              ? currentStep === 1
                ? 'step-active'
                : 'step-complete'
              : 'disabled'
          }`}
        >
          <p>{t('navbar.Payment Details')}</p>
        </Link>
        {!isEmailVerified || !isPhoneVerified || !isKYCVerified ? (
          <Link
            to={ROUTES.SENDER_REGISTRATION_ON_FLOW}
            className={`step-progressbar__item ${
              currentStep >= 2
                ? currentStep === 2
                  ? 'step-active'
                  : 'step-complete'
                : 'disabled'
            }`}
          >
            <p>{t('navbar.Sender Details')}</p>
          </Link>
        ) : (
          <React.Fragment />
        )}

        <Link
          to={ROUTES.BENEFICIARY_DETAILS}
          className={`step-progressbar__item ${
            currentStep >= 3
              ? currentStep === 3
                ? 'step-active'
                : 'step-complete'
              : 'disabled'
          }`}
        >
          <p>{t('navbar.Beneficiary Details')}</p>
        </Link>
        <Link
          to={ROUTES.PAYMENT_INFORMATION}
          className={`step-progressbar__item ${
            currentStep >= 4
              ? currentStep === 4
                ? 'step-active'
                : 'step-complete'
              : 'disabled'
          }`}
        >
          <p>{t('navbar.Payment Information')}</p>
        </Link>
        <Link
          to={ROUTES.REVIEW_DETAILS}
          className={`step-progressbar__item ${
            currentStep >= 5
              ? currentStep === 5
                ? 'step-active'
                : 'step-complete'
              : 'disabled'
          }`}
        >
          <p>{t('navbar.Review Details')}</p>
        </Link>
      </div>
    </React.Fragment>
  );
};

MobileNavBar.propTypes = {
  t: PropTypes.func,
  currentStep: PropTypes.number,
  isKYCVerified: PropTypes.bool,
  isEmailVerified: PropTypes.bool,
  isPhoneVerified: PropTypes.bool,
};

export default Navbar;
