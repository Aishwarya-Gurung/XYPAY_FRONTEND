import sl from '../components/selector/selector';

export const senderMapper = sl.object({
  result: sl.list(
    sl.object({
      id: sl.number(0),
      fullName: sl.string(''),
      email: sl.string(''),
      phoneNumber: sl.string(''),
      imageUrl: sl.string(''),
      referenceId: sl.string(''),
      lockedReason: sl.string(''),
    })
  ),
  paging: sl.object({
    page: sl.number(0),
    pageSize: sl.number(0),
    totalCount: sl.number(0),
  }),
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

export const sourceDestinationCountryMapper = sl.object({
  result: sl.list(
    sl.object({
      id: sl.number(0),
      source: sl.object({
        name: sl.string(''),
        threeCharCode: sl.string(''),
        twoCharCode: sl.string(''),
        phoneCode: sl.string(''),
        flagUrl: sl.string(''),
        currency: sl.list(
          sl.object({
            name: sl.string(''),
            code: sl.string(''),
            symbol: sl.string(''),
          })
        ),
      }),
      destination: sl.object({
        name: sl.string(''),
        threeCharCode: sl.string(''),
        twoCharCode: sl.string(''),
        phoneCode: sl.string(''),
        flagUrl: sl.string(''),
        currency: sl.list(
          sl.object({
            name: sl.string(''),
            code: sl.string(''),
            symbol: sl.string(''),
          })
        ),
        payoutMethod: sl.object({
          isBankDepositEnabled: sl.boolean(false),
          isCashPickupEnabled: sl.boolean(false),
          isHomeDeliveryEnabled: sl.boolean(false),
          isMobileWalletEnabled: sl.boolean(false),
        }),
      }),
    })
  ),
});
