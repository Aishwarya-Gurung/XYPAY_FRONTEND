import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

export const SuccessMessage = (props) => {
  const { message } = props;

  return (
    <div className="d-flex">
      <i className="icon ion-md-checkmark-circle text-normal" />
      <span className="pl-2"> {message}</span>
    </div>
  );
};

export const InfoMessage = (props) => {
  const { message } = props;

  return (
    <div className="d-flex">
      <i className="icon ion-md-information-circle text-normal" />
      <span className="pl-2"> {message}</span>
    </div>
  );
};

export const ErrorMessage = (props) => {
  const { message } = props;

  return (
    <div className="d-flex">
      <i className="icon ion-md-remove-circle text-normal" />
      <span className="pl-2"> {message}</span>
    </div>
  );
};

export const WarnMessage = (props) => {
  const { message } = props;

  return (
    <div className="d-flex">
      <i className="icon ion-md-warning text-normal" />
      <span className="pl-2"> {message}</span>
    </div>
  );
};

export default {
  success: function (messasge) {
    return toast.success(<SuccessMessage message={messasge} />);
  },

  info: function (messasge) {
    return toast.info(<InfoMessage message={messasge} />);
  },

  error: function (messasge) {
    return toast.error(<ErrorMessage message={messasge} />);
  },

  warn: function (messasge) {
    return toast.warn(<WarnMessage message={messasge} />);
  },
};

SuccessMessage.propTypes = {
  message: PropTypes.string,
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

WarnMessage.propTypes = {
  message: PropTypes.string,
};

InfoMessage.propTypes = {
  message: PropTypes.string,
};
