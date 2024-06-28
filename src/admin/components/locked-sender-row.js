import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';

const LockedSenderRow = (props) => {
  const { t } = useTranslation();
  const { lockedSenders, toggleConfirmationBox } = staticSelector.select(props);

  return lockedSenders.map((senders, key) => {
    return (
      <tr key={key}>
        <td>{key + 1}.</td>
        <td>{senders.fullName}</td>
        <td className="bold">{senders.email}</td>
        <td>{senders.lockedReason}</td>
        <td>
          <button
            onClick={() => toggleConfirmationBox(senders.referenceId)}
            className="shake btn btn-sm btn-green"
          >
            <i className="icon ion-md-unlock d-inline-block mr-1"></i>{' '}
            {t('admin.Unlock')}
          </button>
        </td>
      </tr>
    );
  });
};

LockedSenderRow.propTypes = {
  lockedSenders: PropTypes.array,
  toggleConfirmationBox: PropTypes.func,
};

const staticSelector = sl.object({
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
  toggleConfirmationBox: sl.func(),
});

export default LockedSenderRow;
