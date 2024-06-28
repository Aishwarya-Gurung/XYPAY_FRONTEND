import React from 'react';
import PropTypes from 'prop-types';

const SelectBox = (props) => {
  const { icon, name, title, children, handleOnChange } = props;

  return (
    <div className="col-md-12 mb-3">
      <div className="card">
        <label className="card-top media p-3">
          <i className={`icon ion-md-${icon} h3 mr-2 mt-1 text-muted`} />
          <label className="media-body p-2 pl-0">
            <div className="select-wrapper">
              <select
                name={name}
                className="skinny text-muted h4 float-left"
                onChange={(e) => handleOnChange(e.target)}
              >
                <option value="">{title}</option>
                {children}
              </select>
              <i className="icon ion-md-arrow-dropdown ml-3 float-right" />
            </div>
          </label>
        </label>
      </div>
    </div>
  );
};

SelectBox.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.array,
  handleOnChange: PropTypes.func,
};

export default SelectBox;
