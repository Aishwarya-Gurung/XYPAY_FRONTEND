import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TIER, NOTE, REQUIREMENT } from 'sender/sender.constant';

const getIconClass = (tier) => {
  switch (tier) {
    case TIER.ONE:
      return 'text-info';

    case TIER.TWO:
      return 'text-success';

    case TIER.THREE:
      return 'text-danger';

    default:
      return;
  }
};

const TierRequirementList = (props) => {
  const { t } = useTranslation();
  const { note, requirement } = props;

  return (
    <React.Fragment>
      <ul className="text-muted small pl-4 pr-4 tier-requirement-list">
        {requirement.map((point, key) => (
          <li key={key}>{point}</li>
        ))}
      </ul>
      <div className="text-justify line-height-1">
        <span className="bold small">{t('sender.Note')} </span>
        <span className="text-muted small">{note.description}</span>
        <ul className="text-muted small tier-requirement-list pl-4 pt-1 display-3">
          {note.limit.map((value, key) => (
            <li key={key}>{value}</li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
};

const TierCard = (props) => {
  const {
    tier,
    note,
    setTier,
    nextTier,
    tierName,
    currentTier,
    requirement,
  } = props;
  const { t } = useTranslation();

  return (
    <div className="col-md-12 mb-1 card text-left p-0">
      <p
        className="card-header bold cursor-pointer"
        onClick={() => setTier(tier)}
      >
        <i className={`icon ion-md-ribbon ${getIconClass(tier)}`}></i>{' '}
        {tierName}
        {tier === currentTier && <span> ({t('sender.current limit')})</span>}
      </p>
      <div className={nextTier === tier ? 'show' : 'hide'}>
        <div className="card-body">
          <span>{t('sender.Requirement')}</span>
          <TierRequirementList note={note} requirement={requirement} />
        </div>
      </div>
    </div>
  );
};

const TierInfo = (props) => {
  const { currentTier } = props;
  const [tier, setTier] = useState(TIER.getNextTierNameOf(currentTier));

  return (
    <div className="col-md-12 p-0">
      <TierCard
        tier={TIER.ONE}
        nextTier={tier}
        setTier={setTier}
        note={NOTE.TIER1}
        currentTier={currentTier}
        requirement={REQUIREMENT.TIER1}
        tierName={TIER.getTierNameOf(TIER.ONE)}
      />
      <TierCard
        tier={TIER.TWO}
        nextTier={tier}
        setTier={setTier}
        note={NOTE.TIER2}
        currentTier={currentTier}
        requirement={REQUIREMENT.TIER2}
        tierName={TIER.getTierNameOf(TIER.TWO)}
      />
      <TierCard
        nextTier={tier}
        tier={TIER.THREE}
        setTier={setTier}
        note={NOTE.TIER3}
        currentTier={currentTier}
        requirement={REQUIREMENT.TIER3}
        tierName={TIER.getTierNameOf(TIER.THREE)}
      />
    </div>
  );
};

TierCard.propTypes = {
  tier: PropTypes.string,
  note: PropTypes.object,
  setTier: PropTypes.func,
  tierName: PropTypes.string,
  nextTier: PropTypes.string,
  requirement: PropTypes.array,
  currentTier: PropTypes.string,
};

TierInfo.propTypes = {
  currentTier: PropTypes.string,
};

TierRequirementList.propTypes = {
  note: PropTypes.object,
  requirement: PropTypes.array,
};

export default TierInfo;
