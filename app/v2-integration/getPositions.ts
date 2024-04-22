import { ClearingHouse } from "@/defi/contracts/types";
import { PositionEvent } from "@/types/api";
import { formatUsdValue, toTokenUnit } from "@/utils/formatters";
import axios from "axios";
import BigNumber from "bignumber.js";
import { format, secondsToMilliseconds } from "date-fns";
import { ethers, providers, utils } from "ethers";
import create from "zustand";
import { PriceUpdate } from "@/types/api";
import { fetchCurrentEthUsdPriceFromPythNetwork } from "@/v2-integration/fetchTokenPrice";


const clearingHouseAbi = require("../defi/contracts/abi/ClearingHouse.json")

const accountBalanceAbi = require("../defi/contracts/abi/AccountBalance.json")
const vaultAbi = require("../defi/contracts/abi/Vault.json")
const exchangeAbi = require("../defi/contracts/abi/Exchange.json")

export const getPositions = async (trader: string) =>{
    if(trader == undefined){
      return []
    }
    
    const results = await axios.post('https://api.studio.thegraph.com/query/63377/galleonv2/version/latest', { query: `
      {
        positionChangeds(where: {trader: "${trader}"}){
          id
          txHash
          trader
          amm
          margin
          positionNotional
          exchangedPositionSize
          fee
          positionSizeAfter
          realizedPnl
          unrealizedPnlAfter
          badDebt
          liquidationPenalty
          spotPrice
          fundingPayment
          blockNumberLogIndex
          blockNumber
          timestamp
        }
      }
    `
    })
    
  
    let positions: any[] = []
    if(results.data.data != undefined || results.data.data.positionChangeds != undefined){
      positions = results.data.data.positionChangeds
    }

    if(results.data.data.positionChangeds.length == 0){
      return []
    }
    // struct Position {
    //   SignedDecimal.signedDecimal size;
    //   Decimal.decimal margin;
    //   Decimal.decimal openNotional;
    //   SignedDecimal.signedDecimal lastUpdatedCumulativePremiumFraction;
    //   uint256 liquidityHistoryIndex;
    //   uint256 blockNumber;
    // }

    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const signer = provider.getSigner(trader)
    const clearingHouse = new ethers.Contract(process.env.CLEARING_HOUSE!, clearingHouseAbi, signer)
    let positonArr: any[] = []
    let lastValidPosition = undefined
    let lastTimeStamp = 0
    for(let i = 0; i < positions.length; i++){
      
      let [size, margin, openNotional, , , ] = await clearingHouse.getPosition(positions[i].amm, trader)
      if(margin.d.toString() == '0'){
        continue
      }
      console.log("size ", size.toString())
      console.log("margin ", margin.toString())
      console.log("open notional", openNotional.toString())
      let [notional, unPnL] = await clearingHouse.getPositionNotionalAndUnrealizedPnl(positions[i].amm, trader, 1)
      console.log("notional ", notional.toString())
      console.log("PnL ", unPnL.toString())
      let leverage = openNotional.d.div(margin.d)
      if(isOpenPosition(positions[i].positionSizeAfter, size.toString()) && Number(size.toString()) != 0){
        if(lastTimeStamp < Number(positions[i].timestamp)){
          let unPrice = await fetchCurrentEthUsdPriceFromPythNetwork()
          let entryPrice = await getEntryPrice(positions[i].timestamp)
          console.log("un price from pyth ", `${unPrice}`)
          console.log("underlyng price ", toUsdFormat(`${unPrice}`))
          lastValidPosition = {
            amm: positions[i].amm,
            leverage: leverage.toString(),
            underlyingPrice: toUsdFormat(unPrice.toString()),
            margin: positions[i].margin,
            fee: positions[i].fee,
            trader: positions[i].trader,
            fundingPayment: positions[i].fundingPayment,
            active: true,
            tradingVolume: positions[i].exchangedPositionSize,
            entryPrice: entryPrice,
            badDebt: positions[i].badDebt,
            size: size.toString(),
            unrealizedPnl: unPnL.toString(),
            totalPnlAmount: positions[i].unrealizedPnl,
            openNotional: openNotional.toString(),
            realizedPnl: positions[i].realizedPnl,
            liquidationPenalty: positions[i].liquidationPenalty,
            timestamp: positions[i].timestamp,
          };
        }
        
        
      }
    }
    
    if(lastValidPosition != undefined){
      positonArr.push({
        position: lastValidPosition,
        history: []
      })
      return positonArr 
    }
    return []
          
}

export const getRecentPositions = async (): Promise<PositionEvent[]> => {
    var list: PositionEvent[] = [];
    const results = await axios.post('https://api.studio.thegraph.com/query/63377/galleonv2/version/latest', { query: `
        {
          positionChangeds{
            id
            txHash
            trader
            amm
            margin
            positionNotional
            exchangedPositionSize
            fee
            positionSizeAfter
            realizedPnl
            unrealizedPnlAfter
            badDebt
            liquidationPenalty
            spotPrice
            fundingPayment
            blockNumberLogIndex
            blockNumber
            timestamp
            
          }
        }
      `
    })
    let positions: any[] = []
    if(results.data.data != undefined || results.data.data.positionChangeds != undefined){
      positions = results.data.data.positionChangeds
    }
    
    for(let i = 0; i< positions.length;i++){
      let leverage = getLeverage(Number(positions[i].positionNotional), Number(positions[i].margin))
      if(Number(positions[i].unrealizedPnlAfter) != 0){
        let entryPrice = await getEntryPrice(positions[i].timestamp)
        list.push(
          {
            entryPrice: entryPrice,
            underlyingPrice: `${positions[i].spotPrice}`,
            leverage: `${leverage}`,
            timestamp: positions[i].timestamp,
            size: `${positions[i].positionNotional}`,
            type: "Changing",
            fundingPayment: `${positions[i].fundingPayment}`,
          })
      }
              
    }
    return list
}

const getLeverage = (notional: number, margin: number) => {
    if(notional / margin <= 1){
      return 1
    }
    if(notional / margin <= 2){
      return 2
    }
    if(notional / margin <= 3){
      return 3
    }
    if(notional / margin <= 4){
      return 4
    }
    if(notional / margin <= 5){
      return 5
    }
    if(notional / margin <= 6){
      return 6
    }
    if(notional / margin <= 7){
      return 7
    }
    if(notional / margin <= 8){
      return 8
    }if(notional / margin <= 9){
      return 9
    }if(notional / margin <= 10){
      return 10
    }
}

const isOpenPosition = (subgraphSize: string, contractSize: string) => {
    if(Number(subgraphSize) == 0){
      return false
    }
    let newsSize = removeZeros(subgraphSize)
    
    let slicedcs
    if(Number(contractSize) < 0){
      slicedcs = contractSize.slice(0,newsSize.length + 1)
    } else {
      slicedcs = contractSize.slice(0,newsSize.length)
    }
    if(newsSize == slicedcs){
      return true
    }
    if(Number(slicedcs) < 0 && Number(newsSize) * -1 == Number(slicedcs)){
      return true
    }
    return false
}

const removeDot = (value: string) => {
    let newValuearr = value.split('.')
    let newValue = newValuearr.join('')
    return newValue
}

const removeZeros = (num: string) => {
    let snum = num.split('.')
    if(Number(snum[0]) > 0){
      return [snum[0], snum[1]].join('')
    } 
    let i = 0   
    for(i; i < snum[1].length; i++){
      if(Number(snum[1][i]) != 0){
        break
      }
    }
    let newNum = snum[1].slice(i,snum[1].length)
    return newNum
}



interface PriceHistoryDto { 
  t: Array<number> // timestamps
  c: Array<number> // close prices
  o: Array<number> // open prices
  h: Array<number> // high prices
  l: Array<number> // low prices
  v: Array<number> // volume
  s: string // status
}

export const getEntryPrice = async (timestamp: string): Promise<string> => { 
  const symbol = 'Crypto.ETH%2FUSD'
  // 1, 2, 5, 15, 30, 60, 120, 240, 360, 720, D, 1D, W, 1W, M, 1M. D, W, M are aliases for 1D, 1W, 1M correspondingly. D and 1D mean the same and equal to 1 day. 1W means 1 week. 1M means 1 month.
  const timeframe = '240'
  const from = timestamp
  const to =  `${Number(timestamp) + 86400}`
  const url = `https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=${symbol}&resolution=${timeframe}&from=${from}&to=${to}`

  const response = await fetch(url)
  const data: PriceHistoryDto = await response.json()
  console.log("data ", data)
  
  if (!data.t) {
    return ''
  }

  const mappedData = data.t.map((timestamp: number, index: number) => { 
    const priceInWei = utils.parseUnits(data.c[index].toString(), 18)
    return {
      timestamp,
      price: priceInWei.toString(),
    }
  }) 

  let entryPrice = toUsdFormat(mappedData[0].price)

  return entryPrice;
};

const toUsdFormat = (value: string) => {
  let price = ''
  if(value.includes('.')){
    let sValue = value.split('.')
    let decimals = sValue[1].slice(0, sValue[1].length-2)
    price = [sValue[0], decimals].join('')
    if(price.length < 10){
      price = price + "0".repeat(10 - price.length)
    }
    console.log("price splited ", price)
  } else {
    price = utils.formatUnits(value, 12).split('.')[0]
  }
  
  return price;

}