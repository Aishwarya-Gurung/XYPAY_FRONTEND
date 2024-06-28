import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';

const DeleteRequestRow = (props) => {
  const { t } = useTranslation();
  const { deleteAccountRequests, toggleConfirmationBox } =
    staticSelector.select(props);

  return deleteAccountRequests.map((sender, key) => {
    const utcDate = new Date(sender.accountDeletionRequestAt);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const localDateString = utcDate.toLocaleDateString('en', options);

    return (
      <tr key={key}>
        <td>{key + 1}.</td>
        <td>{sender.fullName}</td>
        <td>{sender.accountDeletionRequestAt ? localDateString : 'N/A'}</td>
        <td className="bold">{sender.email}</td>
        <td>
          <button
            onClick={() => toggleConfirmationBox(sender.referenceId)}
            className="shake btn btn-sm btn-danger"
          >
            <i className="icon ion-md-refresh d-inline-block mr-1"></i>
            {t('admin.Revert')}
          </button>
        </td>
      </tr>
    );
  });
};

DeleteRequestRow.propTypes = {
  deleteAccountRequests: PropTypes.array,
  toggleConfirmationBox: PropTypes.func,
};

const staticSelector = sl.object({
  deleteAccountRequests: sl.list(
    sl.object({
      id: sl.number(),
      email: sl.string(null),
      fullName: sl.string(null),
      lastName: sl.string(null),
      imageUrl: sl.string(null),
      middleName: sl.string(null),
      phoneNumber: sl.string(null),
      referenceId: sl.string(null),
      accountDeletionRequestAt: sl.string(''),
    })
  ),
  toggleConfirmationBox: sl.func(),
});

export default DeleteRequestRow;
