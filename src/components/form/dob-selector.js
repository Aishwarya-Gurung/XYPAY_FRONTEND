import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';
import DateSelector from 'components/form/date-selector';

import { ROUTES } from 'app';
import { isCurrentPath } from 'utils/routes-helper';

const DOBSelector = (props) => {
  const { t } = useTranslation();
  const {
    defaultDOB,
    handleValidation,
    dateOfBirthError,
    dateOfBirthDayError,
    dateOfBirthYearError,
    dateOfBirthMonthError,
  } = staticSelector.select(props);

  return (
    <div className="row">
      {!isCurrentPath(ROUTES.SENDER_SIGN_UP) &&
        !isCurrentPath(ROUTES.SENDER_REGISTRATION_ON_FLOW) && (
          <span className="col-12 form-group mb-0">
            {t('auth.Date of Birth')}
          </span>
        )}
      <DateSelector
        defaultValue={defaultDOB}
        inputName="dateOfBirth"
        isExpiryDate={false}
        dateError={dateOfBirthError}
        dayError={dateOfBirthDayError}
        yearError={dateOfBirthYearError}
        handleValidation={handleValidation}
        monthError={dateOfBirthMonthError}
      />
    </div>
  );
};

DOBSelector.propTypes = {
  errors: PropTypes.object,
  handleValidation: PropTypes.func,
  defaultValue: PropTypes.string,
};

const staticSelector = sl.object({
  defaultDOB: sl.string(''),
  dateOfBirthError: sl.string(''),
  dateOfBirthDayError: sl.string(''),
  dateOfBirthYearError: sl.string(''),
  dateOfBirthMonthError: sl.string(''),

  handleValidation: sl.func(),
  dateOfBirth: sl.string(''),
});

export default DOBSelector;
