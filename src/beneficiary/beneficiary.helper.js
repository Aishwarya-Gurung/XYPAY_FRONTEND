import { WALLET_PAYOUT_CURRENCY } from 'beneficiary/beneficiary.constant.js';

export const isPayoutCurrencyAvailable = (currency) => {
  return WALLET_PAYOUT_CURRENCY.includes(currency);
};
