import { type NextPage } from "next";
import { ethers } from "ethers";

import { api } from "~/utils/api";

import { useState } from "react";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useMinDepositToOpenBounty from "~/hooks/app/contract/read/useMinDepositToOpenBounty";
import useMinFlowToOpenBounty from "~/hooks/app/contract/read/useMinFlowToOpenBounty";
import useMaxFlowDurationPerUnitFlowAmount from "~/hooks/app/contract/read/useMaxFlowDurationPerUnitFlowAmount";
import useIsUSDCxSupported from "~/hooks/app/contract/read/useIsUSDCxSupported";
import useAppGelatoBalance from "~/hooks/app/contract/read/useAppGelatoBalance";
import useBalanceOfUSDCx from "~/hooks/app/contract/read/useBalanceOfUSDCx";
import useSymbolOfUSDCx from "~/hooks/app/contract/read/useSymbolOfUSDCx";
import useBountyDepositUSDCx from "~/hooks/app/contract/read/useBountyDepositUSDCx";
import useBountyDepositUSDCxReq from "~/hooks/app/contract/write/useBountyDepositUSDCxReq";
import useBountyDepositUSDCxClear from "~/hooks/app/contract/write/useBountyDepositUSDCxClear";
import useMinBountyAwardable from "~/hooks/app/useMinBountyAwardable";
import useMaxDepositFlowable from "~/hooks/app/useMaxDepositFlowable";
import useDepositRequiredForFlowRate from "~/hooks/app/contract/read/useDepositRequiredForFlowRate";
import useNextBountyNonce from "~/hooks/app/contract/read/useNextBountyNonce";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { isNumeric } from "~/utils/common";
import {
  I_APP_OPEN_BOUNTY,
  ZERO_BIG_NUMBER,
  ZERO_STRING,
} from "~/common/constants";

const CreateBounty: NextPage = () => {
  const { address: addressWallet } = useAccount();
  const { isContractInteractionAllowed, addressApp, addressUSDCx } =
    useAppStates();

  const { isInsufficientAppGelatoTreasury } = useAppGelatoBalance();
  const { isUSDCxSupported } = useIsUSDCxSupported();

  const isSetupBountyAllowed =
    isContractInteractionAllowed &&
    !isInsufficientAppGelatoTreasury &&
    isUSDCxSupported;
  /**
   * PART 1 check ^ - ensure app/contract is ready, then...
   * --> allow write post to save in db, then...
   * --> fill in input for open bounty
   */

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const isValidTitle = title.length > 0;
  const isValidDescription = description.length > 0;

  const { symbolUSDCx } = useSymbolOfUSDCx();

  const { balanceUSDCx: balanceUSDCxCaller } = useBalanceOfUSDCx(addressWallet);
  const {
    isBountyDepositUSDCxReqProcessing,
    isInsufficientBountyDepositUSDCxReq,
    isShowBountyDepositUSDCxReqError,
    bountyDepositUSDCxReqBN,
    bountyDepositUSDCxReq,
    postBountyDepositUSDCxReq,
    setBountyDepositUSDCxReq,
  } = useBountyDepositUSDCxReq(); // ** amount

  const {
    isShowMinBountyAwardableError,
    isInsufficientMinBountyAwardable,
    isInvalidMinBountyAwardable,
    minBountyAwardableBN,
    minBountyAwardable,
    setMinBountyAwardable,
  } = useMinBountyAwardable();
  const { minDepositToOpenBounty } = useMinDepositToOpenBounty();
  const isInvalidMinBountyAwardableReq = minBountyAwardableBN.gte(
    bountyDepositUSDCxReqBN
  ); // ** amount min

  const { minFlowToOpenBounty } = useMinFlowToOpenBounty();
  const maxDepositFlowableReq =
    bountyDepositUSDCxReqBN.sub(minBountyAwardableBN);
  const isInsufficientFlowableDepositReq =
    maxDepositFlowableReq.lt(minFlowToOpenBounty); // ** flow amount

  const durationHold = 120; // TODO: make textfield!
  const durationFlow = 120; // TODO: make textfield!
  const isZeroHoldDuration = durationHold <= 0;
  const isZeroFlowDuration = durationFlow <= 0; // ** duration zero check

  const { maxFlowDurationPerUnitFlowAmount } =
    useMaxFlowDurationPerUnitFlowAmount();
  const isExcessiveFlowDurationReq = minFlowToOpenBounty.eq(0)
    ? false
    : maxDepositFlowableReq
        .div(minFlowToOpenBounty)
        .mul(maxFlowDurationPerUnitFlowAmount)
        .lt(durationFlow); // ** excessive flow duration // TODO: if this error occurs, display in frontend

  const newFlowRateReq = isZeroFlowDuration
    ? ZERO_BIG_NUMBER
    : maxDepositFlowableReq.div(durationFlow);
  const { isInsufficientAppUSDCxBalance: isInsufficientAppUSDCxBalanceReq } =
    useDepositRequiredForFlowRate(newFlowRateReq); // ** sufficient USDCx in app check // TODO: if this error occurs, display in frontend

  const isBountyDepositUSDCxReqAllowed =
    isSetupBountyAllowed &&
    !isInsufficientBountyDepositUSDCxReq &&
    !isInsufficientMinBountyAwardable &&
    !isInvalidMinBountyAwardableReq &&
    !isInsufficientFlowableDepositReq &&
    !isZeroHoldDuration &&
    !isZeroFlowDuration &&
    !isExcessiveFlowDurationReq &&
    !isInsufficientAppUSDCxBalanceReq &&
    isValidTitle &&
    isValidDescription;

  /**
   * PART 2 check ^ - ensure all input to open bounty is ready, then...
   * --> "approve" step
   * --> read summary of post + bounty details (using "allowance" value)
   */

  const { bountyDepositUSDCx, isInsufficientBountyDepositUSDCx } =
    useBountyDepositUSDCx(); // TODO: test - if have existing allowance, setting new approve will reset it

  const { maxDepositFlowable, isInsufficientFlowableDeposit } =
    useMaxDepositFlowable(minBountyAwardableBN);

  const isExcessiveFlowDuration = minFlowToOpenBounty.eq(0)
    ? false
    : maxDepositFlowable
        .div(minFlowToOpenBounty)
        .mul(maxFlowDurationPerUnitFlowAmount)
        .lt(durationFlow);

  const newFlowRate = isZeroFlowDuration
    ? ZERO_BIG_NUMBER
    : maxDepositFlowable.div(durationFlow);
  const { isInsufficientAppUSDCxBalance } =
    useDepositRequiredForFlowRate(newFlowRate);

  const { isBountyDepositUSDCxClearProcessing, postBountyDepositUSDCxClear } =
    useBountyDepositUSDCxClear();

  const isEnabledOpenBounty =
    isBountyDepositUSDCxReqAllowed &&
    !isInsufficientBountyDepositUSDCx &&
    !isInvalidMinBountyAwardable &&
    !isInsufficientFlowableDeposit &&
    !isExcessiveFlowDuration &&
    !isInsufficientAppUSDCxBalance;
  /**
   * PART 3 check ^ - ensure some of the checks in part 2 now valid after allowance, then...
   * --> open bounty OR clear & reset
   */
  const [isOpeningBounty, setIsOpeningBounty] = useState<boolean>(false);
  const { config: configOpenBounty } = usePrepareContractWrite({
    address: addressApp,
    abi: [I_APP_OPEN_BOUNTY],
    functionName: "openBounty",
    args: [
      addressUSDCx,
      bountyDepositUSDCx,
      minBountyAwardableBN,
      durationHold,
      durationFlow,
    ],
    enabled: isEnabledOpenBounty,
  });
  const {
    data: txResultOpenBounty,
    isLoading: isOpenBountyInitiating,
    writeAsync: openBounty,
  } = useContractWrite({
    ...configOpenBounty,
    onSuccess: () => {
      setIsOpeningBounty(true);
    },
  });
  useWaitForTransaction({
    hash: txResultOpenBounty?.hash,
    onSuccess: (receipt) => {
      setIsOpeningBounty(false);

      //   if (receipt === undefined) return;

      //   const iApp = new ethers.utils.Interface(ABI_APP);
      //   const eventTopic = iApp.getEventTopic("CreateTask");
      //   const eventLog = receipt?.logs?.find(
      //     (x) => x.topics.indexOf(eventTopic) >= 0
      //   );

      //   if (!eventLog) return;
      //   const event = iApp.parseLog(eventLog);

      //   await addTask({
      //     receiver: event.args.receiver,
      //     taskId: event.args.taskId,
      //     executeOn: event.args.executeOn.toString(),
      //   });
    },
  });
  const isOpenBountyProcessing = isOpenBountyInitiating || isOpeningBounty;

  const isGeneralProcessing =
    isBountyDepositUSDCxReqProcessing ||
    isBountyDepositUSDCxClearProcessing ||
    isOpenBountyProcessing;

  const { nextNonce } = useNextBountyNonce();
  const { mutateAsync: postBounty } = api.bounty.postBounty.useMutation();

  const clearInputs = () => {
    setTitle("");
    setDescription("");
    setBountyDepositUSDCxReq(ZERO_STRING);
    setMinBountyAwardable(ZERO_STRING);
  };

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
      {addressWallet === undefined ? (
        <Typography>Please connect wallet to create a bounty</Typography>
      ) : (
        <>
          {!isEnabledOpenBounty ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ width: "50%" }}
            >
              <Typography variant="h2">Create a Bounty</Typography>
              <Typography align="justify">
                Technical explanation of what happens when you create a bounty:
              </Typography>
              <Typography align="justify">
                The maximum bounty amount awardable (in {symbolUSDCx}) that you
                set is deposited into the app contract. You also set the holding
                period, flowing period and minimum bouny amount awardable. The
                max bounty will hold steady for the holding period after which,
                it would start to decrease where the amount slowly starts to
                flow back to your address. The bounty amount will flow for the
                entire flowing period until a minimum is reached, in which the
                flowing stops. The bounty amount can be canceled or awarded
                anytime. Full bounty amount is returned to you if canceled.
              </Typography>
              <Stack alignItems="center" justifyContent="center">
                <Typography>{`${symbolUSDCx} available: ${Number(
                  ethers.utils.formatEther(balanceUSDCxCaller)
                ).toFixed(4)}`}</Typography>
                <Typography variant="caption">
                  Using {symbolUSDCx} address: {addressUSDCx}
                </Typography>
              </Stack>
              <TextField
                fullWidth
                label="Title"
                disabled={isGeneralProcessing || !isSetupBountyAllowed}
                value={title}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length > 80) return false;
                  setTitle(value);
                }}
                InputProps={{
                  endAdornment: <Typography>{title.length}/80</Typography>,
                }}
              />
              <TextField
                fullWidth
                label="Description"
                disabled={isGeneralProcessing || !isSetupBountyAllowed}
                value={description}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length > 1000) return false;
                  setDescription(value);
                }}
                InputProps={{
                  endAdornment: (
                    <Typography>{description.length}/1000</Typography>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Maximum Bounty Prize Amount"
                disabled={isGeneralProcessing || !isSetupBountyAllowed}
                value={bountyDepositUSDCxReq}
                onChange={(event) => {
                  const value = event.target.value;

                  if (value.includes(".")) {
                    const valueDecimal = value.split(".").at(-1) as string;
                    if (valueDecimal.length > 18) return false; // standard ERC20 tokens have max 18 decimals
                  }

                  if (isNumeric(value) || value.length === 0)
                    setBountyDepositUSDCxReq(value.trim());
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {symbolUSDCx ?? "USDCx"}
                    </InputAdornment>
                  ),
                }}
                error={
                  isShowBountyDepositUSDCxReqError ||
                  Number(ethers.utils.formatEther(bountyDepositUSDCxReqBN)) > 10
                }
                helperText={
                  (isShowBountyDepositUSDCxReqError && "Insufficient Funds") ||
                  (Number(ethers.utils.formatEther(bountyDepositUSDCxReqBN)) >
                    10 &&
                    "For demo purposes, this value cannot be greater than 10")
                }
              />
              <TextField
                fullWidth
                label="Minimum Bounty Prize Amount"
                disabled={
                  isGeneralProcessing ||
                  !isSetupBountyAllowed ||
                  bountyDepositUSDCxReqBN.lte(0)
                }
                value={minBountyAwardable}
                onChange={(event) => {
                  const value = event.target.value;

                  if (value.includes(".")) {
                    const valueDecimal = value.split(".").at(-1) as string;
                    if (valueDecimal.length > 18) return false; // standard ERC20 tokens have max 18 decimals
                  }

                  if (isNumeric(value) || value.length === 0)
                    setMinBountyAwardable(value.trim());
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {symbolUSDCx ?? "USDCx"}
                    </InputAdornment>
                  ),
                }}
                error={
                  isShowMinBountyAwardableError &&
                  (isInsufficientMinBountyAwardable ||
                    isInvalidMinBountyAwardableReq ||
                    isInsufficientFlowableDepositReq)
                }
                helperText={
                  isShowMinBountyAwardableError &&
                  ((isInsufficientMinBountyAwardable &&
                    `Must be more than ${ethers.utils.formatEther(
                      minDepositToOpenBounty
                    )} - the min awardable amount`) ||
                    (isInvalidMinBountyAwardableReq &&
                      `Must be less than ${ethers.utils.formatEther(
                        bountyDepositUSDCxReqBN
                      )} - the max bounty amount stated above`) ||
                    (isInsufficientFlowableDepositReq &&
                      `Min flow amount possible is ${ethers.utils.formatEther(
                        minFlowToOpenBounty
                      )}, current: ${ethers.utils.formatEther(
                        maxDepositFlowableReq
                      )}`))
                }
              />
              <Stack spacing={1}>
                <Typography align="justify">
                  For demo purposes, the &quot;holding period&quot; and
                  &quot;flowing period&quot; are both set to {durationHold}.
                  These values are adjustable for the actual product.
                </Typography>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                disabled={
                  !postBountyDepositUSDCxReq ||
                  isBountyDepositUSDCxReqProcessing ||
                  !isBountyDepositUSDCxReqAllowed
                }
                onClick={async () => {
                  await postBountyDepositUSDCxReq?.();
                }}
              >
                approve USDCx
              </Button>
            </Stack>
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ width: "50%" }}
            >
              <Typography variant="h2">Post Bounty</Typography>
              <Button
                variant="contained"
                disabled={
                  !postBountyDepositUSDCxClear ||
                  isBountyDepositUSDCxClearProcessing ||
                  isInsufficientBountyDepositUSDCx
                }
                onClick={async () => {
                  await postBountyDepositUSDCxClear?.();

                  clearInputs();
                }}
              >
                clear allowance and reset
              </Button>
              <Button
                variant="contained"
                disabled={
                  !openBounty ||
                  isOpenBountyProcessing ||
                  !isEnabledOpenBounty ||
                  nextNonce === undefined
                }
                onClick={async () => {
                  if (!addressWallet || nextNonce === undefined) return;
                  try {
                    await openBounty?.();
                    await postBounty({
                      address: addressWallet,
                      nonce: nextNonce,
                      title: title,
                      details: description,
                      durationHold: durationHold,
                      durationFlow: durationFlow,
                    });
                  } catch (error) {
                    console.error(error);
                  }

                  clearInputs();
                }}
              >
                open bounty
              </Button>
            </Stack>
          )}
        </>
      )}

      <Stack sx={{ p: 2 }}></Stack>
      <div>
        {nextNonce} Allowance amount (debug):{" "}
        {ethers.utils.formatEther(bountyDepositUSDCx)}
      </div>
      <Stack sx={{ p: 2 }}></Stack>
    </Stack>
  );
};

export default CreateBounty;
