import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import create from "zustand";
import { useStore } from "@/stores/root";
import { isAmmInfoValid } from "@/stores/slices/api/amm";
import { addEthUsdMarket } from "@/v2-integration/addMarket";
import { getPositions, getRecentPositions } from "@/v2-integration/getPositions";
import { providers } from "ethers";
import { Markets } from "@/types/api";

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
      ETHUSDC: "0x0708325268dF9F66270F1401206434524814508b",
      BTCUSDC: "0x6b91c20cb2F01843E07F337085e7f6cB71DD103f",
      SOLUSDC: "0x883bB1ABF2B9011456e797CE1aa9384B4177F4A6",
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
  const { setAmmInfo } = useStore((state) => state.amm);
  
  useEffect(() => {
    return setAmmInfo()
  }, [setAmmInfo]);
};

export const usePriceFeed = () => {
  const { setPriceFeed, setReady } = useStore((state) => state.priceHistory);

  useEffect(() => {
    setReady(false);
    return setPriceFeed()
      
  }, [setPriceFeed]);
};

export const useUserPositions = () => {
  const { setPositions } = useStore((state) => state.userPositions);
  useEffect(() => {
    return setPositions([]);
    
  }, [setPositions]);
};

export const useRecentPositions = () => {
  const { setPositions, setReady } = useStore((state) => state.recentPositions);
  
  useEffect(() => {
    setReady(false);
    getRecentPositions().then((positions)=> {
      return setPositions(positions)
    })
  }, [setPositions]);
};

