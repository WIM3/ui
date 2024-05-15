import { ClearingHouse } from "@/defi/contracts/types";
import { PositionEvent } from "@/types/api";
import { formatUsdValue, toTokenUnit } from "@/utils/formatters";
import axios from "axios";
import BigNumber from "bignumber.js";
import { format, secondsToMilliseconds } from "date-fns";
import { ethers, providers, utils } from "ethers";
import create from "zustand";
import { PriceUpdate } from "@/types/api";
import { fetchCurrentBtcUsdPriceFromPythNetwork, fetchCurrentEthUsdPriceFromPythNetwork, fetchCurrentSolUsdPriceFromPythNetwork } from "@/v2-integration/fetchTokenPrice";
import { toDecimal } from "@/utils/number";
import { BtcUsdPriceId, EthUsdPriceId, SolUsdPriceId } from "./utils";


const clearingHouseAbi = require("../defi/contracts/abi/ClearingHouse.json")
const ammAbi = require("../defi/contracts/abi/Amm.json")

const accountBalanceAbi = require("../defi/contracts/abi/AccountBalance.json")
const vaultAbi = require("../defi/contracts/abi/Vault.json")
const exchangeAbi = require("../defi/contracts/abi/Exchange.json")

export const getPositions = async (trader: string) =>{
    if(trader == undefined){
      return []
    }
    
    const results = await axios.post('https://api.studio.thegraph.com/query/63377/galleonv2/version/latest', { query: `
      {
        positionChangeds(where: {trader: "${trader}"}, orderBy: timestamp, orderDirection: desc){
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
    let visitedAmms: any[] = []
    for(let i = 0; i< positions.length;i++){
      if(visitedAmms.includes(positions[i].amm)){
          continue
      } else {
        const amm = new ethers.Contract(positions[i].amm, ammAbi,signer)  
        const fundingRate = await amm.fundingRate()
        let [size, margin, openNotional, , , ] = await clearingHouse.getPosition(positions[i].amm, trader)
        let leverage
        if(margin.d.toString() == '0'){
          leverage = "0"
        } else {
          leverage = openNotional.d.div(margin.d)
        }
        let inputSize = await amm.getInputPrice(0, notionalToUsdcDecimals(openNotional))
        let [notional, unPnL] = await clearingHouse.getPositionNotionalAndUnrealizedPnl(positions[i].amm, trader, 1)
        console.log("pnl ", unPnL.toString())
        
        if(isOpenPosition(positions[i].positionSizeAfter, size.toString()) && Number(size.toString()) != 0){
          if(lastTimeStamp < Number(positions[i].timestamp)){
            let unPrice: number = 0;
            if(parseInt(positions[i].amm) == parseInt(EthUsdPriceId)){
                unPrice = await fetchCurrentEthUsdPriceFromPythNetwork()    
            }
            if(parseInt(positions[i].amm) == parseInt(BtcUsdPriceId)){
                unPrice = await fetchCurrentBtcUsdPriceFromPythNetwork()
            }
        
            if(parseInt(positions[i].amm) == parseInt(SolUsdPriceId)){
                unPrice = await fetchCurrentSolUsdPriceFromPythNetwork()
            }
            let entryPrice = await getEntryPrice(positions[i].timestamp, positions[i].amm)
            
            lastValidPosition = {
              amm: positions[i].amm,
              leverage: leverage.toString(),
              underlyingPrice: `${Number(toUsdFormat(unPrice.toString())) + Number(fundingRate.toString())}`,
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
        
        if(lastValidPosition != undefined){
          positonArr.push({
            position: lastValidPosition,
            history: []
          })
          return positonArr 
        }    
      }
    }
    
    return []
          
}

export const getRecentPositions = async (amm: string): Promise<PositionEvent[]> => {
    var list: PositionEvent[] = [];
    const results = await axios.post('https://api.studio.thegraph.com/query/63377/galleonv2/version/latest', { query: `
        {
          positionChangeds(orderBy: timestamp, orderDirection: desc){
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
    
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    let sPositions: any[] = []
    let traders: any[] = [] 
    for(let i = 0;i < positions.length;i++){
        if(traders.includes(positions[i].trader)){
          continue
        }
        sPositions.push(positions[i])
        traders.push(positions[i].trader)
    }

    for(let i = 0; i< sPositions.length;i++){
      const signer = provider.getSigner(sPositions[i].trader)
      const clearingHouse = new ethers.Contract(process.env.CLEARING_HOUSE!, clearingHouseAbi, signer)
      let [size, margin, openNotional, , , ] = await clearingHouse.getPosition(sPositions[i].amm, sPositions[i].trader)
      if(margin.d.toString() == '0'){
        continue
      }
      let leverage = openNotional.d.div(margin.d)
      let [notional, unPnL] = await clearingHouse.getPositionNotionalAndUnrealizedPnl(sPositions[i].amm, sPositions[i].trader, 2)
      if(isOpenPosition(sPositions[i].positionSizeAfter, size.toString()) && Number(size.toString()) != 0 && sPositions[i].amm == amm){
        let entryPrice = await getEntryPrice(sPositions[i].timestamp, sPositions[i].amm)
        list.push(
          {
            entryPrice: entryPrice,
            underlyingPrice: `${sPositions[i].spotPrice}`,
            leverage: leverage.toString(),
            timestamp: sPositions[i].timestamp,
            size: openNotional.d.div(10**12).toString(),
            type: "Changing",
            fundingPayment: `${sPositions[i].fundingPayment}`,
          })
      }
              
    }
    return list
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

export const getEntryPrice = async (timestamp: string, amm: string): Promise<string> => { 
  let symbol = 'Crypto.ETH%2FUSD'
  if(parseInt(amm) == parseInt(EthUsdPriceId)){
    symbol = 'Crypto.ETH%2FUSD'    
  }
  if(parseInt(amm) == parseInt(BtcUsdPriceId)){
    symbol = 'Crypto.BTC%2FUSD'
  }

  if(parseInt(amm) == parseInt(SolUsdPriceId)){
    symbol = 'Crypto.SOL%2FUSD'
  }

  // 1, 2, 5, 15, 30, 60, 120, 240, 360, 720, D, 1D, W, 1W, M, 1M. D, W, M are aliases for 1D, 1W, 1M correspondingly. D and 1D mean the same and equal to 1 day. 1W means 1 week. 1M means 1 month.
  const timeframe = '2'
  const from = `${Number(timestamp) - 240}`
  const to =  `${Number(timestamp) + 86400}`
  const url = `https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=${symbol}&resolution=${timeframe}&from=${from}&to=${to}`

  const response = await fetch(url)
  const data: PriceHistoryDto = await response.json()
  
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
  } else {
    price = utils.formatUnits(value, 12).split('.')[0]
  }
  
  return price;

}

const notionalToUsdcDecimals = (value: string) => {
  if(!value.includes('.')){
    return toDecimal(value, 6) 
  }
  let sValue = value.split('.')
  return toDecimal([sValue[0], sValue[1].slice(0,6)].join('.'), 6)
}