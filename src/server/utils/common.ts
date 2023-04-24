import { TRPCError } from "@trpc/server";
import { ethers } from "ethers";
import { type Address } from "wagmi";
import { z } from "zod";

export const getVerifiedAddress = (address: string | null | undefined) => {
  if (!address || !ethers.utils.isAddress(address)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid address: ${JSON.stringify(address)}`,
    });
  }
  return address;
};

export const onlyValidAddress = z.custom<Address>((val) => {
  return getVerifiedAddress(val as string);
});
