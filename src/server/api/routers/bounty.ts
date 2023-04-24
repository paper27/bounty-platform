import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  //   protectedProcedure, // NOTE: don't use protectedProcedure, not ready
} from "~/server/api/trpc";

import { onlyValidAddress } from "../../utils/common";

import { type Bounty } from "@prisma/client";

export const bountyRouter = createTRPCRouter({
  postBounty: publicProcedure
    .input(
      z.object({
        address: onlyValidAddress,
        nonce: z.number().int(),
        title: z.string().max(100),
        details: z.string().max(65535),
        durationHold: z.number().int().positive(), // seconds
        durationFlow: z.number().int().positive(), // seconds
      })
    )
    .mutation(async ({ input, ctx }) => {
      let isSuccess = false;

      try {
        await ctx.prisma.bounty.create({
          data: {
            address: input.address,
            nonce: input.nonce,
            title: input.title,
            details: input.details,
            durationHold: input.durationHold,
            durationFlow: input.durationFlow,
          },
        });
        isSuccess = true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to post bounty`,
        });
      }

      return isSuccess;
    }),
  removeBounty: publicProcedure
    .input(
      z.object({
        address: onlyValidAddress,
        nonce: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let isSuccess = false;

      try {
        await ctx.prisma.bounty.delete({
          where: {
            address_nonce: {
              address: input.address,
              nonce: input.nonce,
            },
          },
        });
        isSuccess = true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to remove bounty`,
        });
      }

      return isSuccess;
    }),
  getBounty: publicProcedure
    .input(
      z.object({
        address: onlyValidAddress,
        nonce: z.number().int(),
      })
    )
    .query(async ({ input, ctx }) => {
      let data: Bounty;
      try {
        data = await ctx.prisma.bounty.findUniqueOrThrow({
          where: {
            address_nonce: {
              address: input.address,
              nonce: input.nonce,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to find bounty`,
        });
      }

      return data;
    }),
  getBountiesForAddress: publicProcedure
    .input(
      z.object({
        address: onlyValidAddress,
      })
    )
    .query(async ({ input, ctx }) => {
      let data: Bounty[];
      try {
        data = await ctx.prisma.bounty.findMany({
          where: {
            address: input.address,
          },
          orderBy: {
            createdAt: "asc",
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to find bounties - address`,
        });
      }

      return data;
    }),
  getBounties: publicProcedure.query(async ({ ctx }) => {
    let data: Bounty[];
    try {
      data = await ctx.prisma.bounty.findMany({
        take: 50,
        orderBy: {
          createdAt: "asc",
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to find bounties`,
      });
    }

    return data;
  }),
});
