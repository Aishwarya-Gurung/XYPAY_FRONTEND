import { LS_KEY } from 'auth';
import * as http from './http.api';
import { withError, withData, securedLS, serializeObjectToQuery } from 'utils';

const resolveResponse = true;

export const login = (loginCredentials) => {
  return http.post(`/auth/signin`, loginCredentials);
};

export const verifyOTPCode = (OTPCode, deviceId) => {
  return http.post(`/devices/${deviceId}/verify`, { device: OTPCode });
};

export const logout = () => {
  return http.get(`/auth/signout`);
};

export const fetchGuestInfo = () => {
  return http.get(`/auth/guest`);
};

export const oauth2Signup = (senderInfo) => {
  return http.post(`/auth/oauth`, senderInfo);
};

export const sendPhoneVerificationCode = (contact) => {
  return http.post(`/auth/users/phone/${contact}`);
};

export const sendEmailVerificationCode = (contact) => {
  return http.post(`/auth/users/email/${contact}`);
};

export const verifyPhoneOTP = (contact, token) => {
  return http.get(`/auth/verify/phone/${contact}/otp/${token}`);
};

export const verifyEmailOTP = (contact, token) => {
  return http.get(`/auth/verify/email/${contact}/otp/${token}`);
};

export const verifySenderPhoneOTP = (contact, token) => {
  return http.get(`/auth/users/verify/phone/${contact}/otp/${token}`);
};

export const verifySenderEmailOTP = (contact, token) => {
  return http.get(`/auth/users/verify/email/${contact}/otp/${token}`);
};

export const fetchSenderInfo = () => {
  return http.get(`/senders`);
};

export const fetchAdminInfo = () => {
  return http.get(`/admin`);
};

export const signup = (senderDetails) => {
  return http.post(`/auth/users/create`, senderDetails);
};

export const verifyEmail = (verificationToken) => {
  return http.get(`/auth/verify/email/${verificationToken}`);
};

export const forgotPassword = (email) => {
  return http.post('/auth/forgot-password', { email });
};

export const resetPassword = (requestBody) => {
  const { oldPassword, newPassword, token } = requestBody;

  if (token) {
    return http.put(`/auth/reset-password/${token}`, { newPassword });
  }

  return http.put('/auth/reset-password', { newPassword, oldPassword });
};

export const fetchStates = (country) => {
  return http.get(`states/${country}`);
};

export const fetchDestinationCountry = (sourceCountry) => {
  return http.get(`/countries/${sourceCountry}/destinations`);
};

export const fetchSourceCountry = () => {
  return http.get(`/countries`);
};

export const resendEVerificationLink = () => {
  return http.get(`/auth/resend-verification/email`);
};

export const updateKYCStatus = (status) => {
  return http.post(`/senders/kyc-status`, { status });
};

export const updateSenderDetails = (senderDetails) => {
  return http.patch(`/senders/sender-detail`, senderDetails);
};

export const updateKYCInfo = (kycDetails) => {
  return http.patch(`/senders/kyc-info`, kycDetails);
};

export const initiateKYC = () => {
  return http.post(`senders/initiate-kyc`);
};

export const createBeneficiary = (beneficiary) => {
  return http.post(`/senders/beneficiaries`, beneficiary);
};

export const updateBeneficiary = (beneficiaryId, beneficiary) => {
  return http.put(
    `/senders/beneficiaries/update/${beneficiaryId}`,
    beneficiary
  );
};

export const removeBeneficiary = (beneficiaryId) => {
  return http.remove(`/senders/beneficiaries/${beneficiaryId}`);
};

export const fetchBeneficiaryList = () => {
  return http.get(`/senders/beneficiaries`);
};

export const fetchSenderBanks = () => {
  return http.get(`/senders/banks`);
};

export const fetchSenderDebitCards = () => {
  return http.get(`/senders/cards`);
};

export const deleteUserAccount = () => {
  return http.remove(`/senders`);
};

export const updatePrivacyPolicy = () => {
  return http.patch(`/senders/privacy-policy/accept`);
};

export const fetchBeneficiaryBanksByCountry = (country) => {
  return http.get(`/banks/${country}`);
};

export const fetchBeneficiaryBanks = (country, currency) => {
  return http.get(`/banks?country=${country}&currency=${currency}`);
};

export const createBeneficiaryBank = (bank) => {
  return http.post(`/senders/beneficiaries/bank`, bank);
};

export const verifyPNumber = (verificationCode) => {
  return http.get(`/auth/verify/phone/${verificationCode.toString()}`);
};

export const resendPVerificationCode = () => {
  return http.get(`/auth/resend-verification/phone`);
};

export const fetchExchangeRate = () => {
  return http.get(`/exchange-rate`);
};

export const createFeeSet = (feeSet) => {
  return http.post(`/fees`, feeSet);
};

export const fetchFeeSet = () => {
  return http.get(`/fees`);
};

export const fetchLockedSenders = (filter) => {
  return http.get(`/senders/locked${serializeObjectToQuery(filter)}`);
};

export const filterLockedSenders = (filter, payload) => {
  return http.post(
    `/senders/locked/search${serializeObjectToQuery(filter)}`,
    payload
  );
};

export const fetchUnlockSender = (senderReferenceId) => {
  return http.get(`/senders/${senderReferenceId}/unlock`);
};

export const fetchTxnAmountLimit = () => {
  return http.get(`/senders/transactions/limit`);
};

export const fetchCancelTransaction = (transactionId) => {
  return http.get(`/senders/transactions/${transactionId}`);
};

export const refreshAccessToken = () => {
  return http.post(`/auth/token`, {
    referenceToken: securedLS.get(LS_KEY.TOKEN).data,
    device: securedLS.get(LS_KEY.DEVICE_FINGER_PRINT).data,
  });
};

export const removeSenderBank = (bankId) => {
  return http.remove(`/senders/banks/${bankId}`);
};

export const removeSenderDebitCard = (cardId) => {
  return http.remove(`/senders/cards/${cardId}`);
};

export const fetchPayerList = (country) => {
  return http.get(`/payers?country=${country}`);
};

export const sendNotificationToBeneficiary = () => {
  const notification = new Promise((resolve) => {
    setTimeout(() => {
      if (resolveResponse) {
        resolve('notified');
      }
    }, 500);
  });

  return notification
    .then((res) => withData(res))
    .catch((error) => withError(error));
};

export const fetchFetchSourceDestinationCountry = () => {
  return http.get(`/countries/corridors`);
};

export const fetchLicense = (state) => {
  return http.get(`/license/${state}`);
};

export const syncSenderName = () => {
  return http.post(`/senders/current-user/sync-name`);
};

export const updateProvider = () => {
  return http.patch(`/senders/provider`);
};

const getEventSource = () => {
  if (window.EventSource !== undefined) {
    return window.EventSource;
  }
};

export const subscribeServerEvent = (userId) => {
  const ES = getEventSource();

  if (ES) {
    return new ES(
      `${process.env.REACT_APP_BASE_URL}/events/subscribe?channel=${userId}`
    );
  }
};

export const fetchDevices = () => {
  return http.get(`/devices`);
};

export const removeDevice = (deviceId) => {
  return http.remove(`/devices/${deviceId}`);
};

export const resendOTPCode = (deviceId) => {
  return http.post(`/devices/${deviceId}/resend-verification-code`);
};

export const createBeneficiaryWallet = ({
  beneficiaryId,
  identificationValue,
}) => {
  return http.post(`/senders/beneficiaries/${beneficiaryId}/wallets`, {
    identificationValue,
  });
};

export const fetchBeneficiaryWallets = (beneficiaryId) => {
  return http.get(`/senders/beneficiaries/${beneficiaryId}/wallets`);
};

export const fetchAccountDeletionRequests = () => {
  return http.get(`/senders/account-deletion-requests`);
};

export const revertDeleteRequest = (senderReferenceId, body) => {
  return http.post(
    `/senders/revert-account-deletion/${senderReferenceId}`,
    body
  );
};
