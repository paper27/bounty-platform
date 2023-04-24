import { type BigNumber } from "ethers";

import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import {
  ZERO_BIG_NUMBER,
  I_APP_ST_BUFFER_DURATION_IN_SECOND,
} from "~/common/constants";

const useSTBufferDurationInSecond = () => {
  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { data: stBufferDurationInSecond_ } = useContractRead({
    address: addressApp,
    abi: [I_APP_ST_BUFFER_DURATION_IN_SECOND],
    functionName: "getSTBufferDurationInSecond",
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const stBufferDurationInSecond =
    stBufferDurationInSecond_ !== undefined
      ? stBufferDurationInSecond_
      : ZERO_BIG_NUMBER;

  return { stBufferDurationInSecond };
};

export default useSTBufferDurationInSecond;
