import { TXN_AMOUNT } from '../app/app.constant';
import sl from 'components/selector/selector';

export const senderBankMapper = sl.object({
  result: sl.list(
    sl.object({
      id: sl.string(''),
      name: sl.string(''),
      currency: sl.string(''),
      accountType: sl.string(''),
      institutionName: sl.string(''),
      accountHolderName: sl.string(''),
      verificationStatus: sl.string(''),
    })
  ),
});

export const senderCardMapper = sl.object({
  result: sl.list(
    sl.object({
      id: sl.string(''),
      nickName: sl.string(''),
      senderId: sl.string(''),
      institutionName: sl.string(''),
      fundingSourceName: sl.string(''),
    })
  ),
});

export const feeSetMapper = sl.object({
  result: sl.list(
    sl.object({
      paymentMethod: sl.string(''),
      payoutMethod: sl.string(''),
      currency: sl.string(''),
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
});

export const staticSelector = sl.object({
  t: sl.func(),
  feeSets: sl.list(
    sl.object({
      paymentMethod: sl.string(''),
      payoutMethod: sl.string(''),
      currency: sl.string(''),
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
  provider: sl.string(''),
  getSenderInfo: sl.func(),
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


  error: sl.string(''),

  getFeeRange: sl.func(),
  exchangeRates: sl.list(
    sl.object({
      rate: sl.number(0),
      sourceCurrency: sl.string(''),
      destinationCurrency: sl.string(''),
    })
  ),
  getExchangeRate: sl.func(),

  storePaymentDetail: sl.func(),
  isSavingPaymentDetail: sl.boolean(false),
  isAccountDeleteRequested: sl.boolean(false),

  authLogin: sl.func(),
  toggleLoginModal: sl.func(),
  isLoggingIn: sl.boolean(false),
  isModalOpen: sl.boolean(false),
  isAuthenticated: sl.boolean(false),

  location: sl.object({
    state: sl.object({
      message: sl.string(null),
    }),
  }),

  destinationCountries: sl.list(
    sl.object({
      flagUrl: sl.string(''),
      name: sl.string(''),
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
    })
  ),

  isSigningOut: sl.boolean(),
  paymentDetail: sl.object({
    receivingCurrency: sl.string(''),
    sendingAmount: sl.number(0),
    transactionFee: sl.number(0),
    receivingAmount: sl.number(0),
  }),
});
