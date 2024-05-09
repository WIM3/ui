import { Amm } from "@/types/api";
import {
  formatPercentage,
  formatUsdValue,
  toTokenUnit,
} from "@/utils/formatters";
import { AppState, CustomStateCreator } from "../../types";
import { handleError } from "../slices.utils";
import { BtcUsdPriceId, EthUsdPriceId, SolUsdPriceId, isEthUsPriceFeed } from "@/v2-integration/utils";
import { fetchPriceEthUsdHistory } from "@/v2-integration/fetchPriceHistory";
import { fetchCurrentBtcUsdPriceFromPythNetwork, fetchCurrentEthUsdPriceFromPythNetwork } from "@/v2-integration/fetchTokenPrice";
import { secondsToMilliseconds } from "date-fns";
import { getInitialState, useStore } from "@/stores/root";

const getDefaultData = () => ({
  id: "",
  quoteAsset: "",
  priceFeedKey: "",
  fundingPeriod: 0,
  fundingBufferPeriod: 0,
  lastFunding: 0,
  fundingRate: "",
  tradeLimitRatio: "",
  tradingVolume: "",
  underlyingPrice: "",
  dataFeedId: "",
  price: 0,
  nextFunding: 0,
  baseAssetReserve: "",
  quoteAssetReserve: "",
});



export interface AmmSlice {
  amm: Amm & {
    setAmmInfo: (ammAddr: string) => void;
    clear: () => void;
  };
}


export const createAmmSlice: CustomStateCreator<AmmSlice> = (set, get) => (
  
  {
  amm: {
    ...getDefaultData(),

    setAmmInfo: (ammAddr: string) => {
      let amm: Amm;
      if(parseInt(ammAddr) == parseInt(EthUsdPriceId)){
        fetchCurrentEthUsdPriceFromPythNetwork().then((ethUsdPrice: number) => { 
          amm = {
            baseAssetReserve: "0",
            dataFeedId: EthUsdPriceId,
            fundingBufferPeriod: 3600,
            fundingPeriod: 3600,
            fundingRate: "0",
            id: EthUsdPriceId,
            lastFunding: 0,
            nextFunding: 0,
            price: ethUsdPrice,
            priceFeedKey: EthUsdPriceId,
            quoteAsset: "USD",
            quoteAssetReserve: "0",
            tradeLimitRatio: "0",
            tradingVolume: "0",
            underlyingPrice: ethUsdPrice.toString(),
          };

          set(function setAmmInfo(state: AppState) {

            state.amm = { ...state.amm, ...amm };
          });
      });  
    }
    if(parseInt(ammAddr) == parseInt(BtcUsdPriceId)){
      fetchCurrentBtcUsdPriceFromPythNetwork().then((btcUsdPrice: number) => { 
        amm = {
          baseAssetReserve: "0",
          dataFeedId: BtcUsdPriceId,
          fundingBufferPeriod: 3600,
          fundingPeriod: 3600,
          fundingRate: "0",
          id: BtcUsdPriceId,
          lastFunding: 0,
          nextFunding: 0,
          price: btcUsdPrice,
          priceFeedKey: BtcUsdPriceId,
          quoteAsset: "USD",
          quoteAssetReserve: "0",
          tradeLimitRatio: "0",
          tradingVolume: "0",
          underlyingPrice: btcUsdPrice.toString(),
        };

        set(function setAmmInfo(state: AppState) {

          state.amm = { ...state.amm, ...amm };
        });
    });
    }

    if(parseInt(ammAddr) == parseInt(SolUsdPriceId)){
      fetchCurrentBtcUsdPriceFromPythNetwork().then((solUsdPrice: number) => { 
        amm = {
          baseAssetReserve: "0",
          dataFeedId: SolUsdPriceId,
          fundingBufferPeriod: 3600,
          fundingPeriod: 3600,
          fundingRate: "0",
          id: SolUsdPriceId,
          lastFunding: 0,
          nextFunding: 0,
          price: solUsdPrice,
          priceFeedKey: SolUsdPriceId,
          quoteAsset: "USD",
          quoteAssetReserve: "0",
          tradeLimitRatio: "0",
          tradingVolume: "0",
          underlyingPrice: solUsdPrice.toString(),
        };

        set(function setAmmInfo(state: AppState) {

          state.amm = { ...state.amm, ...amm };
        });
    });
    }
      
      
      
    },

    clear: () => {
      set(function clear(state: AppState) {
        state.amm = {
          ...state.amm,
          ...getDefaultData(),
        };
      });
    },
  },
});

export const getTopBarValues = (state: AppState) => {
  const indexPrice = formatUsdValue(state.amm.price || 0);
  const rawTotalVolume = toTokenUnit(state.amm.tradingVolume);
  const totalVolume = formatUsdValue(rawTotalVolume);
  const rawFundingRate = toTokenUnit(state.amm.fundingRate);
  const fundingRate = formatPercentage(rawFundingRate, 4);
  const nextFundingMillis = secondsToMilliseconds(state.amm.nextFunding || 0);
  const now = new Date().getTime();
  const countDownMillis = Math.max(nextFundingMillis - now, 0);

  return {
    indexPrice,
    totalVolume,
    fundingRate,
    countDownMillis,
  };
};

export const isIndexPriceValid = (state: AppState) => {
  return !!state.amm.price;
};

export const isMarkPriceValid = (state: AppState) => {
  const markPrice = toTokenUnit(state.amm.underlyingPrice);
  return markPrice.gt(0);
};

export const isAmmInfoValid = ({ amm: { id, dataFeedId } }: AppState) => {
  return (!id && !dataFeedId) || (!!id && !!dataFeedId);
};

