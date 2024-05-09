import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { utils } from "ethers";

export const fetchCurrentEthUsdPriceFromPythNetwork = async (): Promise<number> => { 
  const connection = new EvmPriceServiceConnection(
    "https://hermes.pyth.network/"
  ); // See Hermes endpoints section below for other endpoints
  
  const priceIds = [
    // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id in testnet
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


export const fetchCurrentSolUsdPriceFromPythNetwork = async (): Promise<number> => { 
  const connection = new EvmPriceServiceConnection(
    "https://hermes.pyth.network/"
  ); // See Hermes endpoints section below for other endpoints
  
  const priceIds = [
    // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
    "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", // SOL/USD price id in testnet
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

export const fetchCurrentBtcUsdPriceFromPythNetwork = async (): Promise<number> => { 
  const connection = new EvmPriceServiceConnection(
    "https://hermes.pyth.network/"
  ); // See Hermes endpoints section below for other endpoints
  
  const priceIds = [
    // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // SOL/USD price id in testnet
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