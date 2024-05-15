import * as R from "ramda";

import {
  Directions,
  getPair,
  mapOriginalPositionStatus,
  OriginalPositionChangeStatuses,
  PairId,
  PositionChangeStatuses,
} from "@/defi";
import { AppState } from "@/stores/types";
import { Position } from "@/types/api";
import {
  capitalize,
  formatNumber,
  formatPair,
  formatUsdValue,
  toTokenUnit,
} from "@/utils/formatters";
import BigNumber from "bignumber.js";
import { format, secondsToMilliseconds } from "date-fns";
import {
  HistoryGridData,
  NotificationHistoryData,
  PositionGridData,
  UserPositionData,
  UserPositionEvent,
} from "./userPositions.types";
import { BtcUsdPriceId, EthUsdPriceId, SolUsdPriceId } from "@/v2-integration/utils";

export const transformPositions = (
  positions: Position[],
  state: AppState
): UserPositionData[] => {
  return positions
    .map(({ position }) => ({
      ...position,
      pairId: state.markets.getPairName(position.amm) as PairId,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const transformHistory = (
  positions: Position[],
  state: AppState
): UserPositionEvent[] => {
  return positions
    .reduce((target: UserPositionEvent[], { position, history }) => {
      const enhancedHistory = history.map((current, idx) => {
        const isMarginChanging =
          current.type === OriginalPositionChangeStatuses.MarginChangin;
        const isClosing = current.type === OriginalPositionChangeStatuses.Closing;
        const prevEntry =
          (isMarginChanging || isClosing) && idx > 0 ? history[idx - 1] : {};
        const defaultProps = {
          ...prevEntry,
          amm: position.amm,
          pairId: state.markets.getPairName(position.amm),
        };
        const additionalProps = isClosing
          ? R.pick(["timestamp", "type"], current)
          : current;

        return {
          ...defaultProps,
          ...additionalProps,
        } as UserPositionEvent;
      });

      return [...target, ...enhancedHistory];
    }, [])
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const createPositionGridData = (
  positions: UserPositionData[],
  closeEvents: string[]
): PositionGridData[] => {
  const activePositions = positions.filter((position) => {
    return position.active === true;
  });

  return activePositions.map((position) => {
    let pair = getPair(PairId.ETHUSDC);;
    if(parseInt(position.amm) == parseInt(BtcUsdPriceId)){
        pair = getPair(PairId.BTCUSDC);
    } else if(parseInt(position.amm) == parseInt(SolUsdPriceId)){
        pair = getPair(PairId.SOLUSDC);
    }
    const [baseCcy, quoteCcy] = pair.productIds;
    const size = toTokenUnit(position.size);
    const direction = size.lt(0) ? Directions.Short : Directions.Long;
    const leverage = position.leverage;
    const entryPrice = new BigNumber(position.entryPrice);
    const openNotional = toTokenUnit(position.openNotional);
    const markPrice = position.underlyingPrice;
    console.log("mark price ", markPrice)
    const timestamp = secondsToMilliseconds(position.timestamp);
    const baseSize = formatNumber(size.abs(), {
      productId: baseCcy,
    });
    
    const quoteSize = openNotional;
    const formattedQuoteSize = formatNumber(quoteSize, {
      productId: quoteCcy,
    });
    const liquidationPrice = formatUsdValue(
      openNotional.multipliedBy(new BigNumber(process.env.LIQ_FEE_RATIO!))
    );
    const profitAndLoss = toTokenUnit(position.unrealizedPnl,6);
    const formattedProfitAndLoss = toUSDWithDot(profitAndLoss.toString())
    const pnlROE = profitAndLoss.div(quoteSize).multipliedBy(100);
    const formattedPnlROE = formatNumber(pnlROE.isNaN() ? 0 : pnlROE,{base:4});
    console.log("pnl roe ", pnlROE.toString())

    return {
      pair,
      amm: position.amm,
      originalSize: position.size,
      id: pair.id,
      symbol: formatPair(pair.id),
      direction: capitalize(direction),
      originalDirection: direction,
      directionColor:
        direction === Directions.Long ? "alert.lemon" : "alert.guava",
      leverage: `${leverage}X`,
      size: `${baseSize} (${formattedQuoteSize})`,
      date: format(timestamp, "dd/MM/yyyy"),
      time: format(timestamp, "HH:mm:ss"),
      entryPrice: toUSD(entryPrice.toString(), pair == getPair(PairId.BTCUSDC)? true: false),
      markPrice: toUSD(markPrice, pair == getPair(PairId.BTCUSDC)? true: false),
      liquidationPrice,
      profitAndLoss: `${formattedProfitAndLoss} (${getPercent(pnlROE.toString())}%)`,
      originalProfitAndLoss: profitAndLoss,
      isInProfit: false,
      isClosing: closeEvents.includes(position.amm),
    };
  });
};

export const createHistoryGridData = (
  history: UserPositionEvent[]
): HistoryGridData[] => {
  return history.map((historyEntry) => {
    const pair = getPair(historyEntry.pairId);
    const [, quoteCcy] = pair.productIds;
    const size = toTokenUnit(historyEntry.size!);
    const direction = size.lt(0) ? Directions.Short : Directions.Long;
    const leverage = toTokenUnit(historyEntry.leverage);
    const entryPrice = toTokenUnit(historyEntry.entryPrice);
    const totalPrice = entryPrice.multipliedBy(size).abs();
    const fee = toTokenUnit(historyEntry.fee!);
    const timestamp = secondsToMilliseconds(historyEntry.timestamp);
    const type = mapOriginalPositionStatus(
      historyEntry.type as OriginalPositionChangeStatuses
    );
    const profitAndLoss = toTokenUnit(historyEntry.realizedPnl);

    return {
      pair,
      id: timestamp + pair.id,
      symbol: formatPair(pair.id),
      direction: capitalize(direction),
      directionColor:
        direction === Directions.Long ? "alert.lemon" : "alert.guava",
      leverage: `${formatNumber(leverage, { base: 1 })}X`,
      date: format(timestamp, "dd/MM/yyyy"),
      time: format(timestamp, "HH:mm:ss"),
      type: capitalize(type),
      amount: formatNumber(size, { base: 2 }),
      price: formatUsdValue(entryPrice),
      total: formatUsdValue(totalPrice),
      fee: formatUsdValue(fee),
      profitAndLoss: formatNumber(profitAndLoss, {
        productId: quoteCcy,
      }),
      originalProfitAndLoss: profitAndLoss,
    };
  });
};

export const createNotificationHistoryData = (
  history: UserPositionEvent[]
): NotificationHistoryData[] => {
  return history.map((historyEntry) => {
    const pair = getPair(historyEntry.pairId);
    const size = toTokenUnit(historyEntry.size!);
    const direction = size.lt(0) ? Directions.Short : Directions.Long;
    const entryPrice = toTokenUnit(historyEntry.entryPrice);
    const markPrice = toTokenUnit(historyEntry.underlyingPrice);
    const realizedPnl = toTokenUnit(historyEntry.realizedPnl!);
    const timestamp = secondsToMilliseconds(historyEntry.timestamp);
    const status = mapOriginalPositionStatus(
      historyEntry.type as OriginalPositionChangeStatuses
    );
    const isOpen = status === PositionChangeStatuses.Open;

    const commonProps = {
      id: timestamp + pair.id,
      productIds: pair.productIds,
      direction,
      status,
      rows: [
        {
          label: format(timestamp, "dd/MM/yyyy"),
          value: format(timestamp, "HH:mm:ss"),
        },
      ],
    };
    const additionalRows = isOpen
      ? [
        { label: "Entry Price", value: formatUsdValue(entryPrice) },
        { label: "Mark Price", value: formatUsdValue(markPrice) },
        { label: "Position Size", value: formatNumber(size, { base: 2 }) },
        { label: "Liq. Price (est.)", value: "" },
      ]
      : [{ label: "PnL (ROE%)", value: formatUsdValue(realizedPnl) }];

    return {
      ...commonProps,
      rows: [...commonProps.rows, ...additionalRows],
    };
  });
};

const toUSD = (value: string, isBtc: boolean) => {
  if(isBtc && value.length < 11){
    value = value + "0".repeat(11 - value.length)
  }
  let decimals = value.slice(value.length - 2, value.length)

  let units = value.slice(0, value.length - 6)

  let beforeComma = units.slice(0,units.length > 4?2:1)
  let afterComma = units.slice(units.length > 4?2:1, units.length)
  return ['$ ',[[beforeComma,afterComma].join(','),decimals].join('.')].join('')
}

const toUSDWithDot = (value: string) => {
  if(!value.includes('.')){
    return value
  }
  let sValue = value.split('.')
  let nv = new BigNumber([sValue[0], sValue[1]].join('')).div(10**12).toFixed(0).toString()
  
  let amount = nv.slice(0, nv.length-6)
  let decimals = nv.slice(nv.length-6, nv.length)
  return [amount, decimals].join('.')
}

const getPercent = (value: string) => {
    if(!value.includes(',')){
      return value
    }
    let sValue = value.split(',')
    let nValue = [sValue[0], sValue[1].slice(0, 3)].join('.')
    return nValue
}