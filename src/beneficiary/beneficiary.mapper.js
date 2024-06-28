import sl from 'components/selector/selector';

export const beneficiaryListMapper = sl.object({
  result: sl.list(
    sl.object({
      firstName: sl.string(''),
      middleName: sl.string(''),
      lastName: sl.string(''),
      email: sl.string(''),
      fullName: sl.string(''),
      referenceId: sl.string(''),
      phoneNumber: sl.string(''),
      dateOfBirth: sl.string(''),
      isEditable: sl.boolean(false),
      isDeletable: sl.boolean(false),
      senderRelationship: sl.string(''),
      isCashPickupEnabled: sl.boolean(false),
      address: sl.object({
        addressLine1: sl.string(''),
        city: sl.string(''),
        country: sl.string(''),
        postalCode: sl.string(''),
        state: sl.string(''),
      }),
      banks: sl.list(
        sl.object({
          currency: sl.string(''),
          bankName: sl.string(''),
          referenceId: sl.string(''),
          accountType: sl.string(''),
          accountNumber: sl.string(''),
        })
      ),
      wallets: sl.list(
        sl.object({
          identificationType: sl.string(''),
          identificationValue: sl.string(''),
          referenceId: sl.string(''),
        })
      ),
    })
  ),
});

export const payerMapper = sl.object({
  result: sl.list(
    sl.object({
      name: sl.string(''),
      code: sl.string(''),
      website: sl.string(''),
      country: sl.string(''),
      address: sl.string(''),
      referenceId: sl.number(),
      phoneNumber: sl.string(''),
      payingEntity: sl.string(''),
      receivingCurrency: sl.string(''),
    })
  ),
});

export const beneficiaryMapper = sl.object({
  fullName: sl.string(''),
  referenceId: sl.string(''),
  address: sl.object({
    addressLine1: sl.string(''),
    city: sl.string(''),
    country: sl.string(''),
    postalCode: sl.string(''),
    state: sl.string(''),
  }),
});

export const stateMapper = sl.object({
  result: sl.list(
    sl.object({
      name: sl.string(''),
      code: sl.string(''),
    })
  ),
});

export const bankMapper = sl.object({
  id: sl.number(),
  name: sl.string(''),
  referenceId: sl.number(),
});

export const bankListMapper = sl.object({
  result: sl.list(
    sl.object({
      id: sl.number(),
      name: sl.string(''),
      currency: sl.string(''),
      referenceId: sl.number(),
    })
  ),
});

export const beneficiaryDetailsMapper = sl.object({
  t: sl.func(),
  beneficiaries: sl.list(
    sl.object({
      fullName: sl.string(null),
      referenceId: sl.string(null),
      isCashPickupEnabled: sl.boolean(false),

      banks: sl.list(
        sl.object({
          bankName: sl.string(''),
          currency: sl.string(''),
          referenceId: sl.string(''),
          accountType: sl.string(''),
          accountNumber: sl.string(''),
        })
      ),
      wallets: sl.list(
        sl.object({
          identificationType: sl.string(''),
          identificationValue: sl.string(''),
          referenceId: sl.string(''),
        })
      ),
    })
  ),

  payers: sl.list(
    sl.object({
      name: sl.string(''),
      logo: sl.string(''),
      address: sl.string(''),
      referenceId: sl.number(0),
      payingEntity: sl.string(''),
      receivingCurrency: sl.string(''),
    })
  ),
  getPayerList: sl.func(),

  getBeneficiaryList: sl.func(),

  isSavingPaymentDetail: sl.boolean(false),
  isBeneficiaryListFetched: sl.boolean(false),

  paymentDetail: sl.object({
    exchangeRate: sl.number(),
    sendingAmount: sl.number(),
    receivingCurrency: sl.string(''),
    paymentCurrency: sl.string('USD'),

    payerId: sl.number(),
    bankId: sl.string(''),
    walletId: sl.string(''),
    payoutMethod: sl.string(''),
    payerBankName: sl.string(''),
    beneficiaryId: sl.string(''),
    accountNumber: sl.string(''),
    cashPickupCity: sl.string(''),
    homeDeliveryCity: sl.string(''),
    remittancePurpose: sl.string(''),
  }),

  isFetchingPayers: sl.boolean(false),

  selectedCountry: sl.object({
    name: sl.string(''),
    flagUrl: sl.string(''),
    phoneCode: sl.string(''),
    twoCharCode: sl.string(''),
    threeCharCode: sl.string(''),
    currency: sl.list(
      sl.object({
        name: sl.string(''),
        code: sl.string(''),
        symbol: sl.string(''),
      })
    ),
    payoutMethod: sl.object({
      isCashPickupEnabled: sl.boolean(false),
      isBankDepositEnabled: sl.boolean(false),
      isMobileWalletEnabled: sl.boolean(false),
      isHomeDeliveryEnabled: sl.boolean(false),
    }),
  }),

  storePaymentDetail: sl.func(),

  getExchangeRate: sl.func(),
  exchangeRates: sl.list(
    sl.object({
      rate: sl.number(),
      sourceCurrency: sl.string(),
      destinationCurrency: sl.string(),
    })
  ),
});
