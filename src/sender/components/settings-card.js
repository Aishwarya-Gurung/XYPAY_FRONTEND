import React from 'react';
import PropTypes from 'prop-types';

const getIconClass = (current, active) => {
  return current !== active
    ? `ion-md-arrow-dropdown-circle`
    : `ion-md-arrow-dropup-circle`;
};

const SettingCard = (props) => {
  const { card, activeCard, cardTitle, setActiveCard, children, icon } = props;

  return (
    <React.Fragment>
      <div className="col-md-12 mb-1 card text-left p-0">
        <p
          className="card-header bold cursor-pointer"
          onClick={() => setActiveCard(card)}
        >
          <i className={`${icon} mr-2`}></i> {cardTitle}
          <i
            className={`icon ${getIconClass(card, activeCard)} float-right`}
          ></i>
        </p>
        <div className={activeCard === card ? 'show' : 'hide'}>
          <div className="card-body">{children}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

SettingCard.propTypes = {
  icon: PropTypes.string,
  card: PropTypes.string,
  children: PropTypes.object,
  activeCard: PropTypes.string,
  cardTitle: PropTypes.string,
  setActiveCard: PropTypes.func,
};

export default SettingCard;
