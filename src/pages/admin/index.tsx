import { type BigNumber, ethers } from "ethers";
import { type TransactionReceipt } from "@ethersproject/abstract-provider";

import { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  type Address,
} from "wagmi";
import { useAppStates } from "~/contexts/AppStates";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { isNumeric } from "~/utils/common";

import {
  I_APP_DEPOSIT_GEL_FUNDS,
  I_APP_WITHDRAW_GEL_FUNDS,
  I_APP_WITHDRAW_SUPERTOKEN,
  I_APP_MIN_DEPOSIT_AMOUNT,
  I_APP_MIN_FLOW_AMOUNT,
  I_APP_MAX_FLOW_DURATION_PER_UNIT_FLOW_AMOUNT,
  I_APP_ST_BUFFER_DURATION_IN_SECOND,
  I_APP_IS_ST_SUPPORTED,
  I_APP_MIN_GELATO_TREASURY_BALANCE,
  I_APP_GET_ROLE,
  I_APP_HAS_ROLE,
  I_SYMBOL,
  I_BALANCE_OF,
  I_GELATO_TREASURY_BALANCE,
  I_TRANSFER,
  ADDRESS_GELATO_FEE,
  ZERO_STRING,
} from "~/common/constants";

const Admin = () => {
  const { address: addressWallet } = useAccount();
  const {
    isContractInteractionAllowed,
    addressApp,
    addressUSDCx,
    addressGelatoTreasury,
  } = useAppStates();

  const { data: minDepositToOpenBounty } = useContractRead({
    address: addressApp,
    abi: [I_APP_MIN_DEPOSIT_AMOUNT],
    functionName: "getMinimumDepositAmount",
    args: [],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });

  const { data: minFlowToOpenBounty } = useContractRead({
    address: addressApp,
    abi: [I_APP_MIN_FLOW_AMOUNT],
    functionName: "getMinimumFlowAmount",
    args: [],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });

  const { data: maxFlowDurationPerUnitFlowAmount } = useContractRead({
    address: addressApp,
    abi: [I_APP_MAX_FLOW_DURATION_PER_UNIT_FLOW_AMOUNT],
    functionName: "getMaxFlowDurationPerUnitFlowAmount",
    args: [],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });

  const { data: stBufferDurationInSeconds } = useContractRead({
    address: addressApp,
    abi: [I_APP_ST_BUFFER_DURATION_IN_SECOND],
    functionName: "getSTBufferDurationInSecond",
    args: [],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });

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

  const { data: minGelatoTreasuryBalance } = useContractRead({
    address: addressApp,
    abi: [I_APP_MIN_GELATO_TREASURY_BALANCE],
    functionName: "getMinContractGelatoBalance",
    args: [],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });

  const { data: nativeData } = useBalance({
    address: addressWallet,
    watch: isContractInteractionAllowed,
  });
  const nativeBalance = nativeData?.value;
  const nativeSymbol = nativeData?.symbol;

  const { data: appGelatoBalance } = useContractRead({
    address: addressGelatoTreasury,
    abi: [I_GELATO_TREASURY_BALANCE],
    functionName: "userTokenBalance",
    args: [addressApp, ADDRESS_GELATO_FEE],
    enabled: isContractInteractionAllowed,
    watch: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as BigNumber;
    },
  });

  const contractArgsBalanceOf = {
    address: addressUSDCx,
    abi: [I_BALANCE_OF],
    functionName: "balanceOf",
  };
  const { data: balancesUSDCx } = useContractReads({
    contracts: [
      { ...contractArgsBalanceOf, args: [addressApp] },
      { ...contractArgsBalanceOf, args: [addressWallet] },
    ],
    enabled: isContractInteractionAllowed,
    watch: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      const data_ = data as [BigNumber, BigNumber];
      return {
        appBalance: data_[0],
        callerBalance: data_[1],
      };
    },
  });

  const { data: symbolUSDCx } = useContractRead({
    address: addressUSDCx,
    abi: [I_SYMBOL],
    functionName: "symbol",
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as string;
    },
  });

  const { data: roleTreasurer } = useContractRead({
    address: addressApp,
    abi: [I_APP_GET_ROLE],
    functionName: "getRole",
    args: ["TREASURER_ROLE"],
    enabled: isContractInteractionAllowed,
    select: (data) => {
      if (!data) return;
      return data as string;
    },
  });
  const { data: isTreasurer_ } = useContractRead({
    address: addressApp,
    abi: [I_APP_HAS_ROLE],
    functionName: "hasRole",
    args: [roleTreasurer, addressWallet],
    enabled: isContractInteractionAllowed && roleTreasurer !== undefined,
    select: (data) => {
      if (!data) return;
      return data as boolean;
    },
  });
  const isTreasurer = isTreasurer_ !== undefined ? isTreasurer_ : false;

  const [depositGelatoAmount, setDepositGelatoAmount] =
    useState<string>(ZERO_STRING);
  const depositGelatoAmountBN = ethers.utils.parseEther(
    depositGelatoAmount.length > 0 ? depositGelatoAmount : ZERO_STRING
  );
  const isInsufficientDepositGelatoAmount = depositGelatoAmountBN.gt(
    nativeBalance ?? ethers.BigNumber.from(ZERO_STRING)
  );
  const isShowDepositGelatoFundsError =
    depositGelatoAmount !== ZERO_STRING &&
    depositGelatoAmount.length > 0 &&
    isInsufficientDepositGelatoAmount;
  const [isDepositingGelatoFunds, setIsDepositingGelatoFunds] =
    useState<boolean>(false);
  const isEnabledDepositGelatoFunds =
    isContractInteractionAllowed && depositGelatoAmountBN.gt(0);
  const { config: configDepositGelatoFunds } = usePrepareContractWrite({
    address: addressApp,
    abi: [I_APP_DEPOSIT_GEL_FUNDS],
    functionName: "depositGelatoFunds",
    // args: [],
    overrides: {
      value: depositGelatoAmountBN,
    },
    enabled: isEnabledDepositGelatoFunds,
  });
  const {
    data: txResultDepositGelatoFunds,
    isLoading: isDepositGelatoFundsInitiating,
    writeAsync: depositGelatoFunds,
  } = useContractWrite({
    ...configDepositGelatoFunds,
    onSuccess: () => {
      setIsDepositingGelatoFunds(true);
    },
  });
  useWaitForTransaction({
    hash: txResultDepositGelatoFunds?.hash,
    onSuccess: (receipt) => {
      //   if (receipt === undefined) return;
      clearInputs();
      setIsDepositingGelatoFunds(false);
    },
  });
  const isDepositGelatoFundsProcessing =
    isDepositGelatoFundsInitiating || isDepositingGelatoFunds;

  const [withdrawGelatoAmount, setWithdrawGelatoAmount] =
    useState<string>(ZERO_STRING);
  const withdrawGelatoAmountBN = ethers.utils.parseEther(
    withdrawGelatoAmount.length > 0 ? withdrawGelatoAmount : ZERO_STRING
  );
  const isInsufficientWithdrawGelatoAmount = withdrawGelatoAmountBN.gt(
    appGelatoBalance ?? ethers.BigNumber.from(ZERO_STRING)
  );
  const isShowWithdrawGelatoFundsError =
    withdrawGelatoAmount !== ZERO_STRING &&
    withdrawGelatoAmount.length > 0 &&
    isInsufficientWithdrawGelatoAmount;
  const [isWithdrawingGelatoFunds, setIsWithdrawingGelatoFunds] =
    useState<boolean>(false);
  const isEnabledWithdrawGelatoFunds =
    isContractInteractionAllowed && withdrawGelatoAmountBN.gt(0) && isTreasurer;
  const { config: configWithdrawGelatoFunds } = usePrepareContractWrite({
    address: addressApp,
    abi: [I_APP_WITHDRAW_GEL_FUNDS],
    functionName: "withdrawGelatoFunds",
    args: [withdrawGelatoAmountBN],
    enabled: isEnabledWithdrawGelatoFunds,
  });
  const {
    data: txResultWithdrawGelatoFunds,
    isLoading: isWithdrawGelatoFundsInitiating,
    writeAsync: withdrawGelatoFunds,
  } = useContractWrite({
    ...configWithdrawGelatoFunds,
    onSuccess: () => {
      setIsWithdrawingGelatoFunds(true);
    },
  });
  useWaitForTransaction({
    hash: txResultWithdrawGelatoFunds?.hash,
    onSuccess: (receipt) => {
      //   if (receipt === undefined) return;
      clearInputs();
      setIsWithdrawingGelatoFunds(false);
    },
  });
  const isWithdrawGelatoFundsProcessing =
    isWithdrawGelatoFundsInitiating || isWithdrawingGelatoFunds;

  const [depositUSDCxAmount, setDepositUSDCxAmount] =
    useState<string>(ZERO_STRING);
  const depositUSDCxAmountBN = ethers.utils.parseEther(
    depositUSDCxAmount.length > 0 ? depositUSDCxAmount : ZERO_STRING
  );
  const isInsufficientDepositUSDCxAmount = depositUSDCxAmountBN.gt(
    balancesUSDCx?.callerBalance ?? ethers.BigNumber.from(ZERO_STRING)
  );
  const isShowDepositUSDCxError =
    depositUSDCxAmount !== ZERO_STRING &&
    depositUSDCxAmount.length > 0 &&
    isInsufficientDepositUSDCxAmount;
  const [isDepositingUSDCx, setIsDepositingUSDCx] = useState<boolean>(false);
  const isEnabledDepositUSDCx =
    isContractInteractionAllowed && depositUSDCxAmountBN.gt(0);
  const { config: configDepositUSDCx } = usePrepareContractWrite({
    address: addressUSDCx,
    abi: [I_TRANSFER],
    functionName: "transfer",
    args: [addressApp, depositUSDCxAmountBN],
    enabled: isEnabledDepositUSDCx,
  });
  const {
    data: txResultDepositUSDCx,
    isLoading: isDepositUSDCxInitiating,
    writeAsync: depositUSDCx,
  } = useContractWrite({
    ...configDepositUSDCx,
    onSuccess: () => {
      setIsDepositingUSDCx(true);
    },
  });
  useWaitForTransaction({
    hash: txResultDepositUSDCx?.hash,
    onSuccess: (receipt) => {
      //   if (receipt === undefined) return;

      // : TransactionReceipt | undefined

      setIsDepositingUSDCx(false);
    },
  });
  const isDepositUSDCxProcessing =
    isDepositUSDCxInitiating || isDepositingUSDCx;

  const [withdrawUSDCxAmount, setWithdrawUSDCxAmount] =
    useState<string>(ZERO_STRING);
  const withdrawUSDCxAmountBN = ethers.utils.parseEther(
    withdrawUSDCxAmount.length > 0 ? withdrawUSDCxAmount : ZERO_STRING
  );
  const isInsufficientWithdrawUSDCxAmount = withdrawUSDCxAmountBN.gt(
    balancesUSDCx?.appBalance ?? ethers.BigNumber.from(ZERO_STRING)
  );
  const isShowWithdrawUSDCxError =
    withdrawUSDCxAmount !== ZERO_STRING &&
    withdrawUSDCxAmount.length > 0 &&
    isInsufficientWithdrawUSDCxAmount;
  const [isWithdrawingUSDCx, setIsWithdrawingUSDCx] = useState<boolean>(false);
  const isEnabledWithdrawUSDCx =
    isContractInteractionAllowed && withdrawUSDCxAmountBN.gt(0) && isTreasurer;
  const { config: configWithdrawUSDCx } = usePrepareContractWrite({
    address: addressApp,
    abi: [I_APP_WITHDRAW_SUPERTOKEN],
    functionName: "withdrawSuperToken",
    args: [addressUSDCx, withdrawUSDCxAmountBN],
    enabled: isEnabledWithdrawUSDCx,
  });
  const {
    data: txResultWithdrawUSDCx,
    isLoading: isWithdrawUSDCxInitiating,
    writeAsync: withdrawUSDCx,
  } = useContractWrite({
    ...configWithdrawUSDCx,
    onSuccess: () => {
      setIsWithdrawingUSDCx(true);
    },
  });
  useWaitForTransaction({
    hash: txResultWithdrawUSDCx?.hash,
    onSuccess: (receipt) => {
      //   if (receipt === undefined) return;

      // : TransactionReceipt | undefined

      setIsWithdrawingUSDCx(false);
    },
  });
  const isWithdrawUSDCxProcessing =
    isWithdrawUSDCxInitiating || isWithdrawingUSDCx;

  const isGeneralProcessing =
    isDepositGelatoFundsProcessing ||
    isWithdrawGelatoFundsProcessing ||
    isDepositUSDCxProcessing ||
    isWithdrawUSDCxProcessing;

  const clearInputs = () => {
    setDepositGelatoAmount("");
    setWithdrawGelatoAmount("");
    setDepositUSDCxAmount("");
    setWithdrawUSDCxAmount("");
  };

  return (
    <Stack>
      <div>
        min deposit:{" "}
        {ethers.utils.formatEther(
          minDepositToOpenBounty ?? ethers.BigNumber.from(ZERO_STRING)
        )}
      </div>
      <div>
        min flow:{" "}
        {ethers.utils.formatEther(
          minFlowToOpenBounty ?? ethers.BigNumber.from(ZERO_STRING)
        )}
      </div>
      <div>
        max flow duration per unit flow amount:{" "}
        {maxFlowDurationPerUnitFlowAmount?.toString()}
      </div>
      <div>
        st buffer duration in seconds: {stBufferDurationInSeconds?.toString()}
      </div>
      <div>USDCx supported?: {isUSDCxSupported ? "yes" : "no"}</div>
      <div>
        min gelato treasury balance:{" "}
        {ethers.utils.formatEther(
          minGelatoTreasuryBalance ?? ethers.BigNumber.from(ZERO_STRING)
        )}
      </div>
      <Stack sx={{ p: 2 }}></Stack>
      <div>
        Native Balance:{" "}
        {ethers.utils.formatEther(
          nativeBalance ?? ethers.BigNumber.from(ZERO_STRING)
        )}
      </div>
      <div>
        Gelato Treasury (App):{" "}
        {ethers.utils.formatEther(
          appGelatoBalance ?? ethers.BigNumber.from(ZERO_STRING)
        )}
      </div>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <TextField
          fullWidth
          label="Deposit Gelato Treasury Amount"
          disabled={isGeneralProcessing}
          value={depositGelatoAmount}
          onChange={(event) => {
            const value = event.target.value;

            if (value.includes(".")) {
              const valueDecimal = value.split(".").at(-1) as string;
              if (valueDecimal.length > 18) return false; // standard ERC20 tokens have max 18 decimals
            }

            if (isNumeric(value) || value.length === 0)
              setDepositGelatoAmount(value.trim());
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{nativeSymbol}</InputAdornment>
            ),
          }}
          error={isShowDepositGelatoFundsError}
          helperText={isShowDepositGelatoFundsError && "Insufficient Funds"}
        />
        <Button
          variant="contained"
          disabled={
            !depositGelatoFunds ||
            !isEnabledDepositGelatoFunds ||
            isGeneralProcessing
          }
          onClick={async () => {
            await depositGelatoFunds?.();
          }}
        >
          deposit gelato funds
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <TextField
          fullWidth
          label="Withdraw Gelato Treasury Amount"
          disabled={isGeneralProcessing}
          value={withdrawGelatoAmount}
          onChange={(event) => {
            const value = event.target.value;

            if (value.includes(".")) {
              const valueDecimal = value.split(".").at(-1) as string;
              if (valueDecimal.length > 18) return false; // standard ERC20 tokens have max 18 decimals
            }

            if (isNumeric(value) || value.length === 0)
              setWithdrawGelatoAmount(value.trim());
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{nativeSymbol}</InputAdornment>
            ),
          }}
          error={isShowWithdrawGelatoFundsError}
          helperText={isShowWithdrawGelatoFundsError && "Insufficient Funds"}
        />
        <Button
          disabled={isGeneralProcessing}
          size="small"
          onClick={() => {
            setWithdrawGelatoAmount(
              ethers.utils.formatEther(
                appGelatoBalance ?? ethers.BigNumber.from(ZERO_STRING)
              )
            );
          }}
          sx={{
            fontWeight: "bold",
            display: "inline",
            p: 0,
            minWidth: 40,
            height: 16,
            lineHeight: 1,
          }}
        >
          max
        </Button>
        <Button
          variant="contained"
          disabled={
            !withdrawGelatoFunds ||
            !isEnabledWithdrawGelatoFunds ||
            isGeneralProcessing
          }
          onClick={async () => {
            await withdrawGelatoFunds?.();
          }}
        >
          withdraw gelato funds
        </Button>
      </Stack>
      <Stack sx={{ p: 2 }}></Stack>
      <div>
        {"Admin's USDCx: "}
        {ethers.utils.formatEther(
          balancesUSDCx?.callerBalance ?? ethers.BigNumber.from(ZERO_STRING)
        )}
      </div>
      <div>
        {"App's USDCx ---: "}
        {ethers.utils.formatEther(
          balancesUSDCx?.appBalance ?? ethers.BigNumber.from(ZERO_STRING)
        )}
      </div>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <TextField
          fullWidth
          label="Deposit USDCx Amount"
          disabled={isGeneralProcessing}
          value={depositUSDCxAmount}
          onChange={(event) => {
            const value = event.target.value;

            if (value.includes(".")) {
              const valueDecimal = value.split(".").at(-1) as string;
              if (valueDecimal.length > 18) return false; // standard ERC20 tokens have max 18 decimals
            }

            if (isNumeric(value) || value.length === 0)
              setDepositUSDCxAmount(value.trim());
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {symbolUSDCx ?? "USDCx"}
              </InputAdornment>
            ),
          }}
          error={isShowDepositUSDCxError}
          helperText={isShowDepositUSDCxError && "Insufficient Funds"}
        />
        <Button
          disabled={isGeneralProcessing}
          size="small"
          onClick={() => {
            setDepositUSDCxAmount(
              ethers.utils.formatEther(
                balancesUSDCx?.callerBalance ??
                  ethers.BigNumber.from(ZERO_STRING)
              )
            );
          }}
          sx={{
            fontWeight: "bold",
            display: "inline",
            p: 0,
            minWidth: 40,
            height: 16,
            lineHeight: 1,
          }}
        >
          max
        </Button>
        <Button
          variant="contained"
          disabled={
            !depositUSDCx || !isEnabledDepositUSDCx || isGeneralProcessing
          }
          onClick={async () => {
            await depositUSDCx?.();
          }}
        >
          deposit USDCx
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <TextField
          fullWidth
          label="Withdraw USDCx Amount"
          disabled={isGeneralProcessing}
          value={withdrawUSDCxAmount}
          onChange={(event) => {
            const value = event.target.value;

            if (value.includes(".")) {
              const valueDecimal = value.split(".").at(-1) as string;
              if (valueDecimal.length > 18) return false; // standard ERC20 tokens have max 18 decimals
            }

            if (isNumeric(value) || value.length === 0)
              setWithdrawUSDCxAmount(value.trim());
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {symbolUSDCx ?? "USDCx"}
              </InputAdornment>
            ),
          }}
          error={isShowWithdrawUSDCxError}
          helperText={isShowWithdrawUSDCxError && "Insufficient Funds"}
        />
        <Button
          disabled={isGeneralProcessing}
          size="small"
          onClick={() => {
            setWithdrawUSDCxAmount(
              ethers.utils.formatEther(
                balancesUSDCx?.appBalance ?? ethers.BigNumber.from(ZERO_STRING)
              )
            );
          }}
          sx={{
            fontWeight: "bold",
            display: "inline",
            p: 0,
            minWidth: 40,
            height: 16,
            lineHeight: 1,
          }}
        >
          max
        </Button>
        <Button
          variant="contained"
          disabled={
            !withdrawUSDCx || !isEnabledWithdrawUSDCx || isGeneralProcessing
          }
          onClick={async () => {
            await withdrawUSDCx?.();
          }}
        >
          withdraw USDCx
        </Button>
      </Stack>
    </Stack>
  );
};

export default Admin;
