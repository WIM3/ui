import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import create from "zustand";
import { getInitialState, useStore } from "@/stores/root";
import { isAmmInfoValid } from "@/stores/slices/api/amm";
import { addEthUsdMarket } from "@/v2-integration/addMarket";
import { getPositions, getRecentPositions } from "@/v2-integration/getPositions";
import { providers } from "ethers";
import { Markets, PriceUpdate } from "@/types/api";
import { useWeb3React } from "@web3-react/core";
import { getHistoryData } from "@/stores/slices/api/priceHistory";
import { BtcUsdPriceId, EthUsdPriceId, SolUsdPriceId } from "@/v2-integration/utils";
import { fetchPriceBtcUsdHistory, fetchPriceEthUsdHistory, fetchPriceSolUsdHistory } from "@/v2-integration/fetchPriceHistory";

interface SocketStore {
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

const useSocketStore = create<SocketStore>((set) => ({
  connected: true,
  setConnected: (connected: boolean) => set(() => ({ connected })),
}));

enum SocketEvents {
  connect = "connect",
  disconnect = "disconnect",
  markets = "markets",
  ammInfo = "amm_info",
  pairPrices = "pair_prices",
  userPositions = "user_positions",
  ammPositions = "amm_positions",
}

const hasReservedEvent = (channel: string) =>
  [SocketEvents.connect, SocketEvents.disconnect].includes(
    channel as SocketEvents
  );

export const useMarkets = () => {
  const { connected, setConnected } = useSocketStore((state) => state);
  const { setMarkets } = useStore((state) => state.markets);
  const markets: Markets = {
    Crypto: {
      ETHUSDC: "0x9C83e74e25B12273157232319956b30cf090b658",
      BTCUSDC: "0x56f36E178F6552E8ef5f0cC351e14439C4b8565d",
      SOLUSDC: "0x0CEA0f26115D07C101ebBa0fe23812a5C1354Ac3",
      AVAXUSDC: "0x2e49aCCF96Fa08090aE1eEa3DA246803bd95aEC9",
    },
    SPPlatts: {
      BATCH04: "0x1a35B421551ec1437FC72ba69281376f95B5a3C4",
      BATCP04: "0x100AFFBc0E5A71a9b0F9A093442C369eB5525913",
      CNCAD00: "0x56c5fcCF5e6389965892F6d76D9445aF130b4ce0",
      ACRCA00: "0x3AbCE047D741cBbB5a0A6933449A0966d5888986",
    },
    SPIndices: {
      SPBTC: "0x9a5186e2797f59F7144Cd288789CacC5903217c4",
      SPETH: "0x3EDa393D828278A34c8f5Bf9da5d712dFb275DA5",
    },
  }
  useEffect(() => {
    
    setMarkets(markets)
  }, [setMarkets]);
};

// NOTE: This is to add the ETH/USDC market to the list of markets
// Fetch AMM Info from the API.
// The API Fetch AMMInfo from SubGraph
// Subgraph fetch AMMInfo from the blockchain
// To put that in Subgraph we need to emit the ADDPOOL event from MarketRegistry.sol
export const useAmmInfo = () => {
  const { setAmmInfo, } = useStore((state) => state.amm);
  const { amm } = useStore((state) => state.markets);
  const { setPriceFeed, setReady, latest, feed } = useStore((state) => state.priceHistory);
  const {
    account,
    chainId
  } = useWeb3React();

  useEffect(() => {
    if(chainId! === 11155420){
      if(account != null && account != undefined){
        return setAmmInfo(amm, account!)
      }
    }
  }, [setAmmInfo, amm, account,feed]);
};

export const usePriceFeed = () => {
  const { amm } = useStore((state) => state.markets);
  const { setPriceFeed, setReady, latest, feed } = useStore((state) => state.priceHistory);
  let priceData: PriceUpdate[] = feed
  useEffect(() => {
    setReady(false);
    
    if(parseInt(amm) == parseInt(EthUsdPriceId)){
        
        fetchPriceEthUsdHistory().then((data) => {
          priceData = data
          return setPriceFeed(data)
        })
        
    }
    if(parseInt(amm) == parseInt(BtcUsdPriceId)){
        fetchPriceBtcUsdHistory().then((data) => {
          priceData = data
          return setPriceFeed(data)
        })
    }

    if(parseInt(amm) == parseInt(SolUsdPriceId)){
        fetchPriceSolUsdHistory().then((data) => {
          priceData = data
          return setPriceFeed(data)
        })
    }
  }, [setPriceFeed,amm, priceData]);
};

export const useUserPositions = () => {
  const { setPositions } = useStore((state) => state.userPositions);
  const state = useStore((state) => state)
  const { feed} = useStore((state) => state.priceHistory);
  
  const {
    account,
    chainId
  } = useWeb3React();
  

  useEffect(() => {
      console.log("id ",chainId)
      if(chainId! === 11155420){
        
        getPositions(account!).then((position) => {
       
          setPositions(position);
        })
      }
      
  }, [ setPositions,account, chainId]);
};

export const useRecentPositions = () => {
  const { amm } = useStore((state) => state.markets);
  const { setPositions, setReady } = useStore((state) => state.recentPositions);
  const {
    chainId
  } = useWeb3React();
  

  useEffect(() => {
    
    if(chainId! === 11155420){
      setReady(false);
      getRecentPositions(amm).then((positions)=> {
        return setPositions(positions)
      })
    }
  }, [setPositions, chainId, amm]);
};


