import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import sl from 'components/selector/selector';

import { PAGE } from 'app';
import { ADMIN_MENU } from 'admin';
import FeeSetForm from 'admin/components/fee-set';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';

/**
 * Fee set View.
 */
class AddFeeSet extends PureComponent {
  /**
   * Renders page.
   */
  render() {
    const { t } = staticSelector.select(this.props);

    return (
      <AccountLayout>
        <PageHead title={PAGE.FEE} />
        <SidebarMenu menus={ADMIN_MENU} activeTab={ADMIN_MENU.ADD_FEE_SET} />
        <div className="col-md-9">
          <div className="col-md-12 p-0 mb-2 clearfix">
            <h4 className="bold mb-3 text-primary float-left">
              <i className="icon ion-md-cash"></i> {t('admin.Add Fee Set')}
            </h4>
          </div>
          <div className="col-md-12 m-0 p-0">
            <div className="border rounded pt-4 pb-4 pl-2 pr-2">
              <div className="col-md-12 m-0 p-0">
                <div className="col-md-12">
                  <div className="alert alert-info">
                    <i className="icon ion-md-information-circle"></i> Select
                    fee set parameter to set new fee range
                  </div>
                </div>

                <FeeSetForm />
              </div>
            </div>
          </div>
        </div>
      </AccountLayout>
    );
  }
}

AddFeeSet.propTypes = {
  t: PropTypes.func,
  sourceCountries: PropTypes.array,
  getSourceCountry: PropTypes.func,
  destinationCountries: PropTypes.array,
  getDestinationCountry: PropTypes.func,
};

const staticSelector = sl.object({
  t: sl.func(),
  getSourceCountry: sl.func(),
  sourceCountries: sl.list(
    sl.object({
      flagUrl: sl.string(''),
      name: sl.string(''),
      twoCharCode: sl.string(''),
      threeCharCode: sl.string(''),
    })
  ),

  getDestinationCountry: sl.func(),
  destinationCountries: sl.list(
    sl.object({
      flagUrl: sl.string(''),
      name: sl.string(''),
      twoCharCode: sl.string(''),
      threeCharCode: sl.string(''),
    })
  ),
});

export const AddFeeSetView = withTranslation()(AddFeeSet);
