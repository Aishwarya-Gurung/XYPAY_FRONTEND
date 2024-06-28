import sl from 'components/selector/selector';

export const authMapper = sl.object({
  token: sl.string(null),
  tokenType: sl.string('Bearer'),
  roles: sl.list(sl.string('')),
});

export const senderMapper = sl.object({
  sender: sl.object({
    id: sl.number(),
    referenceId: sl.string(null),
    firstName: sl.string(null),
    middleName: sl.string(null),
    lastName: sl.string(null),
    fullName: sl.string(null),
    email: sl.string(null),
    phoneNumber: sl.string(null),
    imageUrl: sl.string(null),
    roles: sl.list(sl.string('')),
    address: sl.object({
      country: sl.string(null),
      state: sl.string(null),
      stateCode: sl.string(null),
    }),
    dateOfBirth: sl.string(null),
    gender: sl.string(null),
    senderAddress: sl.object({
      addressLine1: sl.string(null),
      city: sl.string(null),
      zipcode: sl.string(null),
    }),
  }),

  status: sl.object({
    isEmailVerified: sl.boolean(false),
    isPhoneNumberVerified: sl.boolean(false),
    isKYCVerified: sl.boolean(false),
    kycStatus: sl.string(''),
    currentTier: sl.string(''),
  }),

  provider: sl.string(''),
  isPrivacyPolicyAccepted: sl.boolean(true),
  isAccountDeleteRequested: sl.boolean(false),
});

export const adminMapper = sl.object({
  id: sl.number(),
  email: sl.string(null),
  fullName: sl.string(null),
  lastName: sl.string(null),
  imageUrl: sl.string(null),
  firstName: sl.string(null),
  middleName: sl.string(null),
  phoneNumber: sl.string(null),
  roles: sl.list(sl.string('')),
});

export const kycStatusMapper = sl.object({
  kycStatus: sl.string(''),
  isKYCVerified: sl.boolean(false),
});
