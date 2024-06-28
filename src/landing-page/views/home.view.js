import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { PureComponent } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

import PopupAlert from 'components/form/popup-alert';
import { PageHead } from 'components/layout/page-head';

import { PAGE, ROUTES } from 'app';
import HomeCalculator from 'payment/components/home-calculator';

const Feature = () => {
  const { t } = useTranslation();

  return (
    <div className="feature">
      <div className="container">
        <div className="col-md-12  pt-5">
          <h3 className="bold slogon text-center mt-5 pt-4 mb-0">
            {t('home.What makes XYPAY special?')}
          </h3>
          <p className="text-muted text-center mb-4 mt-2">
            {t('home.Send money safely and quickly with XYPAY')}
          </p>
          <div className=" p-0 row ">
            <div className="col-md-3">
              <div className="feature-icon">
                <i className="icon ion-ios-rocket" />
              </div>
              <p className="bold text-center text-muted">
                {t('home.Instant Transfer')}
                <small className="feature-desc  mt-1 small-text">
                  {t(
                    'home.Transfer money to your recipient instantly with desired payment methods'
                  )}
                </small>
              </p>
            </div>
            <div className="col-md-3">
              <div className="feature-icon">
                <i className="icon ion-md-business" />
              </div>
              <p className="bold text-center text-muted">
                {t('home.Multiple Payout Methods')}
                <small className="feature-desc   mt-1 small-text">
                  {t(
                    'home.Deposit money to your recipient bank account or mobile money account'
                  )}
                </small>
              </p>
            </div>
            <div className="col-md-3">
              <div className="feature-icon">
                <i className="icon ion-md-cash" />
              </div>
              <p className="bold text-center text-muted">
                {t('home.Best Exchange Rates')}
                <small className="feature-desc mt-1 small-text">
                  {t(
                    'home.We offer you the best exchange rate for every transaction'
                  )}
                </small>
              </p>
            </div>

            <div className="col-md-3">
              <div className="feature-icon">
                <i className="icon ion-md-ribbon" />
              </div>
              <p className="bold text-center text-muted">
                {t('home.Safe and legal')}
                <small className="feature-desc mt-1 small-text">
                  {t(
                    'home.Transfer money safely and securely through our system'
                  )}
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Promotion = () => {
  const { t } = useTranslation();

  return (
    <div className="text-normal mt-5 pt-5">
      <h2 className="col-md-9 bold p-0 mt-3 slogon">
        {' '}
        Fast and Secure Money Transfers Anywhere
        <i className="icon ion-md-paper-plane ml-1"></i>
      </h2>
      <p
        className="col-md-9 text-muted  text-justify p-0 mt-3"
        style={{ fontSize: '18px' }}
      >
        Our platform is designed to simplify your life. Join XYPAY today and
        experience immediate, rapid, and secure money transfer solutions.
      </p>
      <Link
        to={ROUTES.PAYMENT_DETAILS}
        className="btn btn-lg btn-green btn-green mt-4 mr-2"
      >
        {t('button.Send Now')}
      </Link>
      <Link
        to={ROUTES.SENDER_SIGN_UP}
        className="btn btn-lg btn-outline-green mt-4"
      >
        {t('button.Get Started')}
        <i className="icon ion-md-arrow-forward ml-2"></i>
      </Link>
    </div>
  );
};

const Steps = () => {
  const { t } = useTranslation();

  return (
    <div className="steps">
      <div className="container p-0 p-md-5">
        <div className="row m-0 clearfix mb-4">
          <div className="col-md-12 mt-0 mt-md-3">
            <h3 className="text-center pt-5 m-0 mt-5 section-title">
              {t('home.Easy steps to send')}
            </h3>
            <p className="text-center text-muted m-0 mb-5">
              {t(
                'home.You can send money anywhere with following four easy steps'
              )}
            </p>
          </div>
          <div className="col-md-3">
            <div className="step-box">
              <div className="step-count">
                <p className="m-0 p-0">{t('home.STEP')}</p>
                <h1 className="bold m-0">01</h1>
                <span className="arrow-down"></span>
              </div>
              <div className="step-icon mt-4">
                <i className="icon ion-ios-cash" />
              </div>
              <p className="text-center bold text-muted m-1 mt-3">
                {t('home.Enter send amount')}
              </p>
              <p className="text-muted text-center small">
                {t(
                  'home.Enter the send amount and calculate with exchange rate'
                )}
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="step-box">
              <div className="step-count">
                <p className="m-0 p-0">{t('home.STEP')}</p>
                <h1 className="bold m-0">02</h1>
                <span className="arrow-down"></span>
              </div>
              <div className="step-icon mt-4">
                <i className="icon ion-md-person" />
              </div>
              <p className="text-center bold text-muted m-1 mt-3">
                {t('home.Select recipient')}
              </p>
              <p className="text-muted text-center small">
                {t('home.Select existing recipient or add a new recipient')}
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="step-box">
              <div className="step-count">
                <p className="m-0 p-0">{t('home.STEP')}</p>
                <h1 className="bold m-0">03</h1>
                <span className="arrow-down"></span>
              </div>
              <div className="step-icon mt-4">
                <i className="icon ion-md-card" />
              </div>
              <p className="text-center bold text-muted m-1 mt-3">
                {t('home.Choose payment method')}
              </p>
              <p className="text-muted text-center small">
                {t('home.Choose the desired payment method')}
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="step-box">
              <div className="step-count">
                <p className="m-0 p-0">{t('home.STEP')}</p>
                <h1 className="bold m-0">04</h1>
                <span className="arrow-down"></span>
              </div>
              <div className="step-icon mt-4">
                <i className="icon ion-md-document" />
              </div>
              <p className="text-center bold text-muted m-1 mt-3">
                {t('home.Review & confirm')}
              </p>
              <p className="text-muted text-center small">
                {t('home.Review the payment details and send the money')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section className="container mt-5 mb-5 pt-4">
      <div className="col-md-12">
        <h3 className="bold text-primary text-center mb-2">
          {t('home.XYPAY Support')}
        </h3>
        <p className="text-muted text-center col-md-6 m-auto mb-4">
          {t(
            'home.The XYPAY Support Center is here to assist you with any inquiries or questions you may have regarding our services We are dedicated to providing comprehensive support and guidance'
          )}
        </p>
        <div className="text-center">
          <a href="tel:9812344096" className="btn btn-md btn-outline-green m-3">
            <i className="icon ion-md-call"></i> {t('button.CALL US')}
          </a>
          <a
            href="mailto:XYPAY@mailinator.com"
            className="btn btn-md btn-outline-green m-3"
          >
            <i className="icon ion-md-mail"></i> {t('button.EMAIL US')}
          </a>
        </div>
      </div>
    </section>
  );
};

class Home extends PureComponent {
  handleSend = () => {
    this.props.history.push(ROUTES.PAYMENT_DETAILS);
  };

  render() {
    const message = this.props.location.message || null;

    return (
      <div className="cityscape pb-3">
        <PageHead title={PAGE.HOME} />
        <section className="container">
          <div className="row m-0">
            <div className="col-md-7 float-left p-0">
              <Promotion />
            </div>
            <div className="col-md-5 float-right p-0 p-md-4 mt-4">
              <HomeCalculator />
            </div>
          </div>
        </section>

        <Steps />
        <Feature />
        <Contact />
        <PopupAlert
          message={message}
          className={'success'}
          alert={message ? true : false}
        />
      </div>
    );
  }
}

Home.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  countries: PropTypes.array,
  isSendButtonDisabled: PropTypes.bool,
};

export default withTranslation()(Home);
