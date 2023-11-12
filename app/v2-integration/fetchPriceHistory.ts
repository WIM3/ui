import { PriceUpdate } from "@/types/api";
import { utils } from "ethers";


export const fetchPriceEthUsdHistory = async (): Promise<Array<PriceUpdate>> => { 
  const symbol = 'Crypto.ETH/USD'
  // 1, 2, 5, 15, 30, 60, 120, 240, 360, 720, D, 1D, W, 1W, M, 1M. D, W, M are aliases for 1D, 1W, 1M correspondingly. D and 1D mean the same and equal to 1 day. 1W means 1 week. 1M means 1 month.
  const timeframe = '240'
  const from = Math.floor(new Date('2023-09-01').getTime()/1000).toString()
  const to =  (Math.floor(Date.now()/1000)).toString()
  const url = `https://benchmarks.pyth.network/v1/shims/tradingview/data_integration/history?symbol=${symbol}&resolution=${timeframe}&from=${from}&to=${to}`

  const response = await fetch(url)
  const data = await response.json()
  
  const mapToWei = (price: string) => { 
    return utils.parseUnits(price, 8).toString()
  }

  return data.t.map((timestamp: number, index: number) => { 
    return {
      timestamp,
      price: mapToWei(data.c[index].toString())
    }
  });
};