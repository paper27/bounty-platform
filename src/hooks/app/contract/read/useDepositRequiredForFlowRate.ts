import { type BigNumber } from "ethers";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useSTBufferDurationInSecond from "./useSTBufferDurationInSecond";
import useBalanceOfUSDCx from "./useBalanceOfUSDCx";
import useAppNetFlowRate from "./useAppNetFlowRate";

import {
  ZERO_BIG_NUMBER,
  I_SF_CFAV1_BUFFER_REQUIRED_FOR_FLOW_RATE,
} from "~/common/constants";

const useDepositRequiredForFlowRate = (flowRate: BigNumber) => {
  const {
    isContractInteractionAllowed,
    addressApp,
    addressSFCFAV1,
    addressUSDCx,
  } = useAppStates();

  const { stBufferDurationInSecond } = useSTBufferDurationInSecond();
  const { balanceUSDCx: balanceUSDCxApp } = useBalanceOfUSDCx(addressApp);
  const { appNetFlowRate } = useAppNetFlowRate();

  const { data: newBufferAmount_ } = useContractRead({
    address: addressSFCFAV1,
    abi: [I_SF_CFAV1_BUFFER_REQUIRED_FOR_FLOW_RATE],
    functionName: "getDepositRequiredForFlowRate",
    args: [addressUSDCx, flowRate],
    enabled: isContractInteractionAllowed && flowRate.gt(0),
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const bufferAmount =
    newBufferAmount_ !== undefined ? newBufferAmount_ : ZERO_BIG_NUMBER;

  // bufferAmount + ((appNetFlow + flowRate) * stBufferDurationInSecond)
  const isInsufficientAppUSDCxBalance = balanceUSDCxApp.lte(
    bufferAmount.add(appNetFlowRate.add(flowRate).mul(stBufferDurationInSecond)) // TODO: double check this eq is correct, and matches the contract code !
  );

  return { bufferAmount, isInsufficientAppUSDCxBalance };
};

export default useDepositRequiredForFlowRate;
