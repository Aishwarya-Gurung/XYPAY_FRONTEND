import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState, useEffect } from 'react';

import { MONTH } from 'beneficiary/beneficiary.constant';
import { getYear, addPadding, getDaysInMonth } from 'utils';

const calculateDate = ({ day, year, month, dateEl, handleValidation }) => {
  const date = `${year}-${addPadding(month, 0)}-${addPadding(day, 0)}`;

  dateEl.current.value = date;
  handleValidation(dateEl.current);
};

const dateIntoDayMonthYear = (date) => {
  const givenDate = new Date(date);

  return {
    day: givenDate.getDate() || 0,
    year: givenDate.getFullYear() || 0,
    month: givenDate.getMonth() + 1 || 0,
  };
};

const DateSelector = (props) => {
  const dateEl = useRef(null);
  const { t } = useTranslation();
  const [day, setDay] = useState(0);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const {
    dayError,
    yearError,
    inputName,
    dateError,
    monthError,
    defaultValue,
    handleValidation,
  } = props;
  const defaultDate = dateIntoDayMonthYear(defaultValue);

  const dateParam = {
    day,
    year,
    month,
    dateEl,
    handleValidation,
  };

  useEffect(() => {
    setYear(defaultDate.year);
    setMonth(defaultDate.month);
    setDay(defaultDate.day);
  }, [defaultValue]);

  useEffect(() => {
    calculateDate(dateParam);
  }, [year, month, day, dateParam]);

  return (
    <React.Fragment>
      <label className="form-group col-md-4 mb-md-0">
        <select
          name="year"
          className="custom-select"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">{t('beneficiary.Year')}</option>
          {getYear().map((year, key) => (
            <option key={key} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{yearError}</div>
      </label>

      <label className="form-group col-md-4 mb-md-0">
        <select
          name="month"
          className="custom-select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">{t('beneficiary.Month')}</option>
          {MONTH.map((month, key) => (
            <option key={key} value={key + 1}>
              {month}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{monthError}</div>
      </label>

      <label className="form-group col-md-4 mb-0">
        <select
          name="day"
          className="custom-select"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          <option value="">{t('beneficiary.Day')}</option>
          {getDaysInMonth(
            year || defaultDate.year,
            month || defaultDate.month
          ).map((year, key) => (
            <option key={key} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{dayError}</div>
      </label>

      <label className="form-group col-md-12 mb-0">
        <input
          readOnly
          type="hidden"
          ref={dateEl}
          name={inputName}
          className="form-control"
          defaultValue={defaultValue}
        />
        <div className="invalid-feedback">{dateError}</div>
      </label>
    </React.Fragment>
  );
};

DateSelector.propTypes = {
  dayError: PropTypes.string,
  yearError: PropTypes.string,
  inputName: PropTypes.string,
  dateError: PropTypes.string,
  monthError: PropTypes.string,
  defaultValue: PropTypes.string,
  handleValidation: PropTypes.func,
};

export default DateSelector;
