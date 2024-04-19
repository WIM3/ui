import BigNumber from "bignumber.js";

import { toFixedNumber } from "@/utils/formatters";

export const calculateBaseAmount = (
  amount: string,
  balance: BigNumber,
  exchangeRate: BigNumber | number
) => {
  const baseAmount = new BigNumber(amount);
  const maxBaseAmount = balance.dividedBy(exchangeRate);

  return baseAmount.isGreaterThan(maxBaseAmount)
    ? maxBaseAmount.toString()
    : amount;
};

export const calculateQuoteAmount = (amount: string, balance: BigNumber) => {
  const bigNumAmount = new BigNumber(amount);

  return bigNumAmount.isGreaterThan(balance) ? toFixedNumber(balance) : amount;
};

export const convertQuoteToBaseAmount = (
  quoteAmount: string,
  balance: BigNumber,
  exchangeRate: BigNumber | number
) => {
  const convertedAmount = new BigNumber(quoteAmount).dividedBy(exchangeRate);
  console.log("conv amount ", convertedAmount.toString())
  const maxAmount = balance.dividedBy(exchangeRate);
  console.log("max amount ", maxAmount.toString())
  return BigNumber.min(convertedAmount, maxAmount).toString();
};

export const convertBaseToQuoteAmount = (
  baseAmount: string,
  balance: BigNumber,
  exchangeRate: BigNumber | number
) => {
  const convertedAmount = new BigNumber(baseAmount).multipliedBy(exchangeRate);

  return toFixedNumber(BigNumber.min(convertedAmount, balance));
};
