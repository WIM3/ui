export const EthUsdPriceId = "0x5e463a709e58088ed5f08ee3ab6953ae8f046889" // vETH/vUSDC Pool

export const isEthUsPriceFeed = (feed: any) => {
  return typeof feed === "string" && (feed as string).includes(EthUsdPriceId)
}