/* istanbul ignore file */
import { format, secondsToMilliseconds } from "date-fns";

import { Directions } from "@/defi";
import { PositionEvent } from "@/types/api";
import { capitalize, formatNumber, toTokenUnit } from "@/utils/formatters";
import BigNumber from "bignumber.js";

export const createDataProvider = (recentTrades: PositionEvent[]) => {
  return recentTrades.map(({ size, entryPrice, timestamp }) => {
    console.log("recent size ", size)
    const convertedSize = BigNumber(toUSD(size));
    const convertedPrice = BigNumber(entryPrice);
    console.log("recent entry price ",entryPrice)
    const convertedDateTime = new Date(secondsToMilliseconds(timestamp));
    const direction = convertedSize.lte(0) ? Directions.Short : Directions.Long;

    return {
      id: Math.random(),
      price: priceToUSDFormat(convertedPrice.toString()),
      direction: capitalize(direction),
      directionColor:
        direction === Directions.Long ? "alert.lemon" : "alert.guava",
      size: toUSDFormat(convertedSize.abs().toString()),
      time: format(convertedDateTime, "HH:mm:ss"),
    };
  });
};

const removeDot = (number: string) => {
  let result = number.split('.').join('')
  while(result.charAt(0) === '0'){
    result = result.substring(1);
    
  }
  return result
}

const toUSD = (value: string) => {
    if(value.includes('.')){
      let sValue = value.split('.')
      let decimals = sValue.slice(0,6)
      return [sValue[0],decimals].join('.')
    }else {
      return value + '000000'
    }
}

const toUSDFormat = (value: string) => {
  
  let decimals = value.slice(value.length - 2, value.length)
  let units = value.slice(0, value.length - 6)

  let beforeComma = units[0]
  let afterComma = units.slice(1, units.length)
  return ['$ ',[[beforeComma,afterComma].join(''),decimals].join('.')].join('')
}

const priceToUSDFormat = (value: string) => {
  
  let decimals = value.slice(value.length - 2, value.length)
  let units = value.slice(0, value.length - 6)

  let beforeComma = units[0]
  let afterComma = units.slice(1, units.length)
  return ['$ ',[[beforeComma,afterComma].join(''),decimals].join('.')].join('')
}
