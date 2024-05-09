export const EthUsdPriceId = "0x9C83e74e25B12273157232319956b30cf090b658" // vETH/vUSDC Pool
export const SolUsdPriceId = "0x0CEA0f26115D07C101ebBa0fe23812a5C1354Ac3"
export const BtcUsdPriceId = "0x56f36E178F6552E8ef5f0cC351e14439C4b8565d"

export const isEthUsPriceFeed = (feed: any) => {
  return typeof feed === "string" && (feed as string).includes(EthUsdPriceId)
}