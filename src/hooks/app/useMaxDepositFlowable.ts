import { type BigNumber } from "ethers";

import useBountyDepositUSDCx from "./contract/read/useBountyDepositUSDCx";
import useMinFlowToOpenBounty from "./contract/read/useMinFlowToOpenBounty";

const useMaxDepositFlowable = (minBountyAwardable: BigNumber) => {
  const { minFlowToOpenBounty } = useMinFlowToOpenBounty();
  const { bountyDepositUSDCx } = useBountyDepositUSDCx();

  const maxDepositFlowable = bountyDepositUSDCx.sub(minBountyAwardable);
  const isInsufficientFlowableDeposit =
    maxDepositFlowable.lt(minFlowToOpenBounty);

  return { maxDepositFlowable, isInsufficientFlowableDeposit };
};

export default useMaxDepositFlowable;
