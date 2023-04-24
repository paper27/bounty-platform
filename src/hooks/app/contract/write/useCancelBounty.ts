import { ethers } from "ethers";
import { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useBountyInfo from "../read/useBountyInfo";

import { I_APP_CANCEL_BOUNTY } from "~/common/constants";

const useCancelBounty = (nonce: number) => {
  const { address: addressWallet } = useAccount();
  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { bountyInfo } = useBountyInfo(addressWallet, nonce);

  const [isCancelingBounty, setIsCancelingBounty] = useState<boolean>(false);
  const isEnabledCancelBounty =
    isContractInteractionAllowed &&
    bountyInfo?.superToken !== ethers.constants.AddressZero;
  const { config: configCancelBounty } = usePrepareContractWrite({
    address: addressApp,
    abi: [I_APP_CANCEL_BOUNTY],
    functionName: "cancelBounty",
    args: [nonce],
    enabled: isEnabledCancelBounty,
  });
  const {
    data: txResultCancelBounty,
    isLoading: isCancelBountyInitiating,
    writeAsync: cancelBounty,
  } = useContractWrite({
    ...configCancelBounty,
    onSuccess: () => {
      setIsCancelingBounty(true);
    },
  });
  useWaitForTransaction({
    hash: txResultCancelBounty?.hash,
    onSuccess: (receipt) => {
      setIsCancelingBounty(false);
    },
  });
  const isCancelBountyProcessing =
    isCancelBountyInitiating || isCancelingBounty;

  return { cancelBounty, isEnabledCancelBounty, isCancelBountyProcessing };
};

export default useCancelBounty;
