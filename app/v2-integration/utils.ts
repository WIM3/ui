export const EthUsdPriceId = "0x9C83e74e25B12273157232319956b30cf090b658" // vETH/vUSDC Pool

export const isEthUsPriceFeed = (feed: any) => {
  return typeof feed === "string" && (feed as string).includes(EthUsdPriceId)
}