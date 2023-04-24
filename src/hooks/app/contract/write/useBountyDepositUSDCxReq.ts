import { ethers } from "ethers";

import { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useBalanceOfUSDCx from "../read/useBalanceOfUSDCx";
import useMinBountyAwardable from "../../useMinBountyAwardable";

import { ZERO_STRING, ZERO_BIG_NUMBER, I_APPROVE } from "~/common/constants";

const useBountyDepositUSDCxReq = () => {
  const { address: addressWallet } = useAccount();
  const { isContractInteractionAllowed, addressApp, addressUSDCx } =
    useAppStates();

  const { balanceUSDCx: balanceUSDCxCaller } = useBalanceOfUSDCx(addressWallet);

  const [bountyDepositUSDCxReq, setBountyDepositUSDCxReq] =
    useState<string>(ZERO_STRING);
  const bountyDepositUSDCxReqBN = ethers.utils.parseEther(
    bountyDepositUSDCxReq.length > 0 ? bountyDepositUSDCxReq : ZERO_STRING
  );
  const isInsufficientBountyDepositUSDCxReq =
    bountyDepositUSDCxReqBN.gt(balanceUSDCxCaller ?? ZERO_BIG_NUMBER) ||
    bountyDepositUSDCxReqBN.lte(0);
  const isShowBountyDepositUSDCxReqError =
    bountyDepositUSDCxReq !== ZERO_STRING &&
    bountyDepositUSDCxReq.length > 0 &&
    isInsufficientBountyDepositUSDCxReq;
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const isEnabledBountyDepositUSDCxReq =
    isContractInteractionAllowed && bountyDepositUSDCxReqBN.gt(0);
  const { config: configBountyDepositUSDCxReq } = usePrepareContractWrite({
    address: addressUSDCx,
    abi: [I_APPROVE],
    functionName: "approve",
    args: [addressApp, bountyDepositUSDCxReqBN],
    enabled: isEnabledBountyDepositUSDCxReq,
  });
  const {
    data: txResultBountyDepositUSDCxReq,
    isLoading: isBountyDepositUSDCxReqUSDCxInitiating,
    writeAsync: postBountyDepositUSDCxReq,
  } = useContractWrite({
    ...configBountyDepositUSDCxReq,
    onSuccess: () => {
      setIsRequesting(true);
    },
  });
  useWaitForTransaction({
    hash: txResultBountyDepositUSDCxReq?.hash,
    onSuccess: (receipt) => {
      setIsRequesting(false);
    },
  });
  const isBountyDepositUSDCxReqProcessing =
    isBountyDepositUSDCxReqUSDCxInitiating || isRequesting;

  return {
    isBountyDepositUSDCxReqProcessing,
    isInsufficientBountyDepositUSDCxReq,
    isShowBountyDepositUSDCxReqError,
    bountyDepositUSDCxReqBN,
    bountyDepositUSDCxReq,
    postBountyDepositUSDCxReq,
    setBountyDepositUSDCxReq,
  };
};

export default useBountyDepositUSDCxReq;
