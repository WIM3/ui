import { useStore } from "@/stores/root";
import { useERC20, useClearingHouse } from "@/hooks/contracts";
import { Directions } from "@/defi/Directions";

export default function useOpenPosition() {
  const { amounts, direction, slippage, leverage } = useStore(
    (state) => state.tradingSidebar
  );
  const { id, quoteAsset } = useStore((state) => state.amm);
  const { openPosition } = useClearingHouse();
  const { getTokenBalance } = useERC20();

  const handleOpenPosition = () => {
    const quoteValue = amounts.quoteValue.toString();
    const side =
      direction === Directions.Long
        ? 0
        : direction === Directions.Short
        ? 1
        : -1;

    // making sure balance gets updated afterwards
    openPosition(
      id,
      quoteAsset,
      side,
      quoteValue,
      leverage,
      amounts.baseValue.multipliedBy(slippage).toString()
    ).then(() => getTokenBalance());
  };

  return {
    handleOpenPosition,
  };
}