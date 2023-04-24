import { useContractRead } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import { I_SYMBOL } from "~/common/constants";

const useSymbolOfUSDCx = () => {
  const { isContractInteractionAllowed, addressUSDCx } = useAppStates();

  const { data: symbolUSDCx_ } = useContractRead({
    address: addressUSDCx,
    abi: [I_SYMBOL],
    functionName: "symbol",
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as string;
    },
  });
  const symbolUSDCx = symbolUSDCx_ !== undefined ? symbolUSDCx_ : "USDCx";

  return { symbolUSDCx };
};

export default useSymbolOfUSDCx;
