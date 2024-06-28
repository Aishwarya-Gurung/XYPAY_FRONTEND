import sl from 'components/selector/selector';

export const countryMapper = sl.object({
  result: sl.list(
    sl.object({
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
    })
  ),
});

export const stateMapper = sl.object({
  result: sl.list(
    sl.object({
      name: sl.string(''),
      code: sl.string(''),
    })
  ),
});

export const featureMapper = sl.object({
  isRecaptchaEnabled: sl.boolean(false),
  isThreeDSEnabled: sl.boolean(false),
});
