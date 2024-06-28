import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';
import BlinkTextLoader from 'components/form/blink-loader-text';
import { getBeneficiaryList, fetchBeneficiaryStates } from 'beneficiary';
import BeneficiaryDetailList from 'beneficiary/components/beneficiary-detail-list';

import { PAGE, ROUTES } from 'app';
import { ACCOUNT_MENU } from 'sender';
import { getDestinationCountry } from 'landing-page';
import { getReduxState } from 'utils';

class BeneficiaryList extends PureComponent {
  state = {
    isModalOpen: false,
  };

  componentDidMount = () => {
    const { getDestinationCountry, getBeneficiaryList } = staticSelector.select(
      this.props
    );

    getDestinationCountry();

    return getBeneficiaryList();
  };

  toggleModal = (status) => {
    return this.setState(() => {
      return {
        isModalOpen: status,
      };
    });
  };

  render() {
    const {
      t,
      kycStatus,
      beneficiaries,
      getBeneficiaryList,
      fetchBeneficiaryStates,
      isAccountDeleteRequested,
      isFetchingBeneficiaryList,
    } = staticSelector.select(this.props);

    return (
      <AccountLayout>
        <PageHead title={PAGE.BENEFICIARY_LIST} />
        <SidebarMenu
          menus={ACCOUNT_MENU}
          activeTab={ACCOUNT_MENU.BENEFICIARY}
        />
        <div className="col-md-9 p-0">
          <div className="col-md-12 p-0 float-left">
            <div className="col-md-12 mb-2 clearfix">
              <h4 className="bold text-primary float-left">
                <i className="icon ion-md-contacts"></i>{' '}
                {t('beneficiary.Beneficiary')}
              </h4>

              <Link
                to={ROUTES.NEW_BENEFICIARY}
                className={`btn btn-sm btn-green text-center float-right ${
                  isAccountDeleteRequested && 'disabled'
                }`}
              >
                <i className="icon ion-md-add-circle-outline"></i>{' '}
                {t('beneficiary.Add Beneficiary')}
              </Link>
            </div>

            {isFetchingBeneficiaryList ? (
              <div className="col-md-12">
                <BlinkTextLoader
                  margin={20}
                  align="left"
                  message={t(
                    'beneficiary.Loading your beneficiary details Please wait'
                  )}
                />
              </div>
            ) : (
              <React.Fragment>
                {!beneficiaries.length ? (
                  <div className="mr-3 ml-3 alert alert-warning">
                    <i className="icon ion-md-information-circle-outline"></i>{' '}
                    {t('beneficiary.There is no any beneficiary added yet')}
                  </div>
                ) : (
                  <BeneficiaryDetailList
                    beneficiaries={beneficiaries}
                    getBeneficiaryList={getBeneficiaryList}
                    fetchBeneficiaryStates={fetchBeneficiaryStates}
                  />
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </AccountLayout>
    );
  }
}

BeneficiaryList.propTypes = {
  t: PropTypes.func,
  kycStatus: PropTypes.string,
  beneficiaries: PropTypes.array,
  getDestinationCountry: PropTypes.func,
  getBeneficiaryList: PropTypes.func,
  fetchBeneficiaryStates: PropTypes.func,
  isFetchingBeneficiaryList: PropTypes.bool,
  isAccountDeleteRequested: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  kycStatus: sl.string(''),
  getDestinationCountry: sl.func(),
  fetchBeneficiaryStates: sl.func(),
  getBeneficiaryList: sl.func(),
  beneficiaries: sl.list(
    sl.object({
      firstName: sl.string(''),
      middleName: sl.string(''),
      lastName: sl.string(''),
      email: sl.string(''),
      fullName: sl.string(''),
      referenceId: sl.string(''),
      phoneNumber: sl.string(''),
      dateOfBirth: sl.string(''),
      isEditable: sl.boolean(false),
      isDeletable: sl.boolean(false),
      senderRelationship: sl.string(''),
      isCashPickupEnabled: sl.boolean(false),
      address: sl.object({
        addressLine1: sl.string(''),
        city: sl.string(''),
        country: sl.string(''),
        postalCode: sl.string(''),
        state: sl.string(''),
      }),
      banks: sl.list(
        sl.object({
          referenceId: sl.string(''),
          accountNumber: sl.string(''),
          accountType: sl.string(''),
          currency: sl.string(''),
          bankName: sl.string(''),
        })
      ),
      wallets: sl.list(
        sl.object({
          identificationValue: sl.string(''),
        })
      ),
    })
  ),
  isFetchingBeneficiaryList: sl.boolean(false),
  isAccountDeleteRequested: sl.boolean(false),
});

const mapStateToProps = (state) => {
  return {
    isFetchingBeneficiaryList: getReduxState(
      ['beneficiary', 'isFetchingBeneficiaryList'],
      state
    ),
    isAccountDeleteRequested: getReduxState(
      ['auth', 'isAccountDeleteRequested'],
      state
    ),
    kycStatus: getReduxState(['auth', 'kycStatus'], state),
    beneficiaries: getReduxState(['beneficiary', 'beneficiaries'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getDestinationCountry,
      getBeneficiaryList,
      fetchBeneficiaryStates,
    },
    dispatch
  );

export const BeneficiaryListView = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(BeneficiaryList)
);
