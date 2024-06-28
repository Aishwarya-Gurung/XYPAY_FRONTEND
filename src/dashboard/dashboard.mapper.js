import sl from 'components/selector/selector';

export const transactionMapper = sl.object({
  result: sl.list(
    sl.object({
      status: sl.string(''),
      remarks: sl.string(''),
      feeAmount: sl.number(),
      createdAt: sl.string(''),
      senderAmount: sl.number(),
      exchangeRate: sl.number(),
      referenceId: sl.string(''),
      payoutMethod: sl.string(),
      fundingSource: sl.string(''),
      recipientAmount: sl.number(),
      threeDSStatus: sl.string(''),
      deliveryStatus: sl.string(''),
      referenceNumber: sl.string(''),
      remittancePurpose: sl.string(''),
      recipientCurrency: sl.string(''),
      receiptNumber: sl.string('PENDING'),
      senderFundingSourceAccountId: sl.string(''),
      beneficiary: sl.object({
        fullName: sl.string(''),
        referenceId: sl.string(''),
        address: sl.object({
          city: sl.string(''),
          state: sl.string(''),
          country: sl.string(''),
          postalCode: sl.string(''),
          addressLine2: sl.string(''),
          addressLine1: sl.string(''),
        }),
        bank: sl.object({
          bankName: sl.string(''),
          currency: sl.string(''),
          referenceId: sl.string(''),
          accountType: sl.string(''),
          accountNumber: sl.string(''),
        }),
        payer: sl.object({
          name: sl.string(''),
          code: sl.string(''),
          website: sl.string(''),
          country: sl.string(''),
          address: sl.string(''),
          referenceId: sl.number(),
          phoneNumber: sl.string(''),
          receivingCurrency: sl.string(''),
        }),
        wallet: sl.object({
          identificationType: sl.string(''),
          identificationValue: sl.string(''),
          referenceId: sl.string(''),
        }),
      }),
    })
  ),
  paging: sl.object({
    page: sl.number(),
    pageSize: sl.number(),
    totalCount: sl.number(),
  }),
});
