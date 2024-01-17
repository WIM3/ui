import { ClearingHouse } from "@/defi/contracts/types";
import { formatUsdValue, toTokenUnit } from "@/utils/formatters";
import axios from "axios";
import BigNumber from "bignumber.js";
import { format, secondsToMilliseconds } from "date-fns";
import { ethers, providers } from "ethers";
import create from "zustand";

const provider = new providers.Web3Provider(window.ethereum as any);
const signer = provider.getSigner();

const clearingHouseAbi = require("../defi/contracts/abi/ClearingHouse.json")
const clearingHouse = new ethers.Contract(process.env.CLEARING_HOUSE!, clearingHouseAbi, signer) as ClearingHouse
const accountBalanceAbi = require("../defi/contracts/abi/AccountBalance.json")
const vaultAbi = require("../defi/contracts/abi/Vault.json")
const exchangeAbi = require("../defi/contracts/abi/Exchange.json")

export const getPositions = async () =>{
    const trader = await signer.getAddress()
    const baseToken = "0x5D571ACfeB273bE53eDc2C55A1D7BCB8E6Cfbc81"
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
        amm: "0x652455f5aA89C726C616383D75E7ed2ABE689FD4",
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

const getTraderInfo = async (trader: string, baseToken: string) => {
    const traderResult = await axios.post(
        'https://api.studio.thegraph.com/query/63377/galleon/0.2.1',{ query: `
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
    const debtResult = await axios.post('https://api.studio.thegraph.com/query/63377/galleon/0.2.1', 
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
