/* istanbul ignore file */
import { format, secondsToMilliseconds } from "date-fns";

import { Directions } from "@/defi";
import { PositionEvent } from "@/types/api";
import { capitalize, formatNumber, toTokenUnit } from "@/utils/formatters";

export const createDataProvider = (recentTrades: PositionEvent[]) => {
  return recentTrades.map(({ size, entryPrice, timestamp }) => {
    const convertedSize = toTokenUnit(removeDot(size),14);
    const convertedPrice = toTokenUnit(removeDot(entryPrice),14);
    const convertedDateTime = new Date(secondsToMilliseconds(timestamp));
    const direction = convertedSize.lte(0) ? Directions.Short : Directions.Long;

    return {
      id: Math.random(),
      price: formatNumber(convertedPrice),
      direction: capitalize(direction),
      directionColor:
        direction === Directions.Long ? "alert.lemon" : "alert.guava",
      size: formatNumber(convertedSize.abs()),
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
