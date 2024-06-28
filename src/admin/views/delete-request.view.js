import i18n from 'i18next';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

import { ADMIN_MENU } from 'admin/admin.constant';
import DeleteRequestRow from 'admin/components/delete-request-row';

import Table from 'components/form/table';
import PopupAlert from 'components/form/popup-alert';
import { PageHead } from 'components/layout/page-head';
import SidebarMenu from 'components/layout/sidebar-menu';
import AccountLayout from 'components/layout/account-layout';
import BlinkTextLoader from 'components/form/blink-loader-text';

import { PAGE } from 'app';
import { isEmpty, validateEmail } from 'utils';
import { fetchAccountDeletionRequests, revertDeleteRequest } from 'api';

const DeleteRequest = (props) => {
  const { t } = useTranslation();

  const inputRef = useRef(null);
  const formRef = useRef(null);

  const [referenceId, setReferenceId] = useState('');
  const [invalidEmailError, setInvalidEmailError] = useState('');
  const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState(false);
  const [isFetchingRequests, setIsFetchingRequests] = useState(true);
  const [isRevertingRequest, setIsRevertingRequest] = useState(false);

  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);
  const [deleteAccountRequests, setDeleteAccountRequests] = useState([]);

  const [searchResults, setSearchResults] = useState(deleteAccountRequests);

  useEffect(() => {
    getAllRequestedUsers();
  }, [props]);

  const getAllRequestedUsers = async () => {
    const { data, error } = await fetchAccountDeletionRequests();

    if (error && !data) {
      return toast.error(i18n.t('admin.Unable to fetch the delete requests'));
    }

    if (!error && data.result) {
      setSearchResults(data.result);
      setDeleteAccountRequests(data.result);
    }

    return setIsFetchingRequests(false);
  };

  const toggleConfirmationBox = (referenceId = null) => {
    setIsConfirmBoxOpen(!isConfirmBoxOpen);

    setReferenceId(referenceId);
  };

  const onRevertDeleteRequest = async () => {
    setIsRevertingRequest(true);

    const { data, error } = await revertDeleteRequest(referenceId, reason);

    setIsConfirmBoxOpen(false);
    setIsRevertingRequest(false);

    if (error && !data) {
      return toast.error(i18n.t('admin.Unable to revert the delete request'));
    }

    getAllRequestedUsers();

    return toast.success(
      i18n.t('admin.The deletion request has been reverted successfully')
    );
  };

  const columnNames = [
    t('admin.SNo'),
    t('beneficiary.Name'),
    t('admin.Requested date'),
    t('beneficiary.Email'),
    t('dashboard.Actions'),
  ];

  const handleChange = () => {
    resetInputTexts();
  };

  const resetInputTexts = () => {
    setSearchResults(deleteAccountRequests);
  };

  const resetAll = () => {
    formRef.current.reset();

    resetInputTexts();
  };

  const handleValidation = (input) => {
    const inputName = input.name;
    const inputValue = input.value ? input.value.trim() : '';

    if (inputName === 'email' && isEmpty(inputValue)) {
      const message = i18n.t('validation.This field cannot be empty');

      return setInvalidEmailError(message);
    }

    if (inputName === 'email' && !validateEmail(inputValue)) {
      const message = i18n.t('validation.Please enter a valid email address');

      return setInvalidEmailError(message);
    }

    setInvalidEmailError('');

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const input = e.target[0];

    if (handleValidation(input)) {
      if (inputRef?.current?.value.length >= 2) {
        const newResult = deleteAccountRequests.filter((senders) => {
          return senders.email
            .toLowerCase()
            .includes(inputRef.current.value.trim().toLowerCase());
        });

        if (!newResult.length) {
          setError(true);
        }

        return setSearchResults(newResult);
      }
      resetAll();
    }
  };

  return (
    <AccountLayout>
      <PageHead title={PAGE.DELETE_REQUESTS} />
      <SidebarMenu menus={ADMIN_MENU} activeTab={ADMIN_MENU.DELETE_REQUESTS} />
      <div className="col-md-9">
        <h4 className="bold mb-3 text-primary">
          <i className="icon ion-md-trash pr-2"></i>{' '}
          {t('admin.Account Delete Requests')}
        </h4>

        <div className="col-md-12 border rounded m-0 p-0">
          <form
            className="m-3"
            onSubmit={(e) => handleSubmit(e)}
            autoComplete="off"
            onBlur={(e) => handleValidation(e.target)}
            ref={formRef}
          >
            <div className="d-flex flex-lg-row flex-column align-item-center">
              <div className="w-75 m-auto pr-2">
                <i className={`icon ion-md-search search-icon`} />
                <input
                  ref={inputRef}
                  type="text"
                  name="email"
                  autoComplete="off"
                  onChange={handleChange}
                  className={`form-control search-field ${
                    invalidEmailError ? 'is-invalid' : ''
                  }`}
                  placeholder={'Search by email'}
                />
                <div className="invalid-feedback">{invalidEmailError}</div>
              </div>

              <div className="button-view mt-1 ml-3">
                <button className="btn btn-md btn-green" type="submit">
                  {t('admin.Search')}
                </button>

                <button
                  className="btn btn-md btn-outline-green ml-3"
                  type="reset"
                  onClick={resetAll}
                >
                  {t('admin.Reset')}
                </button>
              </div>
            </div>
          </form>

          <Table className="delete-request-table" columnNames={columnNames}>
            {isFetchingRequests ? (
              <tr>
                <td colSpan={columnNames.length}>
                  <BlinkTextLoader
                    margin={5}
                    message={i18next.t('admin.Fetching senders')}
                  />
                </td>
              </tr>
            ) : searchResults.length ? (
              <React.Fragment>
                <DeleteRequestRow
                  deleteAccountRequests={searchResults}
                  toggleConfirmationBox={toggleConfirmationBox}
                />

                <PopupAlert
                  remarks={reason}
                  setRemarks={setReason}
                  isRemarksEnabled={true}
                  hasError={isEmpty(reason)}
                  placeholder={t('admin.Reason')}
                  title={t('dashboard.Are you sure?')}
                  message={t(
                    'admin.Do you really want to revert the delete request?'
                  )}
                  className={'info'}
                  alert={isConfirmBoxOpen}
                  asyncAction={onRevertDeleteRequest}
                  isTakingAction={isRevertingRequest}
                  toggleConfirmationBox={toggleConfirmationBox}
                />
              </React.Fragment>
            ) : error ? (
              <tr>
                <td colSpan={columnNames.length} className="text-danger">
                  <i className="icon ion-md-information-circle mr-1"></i>
                  {t(
                    'admin.No account delete requests from this email at the moment'
                  )}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={columnNames.length} className="text-primary">
                  <i className="icon ion-md-information-circle mr-1"></i>
                  {t(
                    'admin.There are no account delete requests at this moment'
                  )}
                </td>
              </tr>
            )}
          </Table>
        </div>
      </div>
    </AccountLayout>
  );
};

DeleteRequest.propTypes = {
  deleteAccountRequests: PropTypes.array,
  isFetchingRequests: PropTypes.bool,
};

const DeleteRequestView = withTranslation()(DeleteRequest);

export default DeleteRequestView;
