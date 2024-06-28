import bigdecimal from 'bigdecimal';

import { getMinValueFrom } from 'utils';
import { COUNTRY, TXN_AMOUNT } from 'app';

export const getMinumumFee = (sendingAmount, feeSets, selectedCountry) => {
  const filteresFeeSets = getFeeSets(feeSets, selectedCountry);
  const feeRanges = getFeeRanges(sendingAmount, filteresFeeSets);
  const fees = calculateTransferFees(feeRanges, sendingAmount);

  return fees.length ? getMinValueFrom(fees) : 0;
};

export const getFeesWithDetail = (args) => {
  const { sendingAmount, feeSets, selectedCountry, currency } = args;

  let filteredFeeSets = getFeeSets(feeSets, selectedCountry);

  filteredFeeSets = getTransferFeesByCurrency(filteredFeeSets, currency);

  return filteredFeeSets.filter((feeSet) => {
    const feeRange = getFeeRange(sendingAmount, feeSet.feeRanges) || {};

    if (Object.keys(feeRange).length) {
      feeSet.fee = getTotalFee(sendingAmount, feeRange);

      return feeSet;
    }

    return null;
  });
};

const getTotalFee = (sendingAmount, feeRange) => {
  const flatFee = new bigdecimal.BigDecimal(feeRange.flatFee.toString());
  const totalAmount = new bigdecimal.BigDecimal(sendingAmount.toString());
  const percentageFee = new bigdecimal.BigDecimal(
    feeRange.percentageFee.toString()
  );

  return percentageFee
    .divide(new bigdecimal.BigDecimal(100))
    .multiply(totalAmount)
    .setScale(2, new bigdecimal.RoundingMode.HALF_UP())
    .add(flatFee)
    .floatValue();
};

const getFeeSets = (feeSets, selectedCountry) => {
  return (
    feeSets.filter(
      (feeSet) =>
        selectedCountry.threeCharCode ===
          feeSet.destinationCountry.threeCharCode &&
        COUNTRY.USA === feeSet.sourceCountry.threeCharCode
    ) || []
  );
};

const getFeeRanges = (sendingAmount, feeSets) => {
  return feeSets.reduce((feeRanges, feeSet) => {
    const feeRange = getFeeRange(sendingAmount, feeSet.feeRanges);

    if (feeRange) {
      feeRanges.push(feeRange);
    }

    return feeRanges;
  }, []);
};

const getFeeRange = (sendingAmount, feeRanges) => {
  return feeRanges.find(
    (feeRange) =>
      sendingAmount >= feeRange.minAmount && sendingAmount <= feeRange.maxAmount
  );
};

const calculateTransferFees = (feeRanges, sendingAmount) => {
  let flatFee, percentageFee;
  const totalAmount = new bigdecimal.BigDecimal(sendingAmount);

  return (
    feeRanges.map((feeRange) => {
      flatFee = new bigdecimal.BigDecimal(feeRange.flatFee.toString());
      percentageFee = new bigdecimal.BigDecimal(
        feeRange.percentageFee.toString()
      );

      return percentageFee
        .divide(new bigdecimal.BigDecimal(100))
        .multiply(totalAmount)
        .setScale(2, new bigdecimal.RoundingMode.HALF_UP())
        .add(flatFee)
        .floatValue();
    }) || []
  );
};

export const getMinFeeSetAmount = (feeSets, selectedCountry, currency) => {
  const filteredFeeSets = getFeeSets(feeSets, selectedCountry);
  const filteredFeeSetsByDestinationCurrency = getTransferFeesByCurrency(
    filteredFeeSets,
    currency
  );
  const minAmounts = findMinTxnAmount(filteredFeeSetsByDestinationCurrency);

  return minAmounts.length ? getMinValueFrom(minAmounts) : TXN_AMOUNT.MIN;
};

const findMinTxnAmount = (feeSets) => {
  return feeSets.reduce((minAmounts, feeSet) => {
    feeSet.feeRanges.forEach((feeRange) => {
      minAmounts.push(feeRange.minAmount);
    });

    return minAmounts;
  }, []);
};

const getTransferFeesByCurrency = (transferFeesDetail, currency) => {
  return transferFeesDetail.filter((fee) => fee.currency === currency) || [];
};
