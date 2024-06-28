import i18next from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';

import { PAGE } from 'app';
import { PAGING } from 'app/app.constant';

import {
  ADMIN_MENU,
  LOCK_REASONS,
  unlockSender,
  getLockedSenders,
} from 'admin';
import { UNLOCK_SENDER, SENDER_SEARCH_OPTION } from 'admin';

import Table from 'components/form/table';
import sl from 'components/selector/selector';
import PopupAlert from 'components/form/popup-alert';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';
import BlinkTextLoader from 'components/form/blink-loader-text';
import LockedSenderRow from 'admin/components/locked-sender-row';
import { SuccessMessage } from 'components/form/toast-message-container';

import { filterLockedSenders } from 'api';
import { getReduxState, isEmpty, validateEmail } from 'utils';

class LockedSenders extends PureComponent {
  state = {
    filterError: '',
    hasFilter: false,
    referenceId: null,
    filterPayload: {},
    openDropdown: false,
    isSubmitting: false,
    lockedSenderEmail: '',
    lockedSenderError: '',
    isConfirmBoxOpen: false,
    selectedLockReasons: [],
    filteredLockedSenders: [],
    isLockReasonSelected: false,
    updatedFilteredPageDetails: {},
    filteredDataPagination: {
      page: PAGING.PAGE,
      pageSize: PAGING.PAGE_SIZE,
      totalCount: PAGING.TOTAL_COUNT,
    },
    lockReasonsCheckFlag: new Array(LOCK_REASONS.length).fill(false),
  };

  constructor(props) {
    super(props);
    this.filterFormRef = React.createRef();
    this.checkboxDropdownRef = React.createRef();
  }

  componentDidMount = async () => {
    await this.fetchAllLockedUser(true);

    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  fetchAllLockedUser = async (isInitialPage = false) => {
    const { lockedSenderPagination, getLockedSenders } = staticSelector.select(
      this.props
    );
    const { page, pageSize } = lockedSenderPagination;
    const pageFilter = {
      page: isInitialPage ? PAGING.PAGE : page + 1,
      'page-size': pageSize,
      reload: true,
    };

    await getLockedSenders(pageFilter);
  };

  unlockSender = () => {
    const { unlockSender, getLockedSenders, lockedSenderPagination } =
      staticSelector.select(this.props);

    return unlockSender(this.state.referenceId).then((res) => {
      if (res.type === UNLOCK_SENDER.SUCCESS) {
        toast.success(
          <SuccessMessage
            message={i18next.t('admin.Sender has been unlocked successfully')}
          />
        );

        const { pageSize } = lockedSenderPagination;
        const pageFilter = {
          page: PAGING.PAGE,
          'page-size': pageSize,
          reload: true,
        };

        getLockedSenders(pageFilter);

        this.setState({
          filteredLockedSenders: [],
        });

        this.handleFilterReset();

        return true;
      }
    });
  };

  toggleConfirmationBox = (referenceId = null) => {
    this.setState((state) => {
      return {
        referenceId,
        isConfirmBoxOpen: !state.isConfirmBoxOpen,
      };
    });
  };

  fetchAdditionalLockedSenders = async (isAdditionalPage = false) => {
    const { lockedSenderPagination, getLockedSenders } = staticSelector.select(
      this.props
    );

    const pageFilter = {
      reload: false,
    };

    if (this.state.filteredLockedSenders?.length <= 0) {
      const { page, pageSize } = lockedSenderPagination;

      pageFilter['page'] = isAdditionalPage ? page + 1 : page;
      pageFilter['page-size'] = pageSize;

      await getLockedSenders(pageFilter);

      return;
    }

    const { page, pageSize } = this.state.filteredDataPagination;

    pageFilter['page'] = page + 1;
    pageFilter['page-size'] = pageSize;
    pageFilter['search-by'] = SENDER_SEARCH_OPTION.LOCK_REASON;

    const { data } = await filterLockedSenders(pageFilter, {
      lockedReasons: this.state.selectedLockReasons,
    });

    if (!isEmpty(data)) {
      this.setState({
        filteredLockedSenders: this.state.filteredLockedSenders.concat(
          data.result
        ),
        filteredDataPagination: data.paging,
      });
    }
  };

  handleClickOutside = (event) => {
    if (
      this.checkboxDropdownRef.current &&
      !this.checkboxDropdownRef.current.contains(event.target)
    ) {
      this.setState({ openDropdown: false });
    }
  };

  handleFilterByEmailOnChange = (input) => {
    if (this.isSearchKeyValid(input)) {
      return this.setState({
        lockedSenderEmail: input.value,
      });
    }
  };

  isSearchKeyValid = (input) => {
    if (input.name === 'lockedUser' && !validateEmail(input.value)) {
      this.setState({
        lockedSenderError: 'Please enter a valid email',
        hasFilter: false,
      });

      return false;
    }

    if (input.name === 'lockedUser') {
      if (isEmpty(input.value)) {
        this.setState({
          lockedSenderError: '',
          hasFilter: false,
        });

        return false;
      }

      if (validateEmail(input.value)) {
        this.setState({
          lockedSenderError: '',
          hasFilter: true,
        });

        return true;
      }
    }

    return true;
  };

  selectLockedReasonOnCheck = (input, position) => {
    const lockReasonsCheckFlag = this.state.lockReasonsCheckFlag.map(
      (checked, index) => (index === position ? !checked : checked)
    );

    this.setState({
      lockReasonsCheckFlag,
      isLockReasonSelected: !this.state.isLockReasonSelected,
      hasFilter: true,
    });

    this.setSelectedLockReasons(input, position);
  };

  setSelectedLockReasons = (input, position) => {
    this.state.lockReasonsCheckFlag.map((checkFlag, index) => {
      if (
        index === position &&
        !this.state.selectedLockReasons.includes(input.name)
      ) {
        return this.setState({
          selectedLockReasons: [...this.state.selectedLockReasons, input.name],
        });
      }

      if (
        checkFlag &&
        index === position &&
        this.state.selectedLockReasons.includes(input.name)
      ) {
        const currentInputs = this.state.selectedLockReasons.filter(
          (selectedLockReason) => selectedLockReason !== input.name
        );

        return this.setState({
          selectedLockReasons: currentInputs,
        });
      }
    });
  };

  setIsDropdownOpen = () => {
    return this.setState({
      openDropdown: !this.state.openDropdown,
    });
  };

  openDropdown = () => {
    this.setIsDropdownOpen();
  };

  getFilterPayload = (e) => {
    const senderEmailInput = e.target[0];
    const filterPayload = {};

    if (!isEmpty(senderEmailInput.value)) {
      filterPayload.email = senderEmailInput.value;
    }

    if (this.state.selectedLockReasons.length > 0) {
      filterPayload.lockedReasons = this.state.selectedLockReasons;
    }

    return filterPayload;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({ filterError: '' });

    const { lockedSenderPagination } = staticSelector.select(this.props);
    const payload = this.getFilterPayload(e);
    const { pageSize } = lockedSenderPagination;
    const filter = {
      page: 0,
      'page-size': pageSize,
    };

    this.setState({
      isSubmitting: true,
    });

    if (!isEmpty(payload?.email) && validateEmail(payload?.email)) {
      filter['search-by'] = SENDER_SEARCH_OPTION.EMAIL;
    }

    if (payload?.lockedReasons?.length > 0) {
      filter['search-by'] = SENDER_SEARCH_OPTION.LOCK_REASON;
    }

    if (!isEmpty(filter['search-by'])) {
      const { data, error } = await filterLockedSenders(filter, payload);

      if (error) {
        return this.setState({
          filteredLockedSenders: [],
          filterError: error.message,
          isSubmitting: false,
        });
      }

      if (data) {
        return this.setState({
          filteredLockedSenders: data.result,
          filteredDataPagination: data.paging,
          isSubmitting: false,
        });
      }
    }
  };

  getDropdownLabel = () => {
    if (this.state.selectedLockReasons.length > 0) {
      const selectedLockReasons = LOCK_REASONS.filter((lockReason) =>
        this.state.selectedLockReasons.includes(lockReason.name)
      );

      return (
        <>
          <span title="Selected Lock Reason Count" className="option-count">
            <span>{selectedLockReasons.length}</span>
          </span>
          <span>
            {selectedLockReasons.length &&
              selectedLockReasons.map((obj) => [obj.label]).join(', ')}
          </span>
        </>
      );
    }

    return 'Select Lock Reason';
  };

  getLockedSenders = () => {
    const { lockedSenders } = staticSelector.select(this.props);

    if (this.state.filteredLockedSenders.length) {
      return this.state.filteredLockedSenders;
    }

    if (
      this.state.selectedLockReasons.length &&
      isEmpty(this.state.filteredLockedSenders)
    ) {
      if (this.state.openDropdown) {
        return lockedSenders;
      }

      return [];
    }

    if (
      lockedSenders.length &&
      isEmpty(this.state.selectedLockReasons.length) &&
      isEmpty(this.state.filterError)
    ) {
      return lockedSenders;
    }

    return [];
  };

  handleFilterReset = () => {
    this.filterFormRef.current.reset();

    this.setState({
      filterError: '',
      lockedSenderEmail: '',
      selectedLockReasons: [],
      filteredLockedSenders: [],
      lockReasonsCheckFlag: new Array(LOCK_REASONS.length).fill(false),
    });
  };

  disablePagination = () => {
    const { lockedSenderPagination } = staticSelector.select(this.props);

    if (this.state.filterError) {
      return true;
    }

    if (this.getLockedSenders().length < PAGING.PAGE_SIZE) {
      return true;
    }

    if (this.state.filteredLockedSenders?.length > 0) {
      const { page, pageSize, totalCount } = this.state.filteredDataPagination;
      const actualPage = page + 1;

      return actualPage * pageSize >= totalCount;
    }

    const { page, pageSize, totalCount } = lockedSenderPagination;
    const actualPage = page + 1;

    return actualPage * pageSize >= totalCount;
  };

  renderTableContent = (columnNames) => {
    const { t, isUnlockingSender } = staticSelector.select(this.props);

    if (this.state.filterError) {
      return (
        <tr>
          <td colSpan={columnNames.length} className="custom-danger-color">
            <i className="icon ion-md-information-circle mr-1"></i>{' '}
            {this.state.filterError}
          </td>
        </tr>
      );
    }

    if (this.getLockedSenders().length) {
      return (
        <React.Fragment>
          <LockedSenderRow
            lockedSenders={this.getLockedSenders()}
            toggleConfirmationBox={this.toggleConfirmationBox}
          />
          <PopupAlert
            title={t('dashboard.Are you sure?')}
            message={t('admin.Do you really want to unlock this user?')}
            className={'info'}
            alert={this.state.isConfirmBoxOpen}
            asyncAction={this.unlockSender}
            isTakingAction={isUnlockingSender}
            toggleConfirmationBox={this.toggleConfirmationBox}
          />
        </React.Fragment>
      );
    }

    return (
      <tr>
        <td colSpan={columnNames.length} className="text-primary">
          <i className="icon ion-md-information-circle"></i>{' '}
          {t('admin.There are no locked senders at this moment')}
        </td>
      </tr>
    );
  };

  render() {
    const { t, isFetchingSenders } = staticSelector.select(this.props);

    const columnNames = [
      t('admin.SNo'),
      t('admin.Name'),
      t('admin.Email'),
      t('admin.Lock Reason'),
      t('dashboard.Actions'),
    ];

    return (
      <AccountLayout>
        <PageHead title={PAGE.LOCKED_USER} />
        <SidebarMenu menus={ADMIN_MENU} activeTab={ADMIN_MENU.UNLOCK_SENDERS} />
        <div className="col-md-9">
          <h4 className="bold mb-3 text-primary">
            <i className="icon ion-md-contacts"></i> {t('admin.Unlock Senders')}
          </h4>
          <div className="col-md-12 m-0 p-0">
            <div className="border rounded p-0">
              <div className="col-md-12 m-0 p-0">
                <form
                  onSubmit={(e) => this.handleSubmit(e)}
                  ref={this.filterFormRef}
                >
                  <div className="filter-container">
                    <div className="search-wrapper d-flex justify-content-between w-100">
                      <div className="d-flex flex-column w-50">
                        <div className="pr-0 pl-0 d-flex">
                          <input
                            type="email"
                            name="lockedUser"
                            autoComplete="off"
                            value={this.searchKey}
                            onChange={(e) =>
                              this.handleFilterByEmailOnChange(e.target)
                            }
                            onKeyDown={validateEmail}
                            className={`col-md-12 search-field 
                            }`}
                            placeholder={'Search by email'}
                            disabled={this.state.selectedLockReasons.length}
                          />
                          <i
                            className={`icon ion-md-search search-icon ${
                              this.state.selectedLockReasons.length
                                ? 'disabled'
                                : ''
                            }`}
                          />
                        </div>
                      </div>

                      <div
                        className={`ml-3 w-50
                         ${this.state.lockedSenderEmail ? 'disabled' : ''}`}
                        ref={this.checkboxDropdownRef}
                      >
                        <div
                          onClick={() => this.openDropdown()}
                          className="custom-locked-reason-selector custom-select custom-bank-select cursor-pointer m-0
          "
                        >
                          <label className="dropdown-text-overflow">
                            {this.getDropdownLabel()}
                          </label>
                        </div>

                        {this.state.openDropdown && (
                          <div className="locked-reason-selector-wrapper">
                            {LOCK_REASONS.map(
                              ({ name, value, label }, index) => {
                                return (
                                  <div
                                    className="custom-checkbox-wrapper d-flex p-3"
                                    key={name}
                                  >
                                    <input
                                      id={`custom-checkbox-${index}`}
                                      type="checkbox"
                                      name={name}
                                      key={name + index}
                                      checked={
                                        this.state.lockReasonsCheckFlag[index]
                                      }
                                      value={value}
                                      onChange={(e) => {
                                        this.selectLockedReasonOnCheck(
                                          e.target,
                                          index
                                        );
                                      }}
                                    />
                                    <span />
                                    <label htmlFor="one" className="pl-2 m-0">
                                      {label}
                                    </label>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex m-3">
                      <button
                        className="btn btn-md btn-green"
                        disabled={!this.state.hasFilter}
                        type="submit"
                      >
                        {t('admin.Search')}
                      </button>

                      <button
                        className="btn btn-md btn-outline-green ml-3"
                        type="button"
                        onClick={(e) => this.handleFilterReset(e)}
                      >
                        {t('admin.Reset')}
                      </button>
                    </div>
                  </div>
                </form>

                <Table columnNames={columnNames}>
                  {isFetchingSenders || this.state.isSubmitting ? (
                    <tr>
                      <td colSpan={columnNames.length}>
                        <BlinkTextLoader
                          margin={5}
                          message={t('admin.Fetching senders')}
                        />
                      </td>
                    </tr>
                  ) : (
                    this.renderTableContent(columnNames)
                  )}
                </Table>
                <div className="bg-light border-top text-center">
                  <button
                    className="btn btn-link btn-sm p-2 "
                    onClick={() => this.fetchAdditionalLockedSenders(true)}
                    disabled={this.disablePagination()}
                  >
                    {t('dashboard.Show more')}
                    <i className="icon ion-md-dropdown" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccountLayout>
    );
  }
}

LockedSenders.propTypes = {
  t: PropTypes.func,
  unlockSender: PropTypes.func,
  lockedSenders: PropTypes.array,
  getLockedSenders: PropTypes.func,
  isFetchingSenders: PropTypes.bool,
  isUnlockingSender: PropTypes.bool,
};

const staticSelector = sl.object({
  t: sl.func(),
  lockedSenders: sl.list(
    sl.object({
      id: sl.number(),
      fullName: sl.string(null),
      email: sl.string(null),
      phoneNumber: sl.string(null),
      imageUrl: sl.string(null),
      referenceId: sl.string(null),
      lockedReason: sl.string(null),
    })
  ),
  unlockSender: sl.func(),
  getLockedSenders: sl.func(),
  isFetchingSenders: sl.boolean(false),
  isUnlockingSender: sl.boolean(false),
  lockedSenderPagination: sl.object({
    page: sl.number(PAGING.PAGE),
    pageSize: sl.number(PAGING.PAGE_SIZE),
    totalCount: sl.number(PAGING.TOTAL_COUNT),
  }),
});

const mapStateToProps = (state) => {
  return {
    lockedSenders: getReduxState(['admin', 'lockedSenders'], state),
    lockedSenderPagination: getReduxState(
      ['admin', 'lockedSenderPagination'],
      state
    ),
    isFetchingSenders: getReduxState(['admin', 'isFetchingSenders'], state),
    isUnlockingSender: getReduxState(['admin', 'isUnlockingSender'], state),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ unlockSender, getLockedSenders }, dispatch);

export const LockedSendersView = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(LockedSenders)
);
