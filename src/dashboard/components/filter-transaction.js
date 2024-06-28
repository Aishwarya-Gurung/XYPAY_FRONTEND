import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TRANSACTION_STATUS, DELIVERY_STATUS } from 'dashboard';

const FilterTransaction = (props) => {
  const { t } = useTranslation();
  const { setFilter } = props;

  return (
    <React.Fragment>
      <div className="col-md-6 col-lg-3 col-4">
        <select
          className="custom-select custom-select-sm"
          name="transStatus"
          onChange={setFilter}
        >
          <option value={''}>
            {t('dashboard.Transaction Status(default)')}
          </option>
          {Object.values(TRANSACTION_STATUS).map((transactionStatus, key) => {
            return (
              <option value={transactionStatus} key={key}>
                {transactionStatus}
              </option>
            );
          })}
        </select>
      </div>
      <div className="col-md-4 col-lg-3 col-4">
        <select
          className="custom-select custom-select-sm"
          name="deliveryStatus"
          onChange={setFilter}
        >
          <option value={''}>{t('dashboard.Delivery Status(default)')}</option>
          {Object.values(DELIVERY_STATUS).map((deliveryStatus, key) => {
            return (
              <option value={deliveryStatus} key={key}>
                {deliveryStatus}
              </option>
            );
          })}
        </select>
      </div>
    </React.Fragment>
  );
};

FilterTransaction.propTypes = {
  setFilter: PropTypes.func,
};

export default FilterTransaction;
