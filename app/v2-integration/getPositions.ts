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

export const getPositions = async (provider: providers.Web3Provider) =>{
    const signer = provider.getSigner()
    const clearingHouse = new ethers.Contract(process.env.CLEARING_HOUSE!, clearingHouseAbi, signer) as ClearingHouse
    const trader = await signer.getAddress()
    const baseToken = "0x96aB7300B34a288A68a513f056eCab0DcDDfe13f"
    const traderInfo = await getTraderInfo(trader, baseToken)

    const abAddr = await clearingHouse.getAccountBalance();
    const vaultAddr = await clearingHouse.getVault();
    const exchangeAddr = await clearingHouse.getExchange();
    const accountBalance = new ethers.Contract(abAddr, accountBalanceAbi, signer)
    const vault = new ethers.Contract(vaultAddr, vaultAbi, signer)
    const exchange = new ethers.Contract(exchangeAddr, exchangeAbi, signer)
    
    const [pnl, unrealizedPnl, fee] = await accountBalance.getPnlAndPendingFee(trader)
    const margin = await accountBalance.getMarginRequirementForLiquidation(trader)
    const markPrice = await accountBalance.getMarkPrice(baseToken);
    const positionSize = await accountBalance.getTakerPositionSize(trader, baseToken)
    const freeCollateral = await vault.getFreeCollateralByToken(trader, process.env.USDC!)
    const fundingPayment = await exchange.getPendingFundingPayment(trader, baseToken)
    const badDebt = await getBadDebt(trader)


    let position = {
        amm: "0xCcCCe04382A838f409ba002Dd3F5F44766203515",
        leverage: `${positionSize / freeCollateral}`,
        underlyingPrice: `${markPrice}`,
        margin: `${margin}`,
        fee: `${fee}`,
        trader: `${trader}`,
        fundingPayment: fundingPayment,
        active: true,
        tradingVolume: `${traderInfo.traderMarket[0].tradingVolume}`,
        entryPrice: `${traderInfo.traderMarket[0].entryPriceAfter}`,
        badDebt: `${badDebt.amount}`,
        size: `${positionSize}`,
        unrealizedPnl: `${unrealizedPnl}`,
        totalPnlAmount: `${traderInfo.totalPnl}`,
        openNotional: `${traderInfo.traderMarket[0].openNotional}`,
        realizedPnl: `${pnl}`,
        liquidationPenalty: `${traderInfo.traderMarket[0].liquidationFee}`,
        timestamp: traderInfo.traderMarket[0].timestamp,
    };
    
    return [{
        position: position,
        history: []
    }]
          
}

export const getRecentPositions = async (): Promise<PositionEvent[]> => {
    var list: PositionEvent[] = [];
    const results = await axios.post('https://api.studio.thegraph.com/query/63377/galleon/version/latest', { query: `
        {
          positionChangeds{
            id
            entryPriceAfter
            marketPriceAfter
            timestamp
            positionSizeAfter            
          }
        }
      `
    })
    let positions: any[] = []
    if(results.data.data.positionChangeds != undefined){
      positions = results.data.data.positionChangeds
    }
    
    positions.forEach((position: any) => {
      list.push(
        {
          entryPrice: `${position.entryPriceAfter}`,
          underlyingPrice: `${position.marketPriceAfter}`,
          leverage: "",
          timestamp: position.timestamp,
          size: `${position.positionSizeAfter}`,
          type: "Changing",
          fundingPayment: "",
        }       
      )      
    });
    return list
}

const getTraderInfo = async (trader: string, baseToken: string) => {
    const traderResult = await axios.post(
        'https://api.studio.thegraph.com/query/63377/galleon/version/latest',{ query: `
        {
            trader(id: "${trader}"){
              
              traderMarkets(where:{
                baseToken: "${baseToken}"
              }){
                baseToken
                entryPrice
                openNotional
                tradingVolume
                timestamp
                liquidationFee
                marketRef{
                  id
                  baseToken
                  quoteToken
                  pool
                  feeRatio
                  tradingVolume
                  tradingFee
                  blockNumberAdded
                  timestampAdded
                  blockNumber
                  timestamp
                }
              }
            }
          }
        `
        }
    )
    return traderResult.data.data.trader
}

const getBadDebt = async (trader: string) => {
    const debtResult = await axios.post('https://api.studio.thegraph.com/query/63377/galleon/version/latest', 
    { query: `
      {
        badDebtSettleds(where:{
          trader: "${trader}"
        }){
          amount
        }
      }
    `
    }) 
    return debtResult.data.data.badDebtSettleds[0]
}
