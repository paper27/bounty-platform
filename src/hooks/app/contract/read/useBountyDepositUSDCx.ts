import { type BigNumber } from "ethers";

import { useContractRead, useAccount } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useBalanceOfUSDCx from "./useBalanceOfUSDCx";

import { ZERO_BIG_NUMBER, I_ALLOWANCE } from "~/common/constants";

const useBountyDepositUSDCx = () => {
  const { address: addressWallet } = useAccount();
  const { isContractInteractionAllowed, addressApp, addressUSDCx } =
    useAppStates();

  const { balanceUSDCx: balanceUSDCxCaller } = useBalanceOfUSDCx(addressWallet);

  const { data: allowanceUSDCx_ } = useContractRead({
    address: addressUSDCx,
    abi: [I_ALLOWANCE],
    functionName: "allowance",
    args: [addressWallet, addressApp],
    enabled: isContractInteractionAllowed,
    watch: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });
  const bountyDepositUSDCx =
    allowanceUSDCx_ !== undefined ? allowanceUSDCx_ : ZERO_BIG_NUMBER;
  const isInsufficientBountyDepositUSDCx =
    bountyDepositUSDCx.gt(balanceUSDCxCaller ?? ZERO_BIG_NUMBER) ||
    bountyDepositUSDCx.lte(0);

  return { bountyDepositUSDCx, isInsufficientBountyDepositUSDCx };
};

export default useBountyDepositUSDCx;
