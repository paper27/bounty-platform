import { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useBountyDepositUSDCx from "../read/useBountyDepositUSDCx";

import { ZERO_BIG_NUMBER, I_APPROVE } from "~/common/constants";

const useBountyDepositUSDCxClear = () => {
  const { isContractInteractionAllowed, addressApp, addressUSDCx } =
    useAppStates();

  const { bountyDepositUSDCx } = useBountyDepositUSDCx();

  const [isClearing, setIsClearing] = useState<boolean>(false);
  const isEnabledBountyDepositUSDCxClear =
    isContractInteractionAllowed && bountyDepositUSDCx.gt(0);
  const { config: configBountyDepositUSDCxClear } = usePrepareContractWrite({
    address: addressUSDCx,
    abi: [I_APPROVE],
    functionName: "approve",
    args: [addressApp, ZERO_BIG_NUMBER],
    enabled: isEnabledBountyDepositUSDCxClear,
  });
  const {
    data: txResultBountyDepositUSDCxClear,
    isLoading: isBountyDepositUSDCxClearInitiating,
    writeAsync: postBountyDepositUSDCxClear,
  } = useContractWrite({
    ...configBountyDepositUSDCxClear,
    onSuccess: () => {
      setIsClearing(true);
    },
  });
  useWaitForTransaction({
    hash: txResultBountyDepositUSDCxClear?.hash,
    onSuccess: (receipt) => {
      setIsClearing(false);
    },
  });
  const isBountyDepositUSDCxClearProcessing =
    isBountyDepositUSDCxClearInitiating || isClearing;

  return {
    isBountyDepositUSDCxClearProcessing,
    postBountyDepositUSDCxClear,
  };
};

export default useBountyDepositUSDCxClear;
