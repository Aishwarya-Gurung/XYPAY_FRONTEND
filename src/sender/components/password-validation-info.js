import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { PASSWORD_RULE } from 'sender/sender.constant';

const PasswordValidationInfo = (props) => {
  const { t } = useTranslation();
  const { invalidRule } = props;

  const Rule = (props) => {
    return (
      <span
        className={
          invalidRule.includes(props.ruleToCheck)
            ? 'text-danger icon ion-md-close-circle'
            : 'icon ion-md-checkmark-circle'
        }
      >
        {'  '}
        {props.message}
      </span>
    );
  };

  Rule.propTypes = {
    ruleToCheck: PropTypes.string,
    message: PropTypes.string,
  };

  return (
    <ul className="dropdown">
      <div className="col-md-12 small text-success">
        <span className="text-primary bold">
          {t('sender.Password must contain')}
        </span>
        <Rule
          ruleToCheck={PASSWORD_RULE.LOWER_CASE}
          message={t('sender.One lowercase character')}
        />
        <Rule
          ruleToCheck={PASSWORD_RULE.UPPER_CASE}
          message={t('sender.One uppercase character')}
        />
        <Rule
          ruleToCheck={PASSWORD_RULE.NUMBER}
          message={t('sender.One number')}
        />
        <Rule
          ruleToCheck={PASSWORD_RULE.SPECIAL_CHAR}
          message={t('sender.One special character')}
        />
        <Rule
          ruleToCheck={PASSWORD_RULE.MIN_CHAR}
          message={t('sender.6 characters minimum')}
        />
      </div>
    </ul>
  );
};

PasswordValidationInfo.propTypes = {
  invalidRule: PropTypes.array,
};

export default PasswordValidationInfo;
