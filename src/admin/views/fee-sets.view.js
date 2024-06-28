import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';

import { fetchFeeSet } from 'api';
import { ADMIN_MENU, feeSetMapper } from 'admin';
import { PAGE, PAYMENT_METHOD, PAYOUT_METHOD, ROUTES } from 'app';

import Table from 'components/form/table';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';
import BlinkTextLoader from 'components/form/blink-loader-text';
import { ErrorMessage } from 'components/form/toast-message-container';

class FeeSet extends PureComponent {
  state = {
    active: [],
    feeSets: [],
    loading: false,
  };

  updateState = (state, value, callback = null) => {
    return this.setState(
      () => ({
        [state]: value,
      }),
      callback
    );
  };

  componentDidMount = async () => {
    this.setState({ loading: true });

    const { data, error } = await fetchFeeSet();

    if (error) {
      this.setState({ loading: false });

      return toast.error(<ErrorMessage message="error" />);
    }

    const { result } = feeSetMapper.select(data);

    const feeSets = result.reduce((accumulator, currentValue) => {
      accumulator[currentValue.destinationCountry.threeCharCode] =
        accumulator[currentValue.destinationCountry.threeCharCode] || [];
      accumulator[currentValue.destinationCountry.threeCharCode].push(
        currentValue
      );

      return accumulator;
    }, {});

    this.updateState('feeSets', feeSets);
    this.setState({ loading: false });
  };

  toggleFeesSetTable = (key) => {
    this.setState((state) => {
      if (state.active.includes(key)) {
        const active = state.active.filter((active) => active !== key);

        return {
          active: [...active],
        };
      }

      return {
        active: [...state.active, key],
      };
    });
  };

  render() {
    const { feeSets, active, loading } = this.state;
    const { t } = staticSelector.select(this.props);

    const columnNames = [
      t('admin.Payment Method'),
      t('admin.Payout Method'),
      t('admin.Currency'),
      t('admin.Min Amount'),
      t('admin.Max Amount'),
      t('admin.Flat Fee'),
      t('admin.Percentage Fee'),
    ];

    return (
      <AccountLayout>
        <PageHead title={PAGE.FEE} />
        <SidebarMenu menus={ADMIN_MENU} activeTab={ADMIN_MENU.FEE_SET} />
        <div className="col-md-9">
          <div className="col-md-12 p-0 mb-2 clearfix">
            <h4 className="bold mb-3 text-primary float-left">
              <i className="icon ion-md-cash mr-1"></i> {t('admin.Fee Set')}
            </h4>
          </div>
          <div className="col-md-12 m-0 p-0">
            <div className="border rounded py-4 px-2">
              <div className="col-md-12 m-0 p-0">
                <div className="mx-3 alert alert-info d-flex justify-content-between">
                  <p className="m-0 lead">
                    <i className="icon ion-md-information-circle mr-2" />
                    Current active Fee Sets
                  </p>
                  <Link
                    to={ROUTES.ADD_FEE_SET}
                    className="btn btn-sm btn-green text-center float-right"
                  >
                    <i className="icon ion-md-add-circle-outline mr-2" />
                    {t('admin.Add Fee Set')}
                  </Link>
                </div>

                {loading && (
                  <BlinkTextLoader
                    message={t('admin.Fetching current fee sets')}
                  />
                )}

                {Object.keys(feeSets).length > 0 && (
                  <div className="px-3 mt-2">
                    {Object.keys(feeSets).map((key, index) => (
                      <div
                        key={index}
                        className="border rounded cursor-pointer mb-3"
                      >
                        <div
                          onClick={() => this.toggleFeesSetTable(key)}
                          className="custom-option-list d-flex justify-content-between p-2"
                        >
                          <SourceDestinationCountry feeSet={feeSets[key][0]} />
                          <i
                            className={`icon ion-ios-arrow-${
                              active.includes(key) ? 'up' : 'down'
                            } p-1`}
                          />
                        </div>

                        <div className={active.includes(key) ? '' : 'hide'}>
                          <Table columnNames={columnNames}>
                            {feeSets[key].map((fees, key) => (
                              <React.Fragment key={key}>
                                <FeeSetRow fees={fees} />
                              </React.Fragment>
                            ))}
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AccountLayout>
    );
  }
}

const SourceDestinationCountry = ({ feeSet }) => {
  return (
    <div className="p-1">
      <img
        className="mr-2"
        alt={feeSet.sourceCountry.name}
        src={feeSet.sourceCountry.flagUrl}
      />
      {feeSet.sourceCountry.name}
      <i className="icon ion-md-arrow-forward px-3" />
      <img
        className="mr-2"
        alt={feeSet.destinationCountry.name}
        src={feeSet.destinationCountry.flagUrl}
      />
      {feeSet.destinationCountry.name}
    </div>
  );
};

const currentFeeParam = {
  currency: null,
  payoutMethod: null,
  PaymentMethod: null,

  setCurrentFeeParam: function (feeSet) {
    this.currency = feeSet.currency;
    this.payoutMethod = feeSet.payoutMethod;
    this.paymentMethod = feeSet.paymentMethod;
  },

  isPreviousFeeParam: function (feeSet) {
    return (
      this.currency === feeSet.currency &&
      this.paymentMethod === feeSet.paymentMethod &&
      this.payoutMethod === feeSet.payoutMethod
    );
  },
};

const FeeSetRow = ({ fees }) => {
  return (
    <React.Fragment>
      {fees.feeRanges.map((feeRange, key) => (
        <tr key={key}>
          {!currentFeeParam.isPreviousFeeParam(fees) && (
            <React.Fragment>
              {currentFeeParam.setCurrentFeeParam(fees)}
              <td rowSpan={fees.feeRanges.length}>
                {PAYMENT_METHOD[fees.paymentMethod]}
              </td>
              <td rowSpan={fees.feeRanges.length}>
                {PAYOUT_METHOD[fees.payoutMethod]}
              </td>
              <td rowSpan={fees.feeRanges.length}>{fees.currency}</td>
            </React.Fragment>
          )}

          <td>
            ${feeRange.minAmount}
            <span className="bold text-muted"> USD</span>
          </td>
          <td>
            ${feeRange.maxAmount}
            <span className="bold text-muted"> USD</span>
          </td>
          <td>
            ${feeRange.flatFee}
            <span className="bold text-muted"> USD</span>
          </td>
          <td>
            {feeRange.percentageFee}
            <span className="bold text-muted">%</span>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

FeeSet.propTypes = {
  t: PropTypes.func,
};

FeeSetRow.propTypes = {
  fees: PropTypes.object,
};

SourceDestinationCountry.propTypes = {
  feeSet: PropTypes.object,
};

const staticSelector = sl.object({
  t: sl.func(),
});

export const FeeSetView = withTranslation()(FeeSet);
