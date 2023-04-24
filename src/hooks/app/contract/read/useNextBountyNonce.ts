import { type BigNumber } from "ethers";

import { useContractRead, useAccount } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import { I_APP_GET_NONCE } from "~/common/constants";

const useNextBountyNonce = () => {
  const { address: addressWallet } = useAccount();

  const { isContractInteractionAllowed, addressApp } = useAppStates();

  const { data: nextNonce } = useContractRead({
    address: addressApp,
    abi: [I_APP_GET_NONCE],
    functionName: "getNonce",
    args: [addressWallet],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return (data as BigNumber).toNumber();
    },
  });

  return { nextNonce };
};

export default useNextBountyNonce;
