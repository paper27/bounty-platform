import { type BigNumber } from "ethers";
import { type Address } from "wagmi";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import { I_APP_GET_BOUNTY } from "~/common/constants";

const useBountyInfo = (
  address: Address | undefined,
  nonce: number | undefined
) => {
  //   const { address: addressWallet } = useAccount();

  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { data: bountyInfo } = useContractRead({
    address: addressApp,
    abi: [I_APP_GET_BOUNTY],
    functionName: "getBounty",
    args: [address, nonce],
    enabled:
      isContractInteractionAllowed &&
      address !== undefined &&
      nonce !== undefined,
    // watch: isContractInteractionAllowed && nonce !== undefined,
    select: (data) => {
      if (!data) return;
      const data_ = data as [
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        Address
      ]; // ref contract `LibFlow.sol`
      return {
        taskIdFlowIncrease: data_[0],
        taskIdFlowDecrease: data_[1],
        timestampIncrease: data_[2],
        timestampDecrease: data_[3],
        depositAmount: data_[4],
        depositAmountMinimum: data_[5],
        flowRate: data_[6],
        superToken: data_[7],
      };
    },
  });

  return { bountyInfo };
};

export default useBountyInfo;
