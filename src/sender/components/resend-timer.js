import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';

const ResendTimer = (props) => {
  const { t } = useTranslation();
  const {
    isTimerStarted,
    toggleTimerStarted,
    totalTimeInterval,
    handleTimerChange,
  } = props;

  useEffect(() => {
    const decreaseTimer = () => {
      if (totalTimeInterval > 0) {
        return handleTimerChange(totalTimeInterval - 1);
      }
      toggleTimerStarted();
    };

    if (isTimerStarted) {
      setTimeout(decreaseTimer, 1000);
    }

    return () => clearTimeout(decreaseTimer);
  }, [isTimerStarted, totalTimeInterval, toggleTimerStarted]);

  return (
    <div className="mt-1">
      {t('verification.Resend in')}{' '}
      <span className="bold">{totalTimeInterval}s</span>
    </div>
  );
};

ResendTimer.propTypes = {
  isTimerStarted: PropTypes.bool,
  totalTimeInterval: PropTypes.number,
  toggleTimerStarted: PropTypes.func,
  handleTimerChange: PropTypes.func,
};

export default ResendTimer;
