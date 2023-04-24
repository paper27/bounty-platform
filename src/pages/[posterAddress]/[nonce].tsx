import { type NextPage } from "next";
import { ethers } from "ethers";

import { useState } from "react";
import { useRouter } from "next/router";
import { useAccount, type Address } from "wagmi";
import { useAppStates } from "~/contexts/AppStates";
import useBountyInfo from "~/hooks/app/contract/read/useBountyInfo";
import useAwardBounty from "~/hooks/app/contract/write/useAwardBounty";
import useCancelBounty from "~/hooks/app/contract/write/useCancelBounty";
import useSymbolOfUSDCx from "~/hooks/app/contract/read/useSymbolOfUSDCx";

import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ZERO_BIG_NUMBER } from "~/common/constants";

const Bounty: NextPage = () => {
  const { query, push: navigateTo } = useRouter();
  const { posterAddress, nonce } = query;
  const ownerAddress = posterAddress as Address;
  const postNonce = Number(nonce as string);

  const { address: addressWallet } = useAccount();
  const isOwner = ownerAddress === addressWallet;
  const { bountyInfo } = useBountyInfo(ownerAddress, postNonce);
  const { symbolUSDCx } = useSymbolOfUSDCx();

  const { data: bountyDetails } = api.bounty.getBounty.useQuery(
    {
      address: ownerAddress,
      nonce: postNonce,
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      select: (bounty) => {
        return {
          title: bounty.title,
          description: bounty.details,
          createdAt: bounty.createdAt,
          durationHold: bounty.durationHold,
          durationFlow: bounty.durationFlow,
        };
      },
    }
  );

  const [addressAwardee, setAddressAwardee] = useState<Address | undefined>(
    undefined
  );
  const isValidAwardeeAddress =
    addressAwardee !== undefined && ethers.utils.isAddress(addressAwardee);
  const isOwnerAddress = addressAwardee === addressWallet;
  const isShowInvalidAwardeeAddress =
    addressAwardee !== undefined &&
    addressAwardee.length > 0 &&
    (!isValidAwardeeAddress || isOwnerAddress);
  const { awardBounty, isEnabledAwardBounty, isAwardBountyProcessing } =
    useAwardBounty(postNonce, addressAwardee);
  const { cancelBounty, isEnabledCancelBounty, isCancelBountyProcessing } =
    useCancelBounty(postNonce);

  const datetimeHold = dayjs(bountyDetails?.createdAt).add(
    bountyDetails?.durationHold ?? 0,
    "second"
  );
  const datetimeFlow = datetimeHold.add(
    bountyDetails?.durationFlow ?? 0,
    "second"
  );
  const datetimeNow = dayjs(new Date());

  const isBountyFlowing = datetimeNow.isAfter(datetimeHold);
  const isBountyAtMinAmount = datetimeNow.isAfter(datetimeFlow);

  const { mutateAsync: removeBounty } = api.bounty.removeBounty.useMutation();

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
      {bountyDetails !== undefined && (
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Stack>
            <Typography variant="h5" align="left" sx={{ fontWeight: "bold" }}>
              {bountyDetails.title}
            </Typography>
            <Typography variant="caption">
              by: {ownerAddress} · {dayjs(bountyDetails.createdAt).fromNow()}
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={2}>
            <Typography align="justify" sx={{ width: "60%" }}>
              {bountyDetails.description}
            </Typography>
            <Stack sx={{ width: "40%" }}>
              <Typography
                sx={{
                  p: 1,
                  border: 2,
                  borderRadius: 2,
                  borderColor: "secondary.main",
                }}
              >
                {isBountyAtMinAmount
                  ? `Bounty Amount: ${ethers.utils.formatEther(
                      bountyInfo?.depositAmountMinimum ?? ZERO_BIG_NUMBER
                    )} ${symbolUSDCx}`
                  : `${
                      isBountyFlowing
                        ? `Bounty is decreasing at a rate of ${ethers.utils.formatEther(
                            bountyInfo?.flowRate ?? ZERO_BIG_NUMBER
                          )} ${symbolUSDCx} per second`
                        : `Bounty Amount: ${ethers.utils.formatEther(
                            bountyInfo?.depositAmount ?? ZERO_BIG_NUMBER
                          )} ${symbolUSDCx} and is scheduled to start flowing ${datetimeHold.fromNow()}`
                    }`}
              </Typography>
              <Stack sx={{ p: 2 }}></Stack>
              {isOwner && (
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    disabled={
                      !cancelBounty ||
                      !isEnabledCancelBounty ||
                      isCancelBountyProcessing ||
                      !isOwner
                    }
                    onClick={async () => {
                      await cancelBounty?.();
                      await removeBounty({
                        address: ownerAddress,
                        nonce: postNonce,
                      });
                      await navigateTo("/");
                    }}
                  >
                    Cancel Bounty
                  </Button>
                  <TextField
                    fullWidth
                    label="Awardee Address"
                    disabled={
                      //   !isEnabledAwardBounty ||
                      isAwardBountyProcessing ||
                      isCancelBountyProcessing ||
                      !isOwner
                    }
                    value={addressAwardee ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setAddressAwardee(value as Address);
                    }}
                    error={isShowInvalidAwardeeAddress}
                    helperText={
                      isShowInvalidAwardeeAddress &&
                      ((!isValidAwardeeAddress && "Invalid address") ||
                        (isOwnerAddress && "Cannot be owner address"))
                    }
                  />
                  <Button
                    variant="contained"
                    disabled={
                      !awardBounty ||
                      !isEnabledAwardBounty ||
                      isAwardBountyProcessing ||
                      isShowInvalidAwardeeAddress
                    }
                    onClick={async () => {
                      await awardBounty?.();
                      await removeBounty({
                        address: ownerAddress,
                        nonce: postNonce,
                      });
                      await navigateTo("/");
                    }}
                  >
                    Award Bounty
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default Bounty;
