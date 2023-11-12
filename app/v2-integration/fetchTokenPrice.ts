import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { utils } from "ethers";

export const fetchCurrentEthUsdPriceFromPythNetwork = async (): Promise<number> => { 
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
