import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import { I_APP_IS_ST_SUPPORTED } from "~/common/constants";

const useIsUSDCxSupported = () => {
  const { isContractInteractionAllowed, addressApp, addressUSDCx } =
    useAppStates();

  const { data: isUSDCxSupported_ } = useContractRead({
    address: addressApp,
    abi: [I_APP_IS_ST_SUPPORTED],
    functionName: "isSuperTokensSupported",
    args: [addressUSDCx],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as boolean;
    },
  });
  const isUSDCxSupported =
    isUSDCxSupported_ !== undefined ? isUSDCxSupported_ : false;

  return { isUSDCxSupported };
};

export default useIsUSDCxSupported;
