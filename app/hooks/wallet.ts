import { useCallback, useEffect } from "react";

import { useStore } from "@/stores/root";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkId } from "@/defi/types";
import { NETWORKS } from "@/defi/Networks";

const injectedConnector = new InjectedConnector({});

const getChainId = (chainId: number) => `0x${chainId.toString(16)}`;

const errorHandler = (error: any) => console.error(error);

const switchNetwork = (library: any) => () => {
  library.provider
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: getChainId(NetworkId.optimismTestnet) }],
    })
    .catch((error: any) => {
      if (error.code !== 4902) throw error;

      library.provider
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: getChainId(NetworkId.optimismTestnet),
              chainName: NETWORKS[NetworkId.optimismTestnet].name,
              nativeCurrency: {
                name: NETWORKS[NetworkId.optimismTestnet].nativeToken,
                symbol: NETWORKS[NetworkId.optimismTestnet].defaultTokenSymbol,
                decimals: 18,
              },
              rpcUrls: [NETWORKS[NetworkId.optimismTestnet].publicRpcUrl],
              blockExplorerUrls: [
                NETWORKS[NetworkId.optimismTestnet].etherscanLink,
              ],
            },
          ],
        })
        .catch(errorHandler);
    })
    .catch(errorHandler);
};

export const useMetamaskConnection = () => {
  const {
    active,
    chainId,
    account,
    error,
    activate: web3Activate,
    deactivate,
    library,
  } = useWeb3React();
  const { updateDetails } = useStore((store) => store.connection);
  const { showTopNotification } = useStore((store) => store.notifications);

  const activate = useCallback(() => {
    web3Activate(injectedConnector);
  }, [web3Activate]);

  useEffect(() => {
    if (!error) return;

    const message = `${error.message} You have to manually open your Metamask wallet and unlock it.`;
    showTopNotification({
      description: message,
      severity: "warning",
    });
  }, [showTopNotification, error]);

  useEffect(() => {
    injectedConnector.isAuthorized().then((authorized) => {
      authorized && web3Activate(injectedConnector);
    });
  }, [web3Activate]);

  useEffect(() => {
    updateDetails({
      active,
      chainId,
      account,
      error,
      activate,
      deactivate,
      switchNetwork: switchNetwork(library),
    });
  }, [
    active,
    chainId,
    account,
    error,
    library,
    updateDetails,
    activate,
    deactivate,
  ]);
};
