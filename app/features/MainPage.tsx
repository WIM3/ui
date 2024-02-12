/* istanbul ignore file */
import { useContractConnection } from "@/hooks/contracts";
import {
  useAmmInfo,
  useMarkets,
  usePriceFeed,
  useRecentPositions,
  useUserPositions
} from "@/hooks/socket";
import { useNotistack } from "@/hooks/useNotistack";
import { useMetamaskConnection } from "@/hooks/wallet";
import { Contents } from "./Contents";
import { Heading } from "./Heading";
import { Loader } from "./Loader";
import { providers } from "ethers";

export const MainPage = () => {
  useNotistack();
  useMetamaskConnection();
  useContractConnection();
  useMarkets();
  useAmmInfo();
  useRecentPositions();
  usePriceFeed();
  useUserPositions();

  return (
    <Loader>
      <Heading />
      <Contents />
    </Loader>
  );
};
