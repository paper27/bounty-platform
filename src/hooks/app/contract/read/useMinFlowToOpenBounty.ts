import { type BigNumber } from "ethers";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import { ZERO_BIG_NUMBER, I_APP_MIN_FLOW_AMOUNT } from "~/common/constants";

const useMinFlowToOpenBounty = () => {
  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { data: minFlowToOpenBounty_ } = useContractRead({
    address: addressApp,
    abi: [I_APP_MIN_FLOW_AMOUNT],
    functionName: "getMinimumFlowAmount",
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const minFlowToOpenBounty =
    minFlowToOpenBounty_ !== undefined ? minFlowToOpenBounty_ : ZERO_BIG_NUMBER;

  return { minFlowToOpenBounty };
};

export default useMinFlowToOpenBounty;
