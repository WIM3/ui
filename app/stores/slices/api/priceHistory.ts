import { PriceUpdate } from "@/types/api";
import { AppState, CustomStateCreator } from "../../types";

import { calculateChange, calculateChangePercentage } from "@/utils/calcs";
import { toTokenUnit } from "@/utils/formatters";
import { handleError } from "../slices.utils";

interface PriceHistoryProps {
  latest: string;
  feed: PriceUpdate[];
  ready: boolean;
}

export interface PriceHistorySlice {
  priceHistory: PriceHistoryProps & {
    setPriceFeed: (feed: { history: PriceUpdate[] }) => void;
    setReady: (ready: boolean) => void;
    clear: () => void;
  };
}

export const createPriceHistorySlice: CustomStateCreator<PriceHistorySlice> = (
  set,
  get
) => ({
  priceHistory: {
    latest: "0",
    feed: [],
    ready: false,

    setPriceFeed: (feed: { history: PriceUpdate[] }) => {
      // SKIP Error return from API via WEBSOCKET because we added manually ETH/USD in the front
      if (typeof feed === "string" && (feed as string).includes("0x5e463a709e58088ed5f08ee3ab6953ae8f046889")) {
        fetchCurrentEthUsdPriceFromPythNetwork().then((data) => { 
          set(function setPriceFeed(state: AppState) {
            const [latest] = data.slice(-1);
            state.priceHistory.latest = latest?.price || "0";
            state.priceHistory.feed = data;
            state.priceHistory.ready = true;
          });
        });
      } else {
        if (handleError(get(), feed)) {
          return;
        }
   
        set(function setPriceFeed(state: AppState) {
          const [latest] = feed.history.slice(-1);
          state.priceHistory.latest = latest?.price || "0";
          state.priceHistory.feed = feed.history;
          state.priceHistory.ready = true;
        });
      }

    },

    setReady: (ready: boolean) => {
      set(function setReady(state: AppState) {
        state.priceHistory.ready = ready;
      });
    },

    clear: () => {
      get().priceHistory.setReady(false);

      set(function clear(state: AppState) {
        state.priceHistory.latest = "0";
        state.priceHistory.feed = [];
      });
    },
  },
});

export const getHistoryData = (state: AppState) => {
  return state.priceHistory.feed.map(({ price, timestamp }) => {
    const convertedPrice = toTokenUnit(price).toNumber();

    return {
      time: timestamp,
      value: convertedPrice,
    };
  });
};

export const getLatestPriceInfo = (state: AppState) => {
  const [penultimate] = state.priceHistory.feed.slice(-2, -1);
  const penultimatePrice = toTokenUnit(penultimate?.price);
  const lastPrice = toTokenUnit(state.priceHistory.latest);
  const change = calculateChange(lastPrice, penultimatePrice);
  const percentageChange = change
    ? calculateChangePercentage(lastPrice, penultimatePrice).toNumber()
    : 0;

  return {
    lastPrice,
    change,
    percentageChange,
  };
};



const fetchCurrentEthUsdPriceFromPythNetwork = async (): Promise<Array<PriceUpdate>> => { 
  const symbol = 'Crypto.ETH/USD'
  const timeframe = '1D'
  const from = Math.floor(new Date('2023-09-01').getTime()/1000).toString()
  const to =  (Math.floor(Date.now()/1000)).toString()
  const url = `https://benchmarks.pyth.network/v1/shims/tradingview/data_integration/history?symbol=${symbol}&resolution=${timeframe}&from=${from}&to=${to}`

  const response = await fetch(url)
  const data = await response.json()
  /*
   data structure:
   {
    s: "ok",
    t: numbers[] (timestamps),
    c: numbers[] (close prices),
   }

   We only need an array of objects with the following structure:
   {
      timestamp: number (timestamp),
      price: string
   }
   */
  return data.t.map((timestamp: number, index: number) => { 
    return {
      timestamp,
      price: data.c[index].toString()
    }
  });
};