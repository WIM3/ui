import { PriceUpdate } from "@/types/api";
import { utils } from "ethers";

interface PriceHistoryDto { 
  t: Array<number> // timestamps
  c: Array<number> // close prices
  o: Array<number> // open prices
  h: Array<number> // high prices
  l: Array<number> // low prices
  v: Array<number> // volume
  s: string // status
}

export const fetchPriceEthUsdHistory = async (): Promise<Array<PriceUpdate>> => { 
  const symbol = 'Crypto.ETH%2FUSD'
  // 1, 2, 5, 15, 30, 60, 120, 240, 360, 720, D, 1D, W, 1W, M, 1M. D, W, M are aliases for 1D, 1W, 1M correspondingly. D and 1D mean the same and equal to 1 day. 1W means 1 week. 1M means 1 month.
  const timeframe = '240'
  const from = Math.floor(new Date('2023-09-01').getTime()/1000).toString()
  const to =  (Math.floor(Date.now()/1000)).toString()
  const url = `https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=${symbol}&resolution=${timeframe}&from=${from}&to=${to}`

  const response = await fetch(url)
  const data: PriceHistoryDto = await response.json()
  const mappedData = data.t.map((timestamp: number, index: number) => { 
    const priceInWei = utils.parseUnits(data.c[index].toString(), 18)
    return {
      timestamp,
      price: priceInWei.toString(),
    }
  }) 

  return mappedData;
};

