import { secondsToMilliseconds } from "date-fns";
import { utils } from 'ethers'
import { Amm } from "@/types/api";
import {
  formatPercentage,
  formatUsdValue,
  toTokenUnit,
} from "@/utils/formatters";
import { AppState, CustomStateCreator } from "../../types";
import { handleError } from "../slices.utils";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

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
    setAmmInfo: (amm: Amm) => void;
    clear: () => void;
  };
}

export const createAmmSlice: CustomStateCreator<AmmSlice> = (set, get) => ({
  amm: {
    ...getDefaultData(),

    setAmmInfo: (amm: Amm) => {
      console.log("### ~ setAMMInfo:", amm);
      // SKIP Error return from API via WEBSOCKET because we added manually ETH/USD in the front
      if (typeof amm === "string" && (amm as string).includes("0x5e463a709e58088ed5f08ee3ab6953ae8f046889")) {

        fetchCurrentEthUsdPriceFromPythNetwork().then((ethUsdPrice) => { 
          amm = {
            baseAssetReserve: "0",
            dataFeedId: "0x5e463a709e58088ed5f08ee3ab6953ae8f046889",
            fundingBufferPeriod: 3600,
            fundingPeriod: 3600,
            fundingRate: "0",
            id: "0x5e463a709e58088ed5f08ee3ab6953ae8f046889",
            lastFunding: 0,
            nextFunding: 0,
            price: ethUsdPrice,
            priceFeedKey: "0x5e463a709e58088ed5f08ee3ab6953ae8f046889",
            quoteAsset: "USD",
            quoteAssetReserve: "0",
            tradeLimitRatio: "0",
            tradingVolume: "0",
            underlyingPrice: "0",
          };


          set(function setAmmInfo(state: AppState) {
            console.log('El state seteando el amm:', amm);
            state.amm = { ...state.amm, ...amm };
          });
        });
        
       
      } else {
        console.log("Estamos en el else")
        if (handleError(get(), amm)) {
          return;
        }
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


const fetchCurrentEthUsdPriceFromPythNetwork = async (): Promise<number> => { 
  const connection = new EvmPriceServiceConnection(
    "https://hermes-beta.pyth.network"
  ); // See Hermes endpoints section below for other endpoints
  
  const priceIds = [
    // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
    "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", // ETH/USD price id in testnet
  ];

  // `getLatestPriceFeeds` returns a `PriceFeed` for each price id. It contains all information about a price and has
  // utility functions to get the current and exponentially-weighted moving average price, and other functionality.
  const priceFeeds = await connection.getLatestPriceFeeds(priceIds);
  // Get the price if it is not older than 60 seconds from the current time.
  const latestEthUsdPrice = priceFeeds![0].getPriceNoOlderThan(60); // Price { conf: '1234', expo: -8, price: '12345678' }
  const priceInWei = latestEthUsdPrice?.price;
  // Parse the price to a number
  const priceInEth = utils.formatUnits(priceInWei!, 8);
  return +priceInEth
};
