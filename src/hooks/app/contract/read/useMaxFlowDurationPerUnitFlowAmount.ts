import { type BigNumber } from "ethers";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import {
  ZERO_BIG_NUMBER,
  I_APP_MAX_FLOW_DURATION_PER_UNIT_FLOW_AMOUNT,
} from "~/common/constants";

const useMaxFlowDurationPerUnitFlowAmount = () => {
  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { data: maxFlowDurationPerUnitFlowAmount_ } = useContractRead({
    address: addressApp,
    abi: [I_APP_MAX_FLOW_DURATION_PER_UNIT_FLOW_AMOUNT],
    functionName: "getMaxFlowDurationPerUnitFlowAmount",
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const maxFlowDurationPerUnitFlowAmount =
    maxFlowDurationPerUnitFlowAmount_ !== undefined
      ? maxFlowDurationPerUnitFlowAmount_
      : ZERO_BIG_NUMBER;

  return { maxFlowDurationPerUnitFlowAmount };
};

export default useMaxFlowDurationPerUnitFlowAmount;
