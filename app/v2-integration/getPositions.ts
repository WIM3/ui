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
    let leverage = new BigNumber(positions[0].positionNotional).dividedBy(positions[0].margin)
    console.log("user leveraga ", leverage.toString())
    let position = {
        amm: positions[0].amm,
        leverage: leverage.toString(),
        underlyingPrice: positions[0].spotPrice,
        margin: positions[0].margin,
        fee: positions[0].fee,
        trader: positions[0].trader,
        fundingPayment: positions[0].fundingPayment,
        active: true,
        tradingVolume: positions[0].exchangedPositionSize,
        entryPrice: positions[0].positionSizeAfter,
        badDebt: positions[0].badDebt,
        size: positions[0].positionSizeAfter,
        unrealizedPnl: positions[0].unrealizedPnlAfter,
        totalPnlAmount: positions[0].unrealizedPnl,
        openNotional: positions[0].positionNotional,
        realizedPnl: positions[0].realizedPnl,
        liquidationPenalty: positions[0].liquidationPenalty,
        timestamp: positions[0].timestamp,
    };
    
    return [{
        position: position,
        history: []
    }]
          
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
      let leverage = new BigNumber(position.positionNotional).dividedBy(position.margin)
      console.log("leverage ", leverage.toString())
      list.push(
        {
          entryPrice: `${position.positionSizeAfter}`,
          underlyingPrice: `${position.spotPrice}`,
          leverage: `${leverage.toString()}`,
          timestamp: position.timestamp,
          size: `${position.exchangedPositionSize}`,
          type: "Changing",
          fundingPayment: `${position.fundingPayment}`,
        }       
      )      
    });
    return list
}

const formatToX6 = (value: string) => {
    let numberarr = value.split('.')
    let sliced = numberarr[1].slice(0,6)
    return [numberarr[0], sliced].join('')
}

const removeDot = (value: string) => {
    let newValuearr = value.split('.')
    let newValue = newValuearr.join('')
    return newValue
}

