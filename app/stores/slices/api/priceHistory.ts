import { PriceUpdate } from "@/types/api";
import { AppState, CustomStateCreator } from "../../types";
import { calculateChange, calculateChangePercentage } from "@/utils/calcs";
import { toTokenUnit } from "@/utils/formatters";
import { handleError } from "../slices.utils";
import { fetchPriceEthUsdHistory } from "@/v2-integration/fetchPriceHistory";
import { isEthUsPriceFeed } from "@/v2-integration/utils";

interface PriceHistoryProps {
  latest: string;
  feed: PriceUpdate[];
  ready: boolean;
}

export interface PriceHistorySlice {
  priceHistory: PriceHistoryProps & {
    setPriceFeed: () => void;
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

    setPriceFeed: () => {
      fetchPriceEthUsdHistory().then((data) => { 
          set(function setPriceFeed(state: AppState) {
            const [latest] = data.slice(-1);
            state.priceHistory.latest = latest?.price || "0";
            state.priceHistory.feed = data;
            state.priceHistory.ready = true;
          });
      });
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
