export const ERROR = {
  BAD_REQUEST:
    'Some error occured while creating your transaction. Please try again later.',
};

export const TRANSACTION = {
  SENDER_AMOUNT: 'senderAmount',
  SENDER_BANK_ID: 'senderBankId',
  EXCHANGE_RATE: 'exchangeRate',
  FEE_AMOUNT: 'feeAmount',
  RECIPIENT_AMOUNT: 'recipientAmount',
  RECIPIENT_ID: 'recipientId',
  RECIPIENT_BANK_ID: 'recipientBankId',
  RECIPIENT_CURRENCY: 'recipientCurrency',
  SENDER_FUNDING_ACCOUNT_ID: 'senderFundingAccountId',
};

export const BANK_STATUS = {
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  RELOGIN_REQUIRED: 'RELOGIN_REQUIRED',
};
