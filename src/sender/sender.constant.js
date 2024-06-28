export const ACCOUNT_MENU = {
  DASHBOARD: 'Dashboard',
  PROFILE: 'Profile',
  BENEFICIARY: 'Beneficiary',
  SETTINGS: 'Settings',
};

export const PASSWORD_RULE = {
  NUMBER: 'number',
  MIN_CHAR: 'min-char',
  LOWER_CASE: 'lowercase',
  UPPER_CASE: 'uppercase',
  SPECIAL_CHAR: 'special-char',
};

export const TIER = {
  ONE: 'LEVEL1',
  TWO: 'LEVEL2',
  THREE: 'LEVEL3',

  LEVEL1: 'Level 1',
  LEVEL2: 'Level 2',
  LEVEL3: 'Level 3',

  getTierNameOf: function (currentTier) {
    return this[currentTier];
  },

  getNextTierOf: function (currentTier) {
    const base = currentTier.slice(0, -1);
    const tierNumber = parseInt(currentTier.slice(-1));

    if (tierNumber < 3) {
      const nextTier = `${base}${tierNumber + 1}`;

      return this[nextTier];
    }

    return false;
  },

  getNextTierNameOf: function (currentTier) {
    const base = currentTier.slice(0, -1);
    let tierNumber = parseInt(currentTier.slice(-1));

    if (tierNumber < 3) {
      tierNumber++;
    }

    return `${base}${tierNumber}`;
  },
};

export const REQUIREMENT = {
  TIER1: [
    'Full Name',
    'Gender',
    'Full Address (Street, City, State, Zip Code)',
    'Date of Birth',
    'Email Address',
    'Phone Number',
    'Last 4 Digit SSN Number',
    'Purpose of Remittance',
    'Sender Beneficiary Relationship',
  ],
  TIER2: [
    'Copy of Customer ID',
    'ID Number',
    'ID Issuing Authority',
    'ID Expiry Date',
    'Full SSN',
  ],
  TIER3: [
    'Occupation',
    'Company Details',
    'Source of Funds:',
    ' 1. Bank Statement 2. Pay Slip',
  ],
};

export const NOTE = {
  TIER1: {
    description: 'Limit for Level 1 customers:',
    limit: [
      'Up to $500 per transaction',
      'Up to $500 per day',
      'Up to $1,000 per 15 days',
      'Up to $1,000 per 30 days',
      'Up to $3,000 per 6 months',
    ],
  },
  TIER2: {
    description: 'Limit for Level 2 customers:',
    limit: [
      'Up to $2,999 per transaction',
      'Up to $2,999 per day',
      'Up to $5,000 per 15 days',
      'Up to $5,000 per 30 days',
      'Up to $10,000 per 6 months',
    ],
  },
  TIER3: {
    description: 'Limit for Level 3 customers:',
    limit: [
      'Up to $5,000 per transaction',
      'Up to $5,000 per day',
      'Up to $10,000 per 15 days',
      'Up to $10,000 per 30 days',
      'Up to $30,000 per 6 months',
    ],
  },
};

export const VCODE_RESEND_TIME_INTERVAL = 30;
