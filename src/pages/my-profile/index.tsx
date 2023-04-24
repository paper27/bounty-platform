import { type NextPage } from "next";

import { ethers } from "ethers";
import { useAccount, type Address } from "wagmi";

import { api } from "~/utils/api";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import useNextBountyNonce from "~/hooks/app/contract/read/useNextBountyNonce";
import useAwardBounty from "~/hooks/app/contract/write/useAwardBounty";
import useCancelBounty from "~/hooks/app/contract/write/useCancelBounty";

const ProfileSelf: NextPage = () => {
  const { address: addressWallet } = useAccount();
  const nonce = 3;
  const addressAwardee = "0x9743E3Dc18D3A5062AD0bd1f5547047B660B553C";

  const { nextNonce } = useNextBountyNonce();

  const { awardBounty, isEnabledAwardBounty, isAwardBountyProcessing } =
    useAwardBounty(nonce, addressAwardee);
  const { cancelBounty, isEnabledCancelBounty, isCancelBountyProcessing } =
    useCancelBounty(nonce);

  return (
    <Stack>
      <div>Next Nonce: {nextNonce}</div>

      <Stack sx={{ p: 2 }}></Stack>
      <Button
        variant="contained"
        disabled={
          !awardBounty || !isEnabledAwardBounty || isAwardBountyProcessing
        }
        onClick={async () => {
          await awardBounty?.();
        }}
      >
        award bounty
      </Button>
      <Stack sx={{ p: 2 }}></Stack>
      <Button
        variant="contained"
        disabled={
          !cancelBounty || !isEnabledCancelBounty || isCancelBountyProcessing
        }
        onClick={async () => {
          await cancelBounty?.();
        }}
      >
        cancel bounty
      </Button>
    </Stack>
  );
};

export default ProfileSelf;

/**
 * TODO:
<>1. list bounties posted by this user</>
<>2. list bounties submitted by this user</>
<>3. list bounties awarded by this user</>
 */
