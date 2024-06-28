import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import { DashboardLoadingSpinner } from 'components/form/loading-container';

const TransactionGlance = (props) => {
  const { t } = useTranslation();
  const { totalSent, isDataFetching, totalTransactions, totalBeneficiaries } =
    staticSelector.select(props);

  return (
    <div className="col-md-12 p-0">
      <div className=" text-center stats h-100">
        <div className="row align-items-center p-4">
          {!isDataFetching ? (
            <React.Fragment>
              <div className="col border-right p-2">
                <p className="h1">
                  <i className="icon ion-md-card text-muted" />{' '}
                  {totalTransactions}
                </p>
                <span className="text-muted">
                  {t('dashboard.Transactions')}
                </span>
              </div>
              <div className="col p-2">
                <p className="h1">
                  <i className="icon ion-md-people text-muted mr-2" />
                  {totalBeneficiaries}
                </p>
                <span className="text-muted">
                  {t('dashboard.Beneficiaries')}
                </span>
              </div>
            </React.Fragment>
          ) : (
            <div className="mt-5 pb-2 mb-4">
              <DashboardLoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TransactionGlance.propTypes = {
  totalSent: PropTypes.string,
  isDataFetching: PropTypes.bool,
  totalTransactions: PropTypes.number,
  totalBeneficiaries: PropTypes.number,
};

const staticSelector = sl.object({
  totalSent: sl.string('0'),
  isDataFetching: sl.boolean(),
  totalTransactions: sl.number(0),
  totalBeneficiaries: sl.number(0),
});

export default TransactionGlance;
