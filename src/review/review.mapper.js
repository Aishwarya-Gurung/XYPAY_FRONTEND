import sl from 'components/selector/selector';

export const transactionMapper = sl.object({});

export const errorMapper = sl.object({});

export const staticSelector = sl.object({
  t: sl.func(),
  error: sl.string(''),
  isKYCVerified: sl.boolean(false),
  resetPaymentDetails: sl.func(),

  features: sl.object({
    isThreeDSEnabled: sl.boolean(false),
  }),

  sender: sl.object({
    email: sl.string(''),
    fullName: sl.string(''),
    referenceId: sl.string(''),
    address: sl.object({
      state: sl.string(''),
      country: sl.string(''),
      stateCode: sl.string(''),
    }),
  }),

  makeTransaction: sl.func(),
  widgetToken: sl.string(''),

  beneficiary: sl.object({
    referenceId: sl.string(''),
    email: sl.string(''),
    phoneNumber: sl.string(''),
    fullName: sl.string('No beneficiary selected'),
    address: sl.object({
      addressLine1: sl.string(''),
      city: sl.string(''),
      country: sl.string(''),
      postalCode: sl.string(''),
      state: sl.string(''),
    }),
  }),

  storePaymentDetail: sl.func(),
  paymentDetail: sl.object({
    totalAmount: sl.number(),
    exchangeRate: sl.number(),
    senderBank: sl.string(''),
    sendingAmount: sl.number(),
    transactionFee: sl.number(),
    receivingAmount: sl.number(),
    senderDebitCard: sl.string(''),
    receivingCurrency: sl.string(''),
    destinationCountry: sl.string(''),
    paymentCurrency: sl.string('USD'),
    paymentMethod: sl.string('No payment method selected'),

    payerId: sl.number(),
    bankId: sl.string(''),
    beneficiaryId: sl.string(''),
    payerBankName: sl.string(''),
    payoutMethod: sl.string('No receive method selected'),
    walletId: sl.string(''),
    remittancePurpose: sl.string(''),
  }),

  beneficiaryAccount: sl.object({
    bankName: sl.string(),
    accountType: sl.string(),
    accountNumber: sl.string(),
  }),

  beneficiaryWallet: sl.object({
    identificationValue: sl.string(),
  }),

  senderAccount: sl.object({
    id: sl.string(''),

    // Bank
    name: sl.string(''),
    currency: sl.string(''),
    accountType: sl.string(''),
    accountHolderName: sl.string(''),
    verificationStatus: sl.string(''),

    // Card
    nickName: sl.string(''),
    senderId: sl.string(''),
    institutionName: sl.string(''),
    fundingSourceName: sl.string(''),
  }),

  payers: sl.list(
    sl.object({
      name: sl.string(''),
      logo: sl.string(''),
      address: sl.string(''),
      referenceId: sl.number(),
      payingEntity: sl.string(),
      receivingCurrency: sl.string(),
    })
  ),

  getFeeRange: sl.func(),
  feeSets: sl.list(
    sl.object({
      currency: sl.string(''),
      payoutMethod: sl.string(''),
      paymentMethod: sl.string(''),
      feeRanges: sl.list(
        sl.object({
          minAmount: sl.number(0),
          maxAmount: sl.number(0),
          flatFee: sl.number(0),
          percentageFee: sl.number(0),
        })
      ),
      sourceCountry: sl.object({
        name: sl.string(''),
        flagUrl: sl.string(''),
        phoneCode: sl.string(''),
        twoCharCode: sl.string(''),
        threeCharCode: sl.string(''),
      }),
      destinationCountry: sl.object({
        name: sl.string(''),
        flagUrl: sl.string(''),
        phoneCode: sl.string(''),
        twoCharCode: sl.string(''),
        threeCharCode: sl.string(''),
      }),
    })
  ),

  isCreatingTransaction: sl.boolean(false),
  transaction: sl.object({
    createdAt: sl.string(''),
    referenceId: sl.string(''),
    fundingSource: sl.string(''),
    threeDSStatus: sl.string(''),
    referenceNumber: sl.string(''),
    expectedAvailability: sl.string('3'),
  }),

  recipientDetail: sl.object({
    recipient: sl.string(''),
    payerId: sl.number(),
    bankId: sl.string(''),
    remittancePurpose: sl.string(''),
    paymentReceiveMethod: sl.string('No receive method selected'),
  }),

  receipiantAccount: sl.object({
    bankName: sl.string(),
    accountType: sl.string(),
    branchName: sl.string(''),
    accountNumber: sl.string(),
  }),
});
