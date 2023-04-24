import { type BigNumber } from "ethers";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useMinGelatoTreasuryBalance from "./useMinGelatoTreasuryBalance";

import {
  ZERO_BIG_NUMBER,
  ADDRESS_GELATO_FEE,
  I_GELATO_TREASURY_BALANCE,
} from "~/common/constants";

const useAppGelatoBalance = () => {
  const { isContractInteractionAllowed, addressApp, addressGelatoTreasury } =
    useAppStates();

  const { minGelatoTreasuryBalance } = useMinGelatoTreasuryBalance();

  const { data: appGelatoBalance_ } = useContractRead({
    address: addressGelatoTreasury,
    abi: [I_GELATO_TREASURY_BALANCE],
    functionName: "userTokenBalance",
    args: [addressApp, ADDRESS_GELATO_FEE],
    enabled: isContractInteractionAllowed,
    watch: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const appGelatoBalance =
    appGelatoBalance_ !== undefined ? appGelatoBalance_ : ZERO_BIG_NUMBER;
  const isInsufficientAppGelatoTreasury = appGelatoBalance.lte(
    minGelatoTreasuryBalance
  );

  return { appGelatoBalance, isInsufficientAppGelatoTreasury };
};

export default useAppGelatoBalance;
