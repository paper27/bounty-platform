import { type BigNumber } from "ethers";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import {
  ZERO_BIG_NUMBER,
  I_APP_MIN_GELATO_TREASURY_BALANCE,
} from "~/common/constants";

const useMinGelatoTreasuryBalance = () => {
  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { data: minGelatoTreasuryBalance_ } = useContractRead({
    address: addressApp,
    abi: [I_APP_MIN_GELATO_TREASURY_BALANCE],
    functionName: "getMinContractGelatoBalance",
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const minGelatoTreasuryBalance =
    minGelatoTreasuryBalance_ !== undefined
      ? minGelatoTreasuryBalance_
      : ZERO_BIG_NUMBER;

  return { minGelatoTreasuryBalance };
};

export default useMinGelatoTreasuryBalance;
