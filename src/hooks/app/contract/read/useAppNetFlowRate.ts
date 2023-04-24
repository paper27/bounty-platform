import { type BigNumber } from "ethers";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import { ZERO_BIG_NUMBER, I_SF_CFAV1_NET_FLOW } from "~/common/constants";

const useAppNetFlowRate = () => {
  const {
    isContractInteractionAllowed,
    addressApp,
    addressSFCFAV1,
    addressUSDCx,
  } = useAppStates();

  const { data: appNetFlowRate_ } = useContractRead({
    address: addressSFCFAV1,
    abi: [I_SF_CFAV1_NET_FLOW],
    functionName: "getNetFlow",
    args: [addressUSDCx, addressApp],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const appNetFlowRate =
    appNetFlowRate_ !== undefined ? appNetFlowRate_ : ZERO_BIG_NUMBER;

  return { appNetFlowRate };
};

export default useAppNetFlowRate;
