import BigNumber from "bignumber.js";
import { utils } from "ethers";


import { getPair } from "@/defi";
import { useStore } from "@/stores/root";
import { formatNumber, toFixedNumber, toTokenUnit } from "@/utils/formatters";

import { useEffect } from "react";
import { isSidebarInputsEnabled } from "../TradingSidebar.slice";
import {
  calculateBaseAmount,
  calculateQuoteAmount,
  convertBaseToQuoteAmount,
  convertQuoteToBaseAmount,
} from "./helpers";

export default function useAssetAmount() {
  const { pairId } = useStore((state) => state.markets);
  const {
    balance: balanceValue,
    amounts: { base, baseValue, quote, quoteValue },
    setAmounts,
  } = useStore((state) => state.tradingSidebar);
  const { underlyingPrice } = useStore((state) => state.amm);
  const sidebarInputsEnabled = useStore(isSidebarInputsEnabled);
  const exchangeRate = new BigNumber(formatPrice(underlyingPrice));
  let balance = <BigNumber>balanceValue;
  
  const [baseProduct, quoteProduct] = getPair(pairId).productIds;
  
  const formattedBalance = `Balance: ${formatNumber(balance, {
    productId: quoteProduct,
  })}`;
  const commonProps = {
    InputProps: {
      inputProps: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        step: 0.01,
      },
    },
    alignEnd: true,
    disabled: !sidebarInputsEnabled,
    type: "number",
    placeholder: "0",
  };

  // calculate quote amount from base amount and mark price
  // TODO: the terms of base/quote used in the application are the opposite, this needs to be fixed
  useEffect(() => {
    if (baseValue.eq(0)) return;

    const baseAmount = toFixedNumber(quoteValue.dividedBy(exchangeRate));

    setAmounts(utils.formatUnits(BigNumber(baseAmount).toFixed(0),18), quote);
  }, [underlyingPrice]);

  const handleMaxClick = () => {
    const baseAmount = toFixedNumber(balance.dividedBy(exchangeRate));
    const quoteAmount = toFixedNumber(balance);

    setAmounts(utils.formatUnits(baseAmount,18), quoteAmount);
  };

  const handleBaseAmountChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const baseAmount = calculateBaseAmount(value, balance, exchangeRate);
    const quoteAmount = convertBaseToQuoteAmount(
      baseAmount,
      balance,
      exchangeRate
    );
    let formatedAmount = ''
    
    if(baseAmount == '0' || value == ''){
      formatedAmount = '0'
    } else {
      formatedAmount = baseAmount
    }
    
    setAmounts(formatedAmount, quoteAmount);
  };

  const handleQuoteAmountChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const quoteAmount = calculateQuoteAmount(value, balance);
    const baseAmount = convertQuoteToBaseAmount(
      quoteAmount,
      balance,
      exchangeRate
    );
    setAmounts(baseAmount, quoteAmount);
  };

  return {
    base,
    quote,
    balance,
    baseProduct,
    quoteProduct,
    formattedBalance,
    commonProps,
    handleMaxClick,
    handleBaseAmountChange,
    handleQuoteAmountChange,
  };
}

const formatPrice = (price: string) =>{
    let splitPrice = price.split('.')
    if(splitPrice[1] == undefined){
      return price
    }
    if(splitPrice[1].length < 6){
      splitPrice[1] = splitPrice[1] + '0'.repeat(6 - splitPrice[1].length)
    }
    return [splitPrice[0], splitPrice[1]].join('.')
}
