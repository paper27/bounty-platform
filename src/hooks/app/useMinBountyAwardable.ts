import { ethers } from "ethers";

import { useState } from "react";
import useMinDepositToOpenBounty from "./contract/read/useMinDepositToOpenBounty";
import useBountyDepositUSDCx from "./contract/read/useBountyDepositUSDCx";

import { ZERO_STRING } from "~/common/constants";

const useMinBountyAwardable = () => {
  const { minDepositToOpenBounty } = useMinDepositToOpenBounty();
  const { bountyDepositUSDCx } = useBountyDepositUSDCx();

  const [minBountyAwardable, setMinBountyAwardable] =
    useState<string>(ZERO_STRING);
  const minBountyAwardableBN = ethers.utils.parseEther(
    minBountyAwardable.length > 0 ? minBountyAwardable : ZERO_STRING
  );
  const isInsufficientMinBountyAwardable = minBountyAwardableBN.lt(
    minDepositToOpenBounty
  );
  const isInvalidMinBountyAwardable =
    minBountyAwardableBN.gte(bountyDepositUSDCx);

  const isShowMinBountyAwardableError =
    minBountyAwardable !== ZERO_STRING && minBountyAwardable.length > 0;
  // &&
  // (isInsufficientMinBountyAwardable || isInvalidMinBountyAwardable);

  return {
    isShowMinBountyAwardableError,
    isInsufficientMinBountyAwardable,
    isInvalidMinBountyAwardable,
    minBountyAwardableBN,
    minBountyAwardable,
    setMinBountyAwardable,
  };
};

export default useMinBountyAwardable;
