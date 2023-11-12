import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import create from "zustand";

import { useStore } from "@/stores/root";
import { isAmmInfoValid } from "@/stores/slices/api/amm";
import { MarketId, MARKETS, PairId } from "@/defi";

interface SocketStore {
  socket: Socket;
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

const useSocketStore = create<SocketStore>((set) => ({
  socket: io(process.env.API_URL!),
  connected: false,
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

const addChannelCommunication = (
  socket: Socket,
  channel: string,
  listener: (args: any) => void,
  param?: string
) => {
  param && socket.emit(channel, param);
  socket.on(channel, listener);

  return () => {
    !hasReservedEvent(channel) && socket.emit(channel, "STOP");
    socket.off(channel, listener);
  };
};

export const useSocketConnection = () => {
  const { socket, connected, setConnected } = useSocketStore((state) => state);
  const { setMarkets } = useStore((state) => state.markets);

  useEffect(() => {
    if (connected) return;

    return addChannelCommunication(socket, SocketEvents.connect, () =>
      setConnected(true)
    );
  }, [socket, connected, setConnected]);

  useEffect(() => {
    if (connected) return;

    return addChannelCommunication(socket, SocketEvents.disconnect, () =>
      setConnected(false)
    );
  }, [socket, connected, setConnected]);

  useEffect(() => {
    if (connected) return;

    return addChannelCommunication(socket, SocketEvents.markets, (data) => {
      //NOTE: This markets comes from BE via websocket.
      data = addEthUsdMarket(data);
      return setMarkets(data)
    }
    );
  }, [socket, connected, setMarkets]);
};

// NOTE: This is to add the ETH/USDC market to the list of markets
// Fetch AMM Info from the API.
// The API Fetch AMMInfo from SubGraph
// Subgraph fetch AMMInfo from the blockchain
// To put that in Subgraph we need to emit the ADDPOOL event from MarketRegistry.sol
export const useSocketAmmInfo = () => {
  const { socket, connected } = useSocketStore((state) => state);
  const { setAmmInfo } = useStore((state) => state.amm);
  const { amm, ready: marketsReady } = useStore((state) => state.markets);
  const ammInfoValid = useStore(isAmmInfoValid);

  useEffect(() => {
    if (!connected && !marketsReady && ammInfoValid) return;

    return addChannelCommunication(
      socket,
      SocketEvents.ammInfo,
      setAmmInfo,
      amm
    );
  }, [connected, socket, setAmmInfo, amm, marketsReady, ammInfoValid]);
};

export const useSocketPriceFeed = () => {
  const { socket, connected } = useSocketStore((state) => state);
  const { setPriceFeed, setReady } = useStore((state) => state.priceHistory);
  const { dataFeedId } = useStore((state) => state.amm);

  useEffect(() => {
    if (!connected || !dataFeedId) return;

    setReady(false);
    return addChannelCommunication(
      socket,
      SocketEvents.pairPrices,
      setPriceFeed,
      dataFeedId
    );
  }, [dataFeedId, connected, socket, setPriceFeed]);
};

export const useSocketUserPositions = () => {
  const { socket, connected } = useSocketStore((state) => state);
  const { setPositions } = useStore((state) => state.userPositions);
  const { account } = useStore((state) => state.connection);
  const { ready: marketsReady } = useStore((state) => state.markets);

  useEffect(() => {
    if (!connected || !account || !marketsReady) return;

    return addChannelCommunication(
      socket,
      SocketEvents.userPositions,
      setPositions,
      account
    );
  }, [account, connected, socket, marketsReady, setPositions]);
};

export const useSocketRecentPositions = () => {
  const { socket, connected } = useSocketStore((state) => state);
  const { setPositions, setReady } = useStore((state) => state.recentPositions);
  const { amm } = useStore((state) => state.markets);

  useEffect(() => {
    if (!connected || !amm) return;

    setReady(false);
    return addChannelCommunication(
      socket,
      SocketEvents.ammPositions,
      setPositions,
      amm
    );
  }, [amm, connected, socket, setPositions]);
};

interface Market {
  [MarketId.Crypto]: {
    [key in PairId]: string
  }
}

const addEthUsdMarket = (markets: Market): Market => {

  return {
    ...markets,
    [MarketId.Crypto]: {
      ...markets[MarketId.Crypto],
      [PairId.ETHUSDC]: "0x5e463a709e58088ed5f08Ee3AB6953Ae8f046889", // vETH/vUSDC Pool
    },
  }
}