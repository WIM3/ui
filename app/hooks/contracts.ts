import { BigNumber, ethers, providers, utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import create from "zustand";

import { getClearingHouseContract, getTokenContract } from "@/defi/contracts";
import { BasicTokenWithMint, ClearingHouse } from "@/defi/contracts/types";
import { NetworkId, TokenId } from "@/defi/types";
import { useStore } from "@/stores/root";

import { useSnackbar } from "@/components/Organisms/Snackbar/useSnackbar";
import { getSelectedNetwork } from "@/stores/slices/connection";
import { getPair, getProduct, getToken } from "@/defi";

interface ContractList {
  basicTokenWithMint?: BasicTokenWithMint;
  clearingHouse?: ClearingHouse;
}

interface ContractStore extends ContractList {
  setContracts: (contracts: ContractList) => void;
}

const toDecimalStruct = (d: BigNumber) => ({
  d,
});

const handleTxError = (
  err: string,
  title: string,
  description: string,
  show: Function
) => {
  if (!err.includes("user rejected transaction")) {
    show({
      title,
      description,
    });
    console.error(err);
  }
};

// TODO: We should decide whether we want to use this or not
// we are using this to speed up transactions for testing
const gasAmount = (chainId: number | undefined) => {
  switch (chainId) {
    case NetworkId.avalancheTestnet:
      return { gasLimit: 1000000 };
    default:
      return {};
  }
};

const useContractStore = create<ContractStore>((set) => ({
  setContracts: (contracts: ContractList) =>
    set((state) => ({ ...state, ...contracts })),
}));

export const useContractConnection = () => {
  const { active, chainId } = useStore((state) => state.connection);
  const { setContracts } = useContractStore((state) => state);

  useEffect(() => {
    if (!active) return;

    const provider = new providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    setContracts({
      basicTokenWithMint: getTokenContract(signer),
      clearingHouse: getClearingHouseContract(signer),
    });
  }, [active, chainId, setContracts]);
};

export const useToken = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { active, account, chainId } = useStore((state) => state.connection);
  const { setBalance } = useStore((state) => state.tradingSidebar);
  const { basicTokenWithMint } = useContractStore((state) => state);
  const gasLimit = gasAmount(chainId);

  const getTokenBalance = useCallback(async () => {
    if (!active || !account || !basicTokenWithMint) return;

    try {
      const result = await basicTokenWithMint.balanceOf(account);
      
      result && setBalance(utils.formatUnits(result, 6));
    } catch (error) {
      console.error(error);
    }
  }, [account, active, basicTokenWithMint, setBalance]);

  const mintToken = async (amount: string) => {
    if (!active || !basicTokenWithMint) return;

    setLoading(true);
    try {
      const result = await basicTokenWithMint.mint(
        utils.parseUnits(amount),
        gasLimit
      );
      await result.wait();
    } catch (error) {
      handleTxError(
        JSON.stringify(error),
        "Failed to mint token",
        "See the console for more details",
        enqueueSnackbar
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    getTokenBalance,
    mintToken,
    loading,
  };
};

// TODO: For the future we need to make sure loading is preserved after page refresh
// e.g. store transaction hashes in local storage and ask for their receipts to determine initial loading status
export const useClearingHouse = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { active, account, chainId } = useStore((state) => state.connection);
  const { basicTokenWithMint, clearingHouse } = useContractStore(
    (state) => state
  );
  const { addCloseEvent, removeCloseEvent } = useStore(
    (state) => state.userPositions
  );

  const { pairId } = useStore(
    (state) => state.markets
  );


  const gasLimit = gasAmount(chainId);
  const network = useStore(getSelectedNetwork);
  const provider = new providers.Web3Provider(window.ethereum as any);
  const signer = provider.getSigner();

  const openPosition = async (
    amm: string,
    side: number,
    quoteAssetAmount: string,
    leverage: number,
    baseAssetAmountLimit: string
  ) => {
    if (!active || !account || !clearingHouse || !basicTokenWithMint) return;
    

    setLoading(true);
    try {
      const amountToSpend = utils.parseUnits(quoteAssetAmount);

      const vaultAddr = await clearingHouse.getVault()
      // approve spending
      const approval = await basicTokenWithMint.approve(
        vaultAddr,
        amountToSpend,
        gasLimit
      );
      await approval.wait();

      const vaultAbi = require("../defi/contracts/abi/Vault.json")
      const vault = new ethers.Contract(vaultAddr, vaultAbi, signer)

      await vault.deposit(basicTokenWithMint.address, amountToSpend)

      const pair = getPair(pairId)
      const tokenId = pair.productIds[0] as TokenId
      const baseToken = getToken(tokenId)

      // get base token

      const result = await clearingHouse.openPosition(
        {
          baseToken: baseToken.address,
          isBaseToQuote: false,
          isExactInput: true,
          oppositeAmountBound: 0,
          amount: amountToSpend.mul(leverage),
          sqrtPriceLimitX96: 0,
          deadline: ethers.constants.MaxUint256,
          referralCode: ethers.constants.HashZero,
        }
      );
      // clear previously initiated close events in order to remove
      // the loading indicator for the new/updated position
      removeCloseEvent(amm);
      const confirmed = await result.wait();
      enqueueSnackbar({
        title: "Success",
        description: "Position was successfully opened",
        severity: "success",
        url: network.etherscanLink
          ? `${network.etherscanLink}tx/${confirmed.transactionHash}`
          : undefined,
      });
    } catch (error) {
      handleTxError(
        JSON.stringify(error),
        "Failed to open position",
        "See the console for more details",
        enqueueSnackbar
      );
    } finally {
      setLoading(false);
    }
  };

  const closePosition = async (amm: string, quoteAssetAmountLimit: string) => {
    if (!active || !clearingHouse) return;
    
    const pair = getPair(pairId)
    const tokenId = pair.productIds[0] as TokenId
    const baseToken = getToken(tokenId)
    
    setLoading(true);
    addCloseEvent(amm);
    try {
      const result = await clearingHouse.closePosition(
        {
          baseToken: baseToken.address,
          sqrtPriceLimitX96: 0,
          oppositeAmountBound: 0,
          deadline: ethers.constants.MaxUint256,
          referralCode: ethers.constants.HashZero,
        }
      );
      const confirmed = await result.wait();
      enqueueSnackbar({
        title: "Success",
        description: "Position was successfully closed",
        severity: "success",
        url: network.etherscanLink
          ? `${network.etherscanLink}tx/${confirmed.transactionHash}`
          : undefined,
      });
    } catch (error) {
      handleTxError(
        JSON.stringify(error),
        "Failed to close position",
        "See the console for more details",
        enqueueSnackbar
      );
      // remove the close event only in case of failure
      // in order to allow the user to retry closing it
      removeCloseEvent(amm);
    } finally {
      setLoading(false);
    }
  };

  return {
    openPosition,
    closePosition,
    loading,
  };
};
