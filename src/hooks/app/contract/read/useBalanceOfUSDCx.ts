import { type BigNumber } from "ethers";

import { useContractRead, type Address } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import { ZERO_BIG_NUMBER, I_BALANCE_OF } from "~/common/constants";

const useBalanceOfUSDCx = (address: Address | undefined) => {
  const { isContractInteractionAllowed, addressUSDCx } = useAppStates();

  const { data: balanceUSDCx_ } = useContractRead({
    address: addressUSDCx,
    abi: [I_BALANCE_OF],
    functionName: "balanceOf",
    args: [address],
    enabled: isContractInteractionAllowed && address !== undefined,
    watch: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const balanceUSDCx =
    balanceUSDCx_ !== undefined ? balanceUSDCx_ : ZERO_BIG_NUMBER;

  return { balanceUSDCx };
};

export default useBalanceOfUSDCx;
