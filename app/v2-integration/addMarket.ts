import { MarketId, PairId } from "@/defi"
import { EthUsdPriceId } from "./utils"

interface Market {
  [MarketId.Crypto]: {
    [key in PairId]: string
  }
}


export const addEthUsdMarket = (markets: Market): Market => {

  return {
    ...markets,
    [MarketId.Crypto]: {
      ...markets[MarketId.Crypto],
      [PairId.ETHUSDC]: EthUsdPriceId, // vETH/vUSDC Pool
    },
  }
}