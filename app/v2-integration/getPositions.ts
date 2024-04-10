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
    for(let i = 0; i < positions.length; i++){
      let leverage = getLeverage(Number(positions[i].positionNotional), Number(positions[i].margin))
      console.log("position size ",Number(positions[i].positionSizeAfter))
      let [size, , , , , ] = await clearingHouse.getPosition(positions[i].amm, trader)
      if(Number(positions[i].unrealizedPnlAfter) != 0 && Number(size) != 0){
        let p = {
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
        positonArr.push({
          position: p,
          history: []
        })
      }
    }
    
    
    return positonArr
          
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

const removeDot = (value: string) => {
    let newValuearr = value.split('.')
    let newValue = newValuearr.join('')
    return newValue
}

