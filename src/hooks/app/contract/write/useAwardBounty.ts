import { ethers } from "ethers";
import { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  type Address,
} from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useBountyInfo from "../read/useBountyInfo";

import { I_APP_AWARD_BOUNTY } from "~/common/constants";

const useAwardBounty = (nonce: number, addressAwardee: Address | undefined) => {
  const { address: addressWallet } = useAccount();
  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { bountyInfo } = useBountyInfo(addressWallet, nonce);

  const [isAwardingBounty, setIsAwardingBounty] = useState<boolean>(false);
  const isEnabledAwardBounty =
    isContractInteractionAllowed &&
    bountyInfo?.superToken !== ethers.constants.AddressZero &&
    addressAwardee !== undefined &&
    addressAwardee !== addressWallet;
  const { config: configAwardBounty } = usePrepareContractWrite({
    address: addressApp,
    abi: [I_APP_AWARD_BOUNTY],
    functionName: "awardBounty",
    args: [nonce, addressAwardee],
    enabled: isEnabledAwardBounty,
  });
  const {
    data: txResultAwardBounty,
    isLoading: isAwardBountyInitiating,
    writeAsync: awardBounty,
  } = useContractWrite({
    ...configAwardBounty,
    onSuccess: () => {
      setIsAwardingBounty(true);
    },
  });
  useWaitForTransaction({
    hash: txResultAwardBounty?.hash,
    onSuccess: (receipt) => {
      setIsAwardingBounty(false);
    },
  });
  const isAwardBountyProcessing = isAwardBountyInitiating || isAwardingBounty;

  return { awardBounty, isEnabledAwardBounty, isAwardBountyProcessing };
};

export default useAwardBounty;
