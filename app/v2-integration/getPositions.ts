import { ClearingHouse } from "@/defi/contracts/types";
import { PositionEvent } from "@/types/api";
import { formatUsdValue, toTokenUnit } from "@/utils/formatters";
import axios from "axios";
import BigNumber from "bignumber.js";
import { format, secondsToMilliseconds } from "date-fns";
import { ethers, providers } from "ethers";
import create from "zustand";


const clearingHouseAbi = require("../defi/contracts/abi/ClearingHouse.json")

const accountBalanceAbi = require("../defi/contracts/abi/AccountBalance.json")
const vaultAbi = require("../defi/contracts/abi/Vault.json")
const exchangeAbi = require("../defi/contracts/abi/Exchange.json")

export const getPositions = async (trader: string) =>{
    console.log("trader address", trader)
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
    if(results.data.data.positionChangeds.length == 0){
      return []
    }
    let positions: any[] = []
    console.log("trader  ",results.data)
    if(results.data.data.positionChangeds != undefined){
      positions = results.data.data.positionChangeds
    }
    console.log("trader amm ", positions[1].positionSizeAfter)
    console.log("id 0", positions[0].id)
    console.log("id 1", positions[1].id)
    console.log("id 2", positions[2].id)

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
    console.log("positions ", positions.length)
    let lastValidPosition = undefined
    let lastTimeStamp = 0
    for(let i = 0; i < positions.length; i++){
      let leverage = getLeverage(Number(positions[i].positionNotional), Number(positions[i].margin))
      console.log("position size ",Number(positions[i].positionSizeAfter))
      let [size, , , , , ] = await clearingHouse.getPosition(positions[i].amm, trader)
      console.log("contract position size ", size.toString())
      if(isOpenPosition(positions[i].positionSizeAfter, size.toString()) && Number(size.toString()) != 0){
        if(lastTimeStamp < Number(positions[i].timestamp)){
          lastValidPosition = {
            amm: positions[i].amm,
            leverage: `${leverage}`,
            underlyingPrice: positions[i].spotPrice,
            margin: positions[i].margin,
            fee: positions[i].fee,
            trader: positions[i].trader,
            fundingPayment: positions[i].fundingPayment,
            active: true,
            tradingVolume: positions[i].exchangedPositionSize,
            entryPrice: positions[i].positionSizeAfter,
            badDebt: positions[i].badDebt,
            size: positions[i].positionSizeAfter,
            unrealizedPnl: positions[i].unrealizedPnlAfter,
            totalPnlAmount: positions[i].unrealizedPnl,
            openNotional: positions[i].positionNotional,
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
    if(results.data.data.positionChangeds != undefined){
      positions = results.data.data.positionChangeds
    }
    
    positions.forEach((position: any) => {
      let leverage = getLeverage(Number(position.positionNotional), Number(position.margin))
      console.log("leverage ", leverage)
      if(Number(position.unrealizedPnlAfter) != 0){
        list.push(
          {
            entryPrice: `${position.positionSizeAfter}`,
            underlyingPrice: `${position.spotPrice}`,
            leverage: `${leverage}`,
            timestamp: position.timestamp,
            size: `${position.exchangedPositionSize}`,
            type: "Changing",
            fundingPayment: `${position.fundingPayment}`,
          })
      }
              
    });
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
    console.log('s cs ', slicedcs)
    console.log("n size ", newsSize)
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

