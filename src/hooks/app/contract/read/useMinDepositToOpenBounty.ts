import { type BigNumber } from "ethers";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import { ZERO_BIG_NUMBER, I_APP_MIN_DEPOSIT_AMOUNT } from "~/common/constants";

const useMinDepositToOpenBounty = () => {
  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { data: minDepositToOpenBounty_ } = useContractRead({
    address: addressApp,
    abi: [I_APP_MIN_DEPOSIT_AMOUNT],
    functionName: "getMinimumDepositAmount",
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const minDepositToOpenBounty =
    minDepositToOpenBounty_ !== undefined
      ? minDepositToOpenBounty_
      : ZERO_BIG_NUMBER;

  return { minDepositToOpenBounty };
};

export default useMinDepositToOpenBounty;
